from flask import Flask, request, make_response, jsonify
from flask_cors import CORS
from models import Users, db, Products, Chats
from flask_bcrypt import Bcrypt
import google.generativeai as genai
from datetime import timedelta
import os
import json
import requests
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = os.getenv("SECRET_KEY")
CORS(app, supports_credentials=True)
db.init_app(app)
bcrypt = Bcrypt(app)
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')


@app.before_request
def create_tables():
    db.create_all()


@app.get("/")
def home():
    return "Hello"


@app.get("/api/seed")
def seed():
    response = requests.get("https://fakestoreapi.com/products")
    data = response.json()

    for product in data:
        product = Products(title=product['title'], category=product['category'],
                           description=product['description'], price=int(product['price']), stock=100, image=product['image'])
        db.session.add(product)
        db.session.commit()

    return "Done"


@app.post("/api/signup")
def signup():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    confirm_password = data.get("confirmPassword")

    if password != confirm_password:
        return {"error": "Passwords do not match"}, 422

    user = Users.query.filter_by(email=email).first()
    if user:
        print(user.email)
        return {"error": "Email already exists"}, 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    newUser = Users(name=name, email=email, password=hashed_password)
    db.session.add(newUser)
    db.session.commit()

    return {"message": "Account created successfully"}


@app.post("/api/login")
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = Users.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return {"error": "Invalid credentials"}, 401

    response = make_response({"message": "Logged in successfully", "user": {
                             "email": user.email, "name": user.name}})

    response.set_cookie(
        'user_email',
        email,
        max_age=timedelta(days=7),
        httponly=True,
    )

    return response


@app.get("/api/logout")
def logout():
    response = make_response({"message": "Logged out successfully"})
    response.delete_cookie("user_email")
    return response


@app.get("/api/is-logged-in")
def is_logged_in():
    email = request.cookies.get("user_email")
    user = Users.query.filter_by(email=email).first()
    if not user:
        return {"error": "Unauthorized"}, 401

    return {"user": {
        "email": user.email, "name": user.name}}


@app.post("/api/get-response")
def get_response():
    email = request.cookies.get("user_email")
    user = Users.query.filter_by(email=email).first()
    if not user:
        return {"error": "Unauthorized"}, 401
    data = request.get_json()
    user_input = data.get("userInput")
    response = model.generate_content(f"You are a sales person working in an ecommerce store where we have products of the following categories : electronics, jewelery, men's clothing and women's clothing. The customer asks you this : {
        user_input}. If the user is asking for products of a specific category, respond type:'category', category:str. If the user is asking any other general question, respond as type:'basic', response:respond to the user. Only respond in the specified format.")

    actual_response = response.text.replace("```json", "").replace("```", "")
    json_response = json.loads(actual_response)
    if json_response['type'] == "basic":
        chat = Chats(message=user_input,
                     response=json_response['response'], user_email=email)
        db.session.add(chat)
        db.session.commit()
        return {"response": json_response['response']}
    else:
        category = json_response['category']
        chat = Chats(message=user_input,
                     response=category, user_email=email)
        db.session.add(chat)
        db.session.commit()
        products = Products.query.filter_by(category=category)

        return jsonify({"response": "Here are the products you asked for", "products": [{"id": product.id, "title": product.title, "price": product.price, "image": product.image, "description": product.description} for product in products]})


@app.post("/api/purchase")
def purchase():
    email = request.cookies.get("user_email")
    user = Users.query.filter_by(email=email).first()
    if not user:
        return {"error": "Unauthorized"}, 401
    product_id = request.get_json()['productId']

    product = Products.query.get(product_id)
    if product.stock == 0:
        return {"error": "Product is out of stock"}, 409
    product.stock -= 1
    db.session.commit()

    return {"message": "Product purchased successfully"}


if __name__ == "__main__":
    app.run(debug=True)

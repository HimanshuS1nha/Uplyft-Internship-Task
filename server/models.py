from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Users(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    chats = db.relationship('Chats', backref='users', lazy=True)

    createdAt = db.Column(db.DateTime, default=datetime.now)
    updatedAt = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.now)


class Chats(db.Model):
    __tablename__ = "chats"
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(200), nullable=False)
    response = db.Column(db.String(200))

    user_email = db.Column(db.String(200), db.ForeignKey(
        "users.email"), nullable=False)

    createdAt = db.Column(db.DateTime, default=datetime.now)


class Products(db.Model):
    __tablename__ = "products"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(5000), nullable=False)
    image = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    stock = db.Column(db.Integer, nullable=False)

    createdAt = db.Column(db.DateTime, default=datetime.now)

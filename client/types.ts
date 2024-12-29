export type ProductType = {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
};

export type MessageType = {
  by: "user" | "bot";
  content: string;
  products?: ProductType[];
};

export type UserType = {
  name: string;
  email: string;
};

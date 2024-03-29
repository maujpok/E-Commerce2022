import bcrypt from "bcryptjs";

export const data = {
  users: [
    {
      name: "Mauricio",
      email: "admin@example.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: true,
    },
    {
      name: "Javier",
      email: "user@example.com",
      password: bcrypt.hashSync("123456"),
    },
  ],
  products: [
    {
      name: "Nike Slim shirt 1",
      slug: "nike-slim-shirt-1",
      category: "Shirts",
      image: "/images/p1.jpg",
      price: 120,
      countInStock: 0,
      brand: "Nike",
      rating: 1,
      numReviews: 10,
      description: "High quality shirt",
    },
    {
      name: "Nike Slim shirt 2",
      slug: "nike-slim-shirt-2",
      category: "Shirts",
      image: "/images/p2.jpg",
      price: 100,
      countInStock: 10,
      brand: "Nike",
      rating: 1.5,
      numReviews: 10,
      description: "High quality shirt",
    },
    {
      name: "Nike Slim shirt 3",
      slug: "nike-slim-shirt-3",
      category: "Shirts",
      image: "/images/p3.jpg",
      price: 140,
      countInStock: 10,
      brand: "Nike",
      rating: 4.5,
      numReviews: 10,
      description: "High quality shirt",
    },
    {
      name: "Nike Slim shirt 4",
      slug: "nike-slim-shirt-4",
      category: "Shirts",
      image: "/images/p4.jpg",
      price: 110,
      countInStock: 10,
      brand: "Nike",
      rating: 4,
      numReviews: 10,
      description: "High quality shirt",
    },
    {
      name: "Nike Slim shirt 5",
      slug: "nike-slim-shirt-5",
      category: "Shirts",
      image: "/images/p5.jpg",
      price: 150,
      countInStock: 10,
      brand: "Nike",
      rating: 5,
      numReviews: 10,
      description: "High quality shirt",
    },
  ],
};

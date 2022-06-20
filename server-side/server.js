import express from "express";
import { data } from "./data.js";

const app = express();

app.get("/products", (req, res) => {
  res.send(data.products);
});

app.get("/products/slug/:product_slug", (req, res) => {
  const product = data.products.find((x) => x.slug === req.params.product_slug);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product not found" });
  }
});

app.get("/products/:id", (req, res) => {
  const product = data.products.find((x) => x._id === req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Error" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});

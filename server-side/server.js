import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/productRoutes.js";

dotenv.config();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();
app.use("/seed", seedRouter);
app.use("/products", productRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});

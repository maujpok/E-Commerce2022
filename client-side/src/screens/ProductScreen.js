import React from "react";
import { useParams } from "react-router-dom";

export default function ProductScreen() {
  const params = useParams();
  const { product_slug } = params;

  return (
    <>
      <h1>{product_slug}</h1>
    </>
  );
}

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function HomeScreen() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fecthData = async () => {
      const result = await axios.get("/products");
      setProducts(result.data);
    };
    fecthData();
  }, []);

  return (
    <>
      <h1>Featured products</h1>
      <div className="products">
        {products.map((product) => (
          <div key={product.slug} className="product">
            <Link to={`/product/${product.slug}`}>
              <img src={product.image} alt={product.name} />
            </Link>
            <div className="product-info" key={product.slug}>
              <Link to={`/product/${product.slug}`}>
                <p>{product.name}</p>
              </Link>
              <p>
                <strong>${product.price}</strong>
              </p>
              <button>Add to cart</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

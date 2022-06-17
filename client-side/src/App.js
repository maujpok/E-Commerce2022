import { data } from "./data";

export default function App() {
  return (
    <div>
      <header>
        <a href="/">E-Commerce App 2022</a>
      </header>
      <main>
        <h1>Featured products</h1>
        <div className="products">
          {data.products.map((product) => (
            <div key={product.slug} className="product">
              <a href={`/product/${product.slug}`}>
                <img src={product.image} alt={product.name} />
              </a>
              <div className="product-info" key={product.slug}>
                <a href={`/product/${product.slug}`}>
                  <p>{product.name}</p>
                </a>
                <p>
                  <strong>${product.price}</strong>
                </p>
                <button>Add to cart</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

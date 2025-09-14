import './index.css';
import ProductCard from './components/ProductCard';

function App() {
  const products = [
    { name: "Wireless Mouse", price: "25.99", status: "In Stock" },
    { name: "Keyboard", price: "45.50", status: "Out of Stock" },
    { name: "Monitor", price: "199.99", status: "In Stock" }
  ];

  return (
    <div className="app-container">
      <h2>Products List</h2>
      <div className="card-container">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            name={product.name}
            price={product.price}
            status={product.status}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
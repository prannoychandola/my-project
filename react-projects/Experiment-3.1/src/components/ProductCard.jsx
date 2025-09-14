import React from 'react';
import '../App.css';  // Correct relative path

function ProductCard(props) {
  return (
    <div className="product-card">
      <h3>{props.name}</h3>
      <p>Price: ${props.price}</p>
      <p>Status: {props.status}</p>
    </div>
  );
}

export default ProductCard;
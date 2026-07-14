import React from 'react';

export default function ProductCard({ product, cart, onAddToCart, onDeleteProduct, onUpdateProductQuantity }) {
  // Check how many are currently in the basket
  const cartItem = cart.find(item => item.id === product.id);
  const cartQty = cartItem ? cartItem.quantity : 0;
  const isMaxedOut = cartQty >= product.quantity;

  return (
    <div className="card product-card">
      <div className="product-info">
        <div className="product-header">
          <h3>{product.title}</h3>
          <span className="price">${product.price.toFixed(2)}</span>
        </div>
        {product.description && <p className="description">{product.description}</p>}
        
        <div className="inventory-controls">
          <span className="stock-label">Stock:</span>
          <div className="stepper">
            <button onClick={() => onUpdateProductQuantity(product.id, -1)} aria-label="Decrease stock">−</button>
            <span>{product.quantity}</span>
            <button onClick={() => onUpdateProductQuantity(product.id, 1)} aria-label="Increase stock">+</button>
          </div>
        </div>
      </div>
      
      <div className="product-actions">
        <button 
          onClick={() => onAddToCart(product)} 
          className="btn btn-secondary"
          disabled={isMaxedOut}
        >
          {isMaxedOut ? "Max in Basket" : "Add to Basket"}
        </button>
        <button onClick={() => onDeleteProduct(product.id)} className="btn btn-text-danger">
          Remove
        </button>
      </div>
    </div>
  );
}
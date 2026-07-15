import React from 'react';
import { useStore } from '../context/StoreContext';

export default function ProductCard({ product }) {
  const { state: { cart }, dispatch } = useStore();

  const cartQty = cart.find(item => item.id === product.id)?.quantity ?? 0;
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
            <button
              onClick={() => dispatch({ type: 'UPDATE_PRODUCT_QUANTITY', payload: { id: product.id, delta: -1 } })}
              aria-label="Decrease stock"
            >−</button>
            <span>{product.quantity}</span>
            <button
              onClick={() => dispatch({ type: 'UPDATE_PRODUCT_QUANTITY', payload: { id: product.id, delta: 1 } })}
              aria-label="Increase stock"
            >+</button>
          </div>
        </div>
      </div>

      <div className="product-actions">
        <button
          onClick={() => dispatch({ type: 'ADD_TO_CART', payload: product })}
          className="btn btn-secondary"
          disabled={isMaxedOut}
        >
          {isMaxedOut ? 'Max in Basket' : 'Add to Basket'}
        </button>
        <button
          onClick={() => dispatch({ type: 'DELETE_PRODUCT', payload: product.id })}
          className="btn btn-text-danger"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

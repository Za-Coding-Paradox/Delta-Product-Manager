import React from 'react';
import { useStore } from '../context/StoreContext';

export default function CartItem({ item }) {
  const { dispatch } = useStore();
  const lineTotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <strong>{item.title}</strong>
        <span className="cart-item-price">${item.price.toFixed(2)} each</span>
      </div>

      <div className="cart-item-controls">
        <div className="stepper">
          <button
            onClick={() => dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: item.id, delta: -1 } })}
            aria-label="Decrease quantity"
          >−</button>
          <span>{item.quantity}</span>
          <button
            onClick={() => dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: item.id, delta: 1 } })}
            aria-label="Increase quantity"
          >+</button>
        </div>
        <div className="line-total">${lineTotal.toFixed(2)}</div>
      </div>
    </div>
  );
}

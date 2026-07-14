import React from 'react';

export default function CartItem({ item, onUpdateQuantity }) {
  const lineTotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <strong>{item.title}</strong>
        <span className="cart-item-price">${item.price.toFixed(2)} each</span>
      </div>
      
      <div className="cart-item-controls">
        <div className="stepper">
          <button onClick={() => onUpdateQuantity(item.id, -1)} aria-label="Decrease quantity">−</button>
          <span>{item.quantity}</span>
          <button onClick={() => onUpdateQuantity(item.id, 1)} aria-label="Increase quantity">+</button>
        </div>
        <div className="line-total">
          ${lineTotal.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
import React from 'react';

export default function CartSummary({ cart, onClearCart }) {
  const grandTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-summary">
      <div className="grand-total">
        <span>Total Due</span>
        <span>${grandTotal.toFixed(2)}</span>
      </div>
      <button onClick={onClearCart} className="btn btn-danger full-width">
        Empty Basket
      </button>
    </div>
  );
}
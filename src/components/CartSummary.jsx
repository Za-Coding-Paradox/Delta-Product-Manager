import React from 'react';
import { useStore } from '../context/StoreContext';

export default function CartSummary() {
  const { state: { cart }, dispatch } = useStore();
  const grandTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-summary">
      <div className="grand-total">
        <span>Total Due</span>
        <span>${grandTotal.toFixed(2)}</span>
      </div>
      <button
        onClick={() => dispatch({ type: 'CLEAR_CART' })}
        className="btn btn-danger full-width"
      >
        Empty Basket
      </button>
    </div>
  );
}

import React from 'react';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

export default function Cart({ cart, onUpdateQuantity, onClearCart }) {
  return (
    <section className="card cart-card">
      <h2>Customer Basket</h2>
      {cart.length === 0 ? (
        <div className="empty-state">
          <p>The basket is waiting for some items. Try adding something from your inventory!</p>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item) => (
              <CartItem 
                key={item.id} 
                item={item} 
                onUpdateQuantity={onUpdateQuantity} 
              />
            ))}
          </div>
          <CartSummary cart={cart} onClearCart={onClearCart} />
        </div>
      )}
    </section>
  );
}
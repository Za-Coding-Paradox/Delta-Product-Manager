import React from 'react';
import ProductCard from './ProductCard';

export default function ProductList({ products, cart, onAddToCart, onDeleteProduct, onUpdateProductQuantity }) {
  return (
    <section className="product-list-section">
      <h2>Your Products</h2>
      {products.length === 0 ? (
        <div className="empty-state">
          <p>Your shop is currently empty. Add your first product above to get started!</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              cart={cart}
              onAddToCart={onAddToCart} 
              onDeleteProduct={onDeleteProduct} 
              onUpdateProductQuantity={onUpdateProductQuantity}
            />
          ))}
        </div>
      )}
    </section>
  );
}
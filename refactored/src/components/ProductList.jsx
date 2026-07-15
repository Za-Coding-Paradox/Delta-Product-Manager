import React from 'react';
import ProductCard from './ProductCard';
import { useStore } from '../context/StoreContext';

export default function ProductList() {
  const { state: { products } } = useStore();

  return (
    <section className="product-list-section">
      <h2>Your Products</h2>
      {products.length === 0 ? (
        <div className="empty-state">
          <p>Your shop is currently empty. Add your first product above to get started!</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

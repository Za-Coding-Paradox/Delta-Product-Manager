import React from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import Cart from './components/Cart';

export default function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Store Manager</h1>
        <p>Manage your inventory stock and preview customer checkouts.</p>
      </header>

      <main className="grid-layout">
        <div className="left-panel">
          <ProductForm />
        </div>
        <div className="right-panel">
          <Cart />
          <ProductList />
        </div>
      </main>
    </div>
  );
}

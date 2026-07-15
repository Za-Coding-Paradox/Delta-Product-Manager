import React, { useState } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Modal from './components/Modal';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand">
            <h1>Store Manager</h1>
            <p>Manage your inventory stock and preview customer checkouts.</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Product
          </button>
        </div>
      </header>

      <main className="grid-layout">
        <div className="left-panel">
          <ProductList />
        </div>
        <div className="right-panel">
          <Cart />
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Product"
      >
        <ProductForm />
      </Modal>
    </div>
  );
}

import React, { useState } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import Cart from './components/Cart';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  // --- Handlers ---
  const handleAddProduct = (newProduct) => {
    // A product is only a duplicate if BOTH the title and price match
    const existingProduct = products.find(
      (p) => 
        p.title.toLowerCase().trim() === newProduct.title.toLowerCase().trim() && 
        p.price === newProduct.price
    );

    if (existingProduct) {
      // Increase existing stock by the new quantity provided
      // have to use react provided setProducts to manage state
      setProducts(products.map((p) =>
        p.id === existingProduct.id
          ? { ...p, quantity: p.quantity + newProduct.quantity }
          : p
      ));
    } else {
      // Add as a brand new product
      setProducts([...products, newProduct]);
    }
  };

  const handleUpdateProductQuantity = (id, delta) => {
    const existingProduct = products.find(p => p.id === id);
    if (!existingProduct) return;

    const newStock = existingProduct.quantity + delta;

    if (newStock <= 0) {
      setProducts(products.filter((p) => p.id !== id));
      setCart(cart.filter((item) => item.id !== id));
    } else {
      setProducts(products.map((p) => 
        p.id === id ? { ...p, quantity: newStock } : p
      ));
      
      // Safety check: If inventory drops below what's currently in the cart, reduce the cart amount!
      const cartItem = cart.find(item => item.id === id);
      if (cartItem && cartItem.quantity > newStock) {
        setCart(cart.map(item => item.id === id ? { ...item, quantity: newStock } : item));
      }
    }
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleAddToCart = (product) => {
    const stockLimit = product.quantity;
    
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      
      if (existing) {
        // Block adding if it exceeds available inventory stock
        if (existing.quantity >= stockLimit) return prev; 
        
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id, delta) => {
    const stockLimit = products.find(p => p.id === id)?.quantity || 0;

    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          // Block increasing past stock limit, but allow decreasing
          if (newQuantity > stockLimit) return item; 
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Store Manager</h1>
        <p>Manage your inventory stock and preview customer checkouts.</p>
      </header>
      
      <main className="grid-layout">
        <div className="left-panel">
          <ProductForm onAddProduct={handleAddProduct} />
          {/* We now pass 'cart' down so products know if they are maxed out */}
          <ProductList 
            products={products} 
            cart={cart}
            onAddToCart={handleAddToCart} 
            onDeleteProduct={handleDeleteProduct} 
            onUpdateProductQuantity={handleUpdateProductQuantity}
          />
        </div>
        <div className="right-panel">
          <Cart 
            cart={cart} 
            onUpdateQuantity={updateCartQuantity} 
            onClearCart={clearCart} 
          />
        </div>
      </main>
    </div>
  );
}
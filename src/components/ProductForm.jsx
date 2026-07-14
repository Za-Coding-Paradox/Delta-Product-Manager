import React, { useState } from 'react';

export default function ProductForm({ onAddProduct }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1); // Defaults to 1
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      return setError("Oops! Your product needs a name.");
    }
    
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return setError("Please enter a valid price (it can't be negative!).");
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      return setError("Starting quantity must be at least 1.");
    }

    onAddProduct({
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      price: parsedPrice,
      quantity: parsedQuantity
    });

    // Reset form
    setTitle(''); 
    setDescription(''); 
    setPrice('');
    setQuantity(1);
  };

  return (
    <section className="card">
      <h2>Add to Inventory</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="form-layout">
        <div className="form-group">
          <label>What are you selling?</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g., Handcrafted Ceramic Mug"
          />
        </div>
        <div className="form-group">
          <label>Tell us a bit about it (optional)</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            rows="2"
            placeholder="What makes this item special?"
          />
        </div>
        
        {/* We use a side-by-side layout for Price and Quantity to keep it clean */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Price per unit ($)</label>
            <input 
              type="number" 
              step="0.01" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              placeholder="0.00"
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Initial Quantity</label>
            <input 
              type="number" 
              step="1" 
              min="1"
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)} 
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Create Product</button>
      </form>
    </section>
  );
}
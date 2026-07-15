import React, { useReducer } from 'react';
import { useStore } from '../context/StoreContext';

// ─── Local Form Reducer ───────────────────────────────────────────────────────
const initialForm = { title: '', description: '', price: '', quantity: 1, error: '' };

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value, error: '' };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'RESET':
      return initialForm;
    default:
      return state;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProductForm() {
  const { dispatch } = useStore();
  const [form, formDispatch] = useReducer(formReducer, initialForm);

  const setField = (field, value) => formDispatch({ type: 'SET_FIELD', field, value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim())
      return formDispatch({ type: 'SET_ERROR', error: "Oops! Your product needs a name." });

    const parsedPrice = parseFloat(form.price);
    if (isNaN(parsedPrice) || parsedPrice < 0)
      return formDispatch({ type: 'SET_ERROR', error: "Please enter a valid price (it can't be negative!)." });

    const parsedQuantity = parseInt(form.quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1)
      return formDispatch({ type: 'SET_ERROR', error: "Starting quantity must be at least 1." });

    dispatch({
      type: 'ADD_PRODUCT',
      payload: {
        id: Date.now(),
        title: form.title.trim(),
        description: form.description.trim(),
        price: parsedPrice,
        quantity: parsedQuantity,
      },
    });

    formDispatch({ type: 'RESET' });
  };

  return (
    <section className="card">
      <h2>Add to Inventory</h2>
      {form.error && <div className="error-message">{form.error}</div>}

      <form onSubmit={handleSubmit} className="form-layout">
        <div className="form-group">
          <label>What are you selling?</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setField('title', e.target.value)}
            placeholder="e.g., Handcrafted Ceramic Mug"
          />
        </div>

        <div className="form-group">
          <label>Tell us a bit about it (optional)</label>
          <textarea
            value={form.description}
            onChange={e => setField('description', e.target.value)}
            rows="2"
            placeholder="What makes this item special?"
          />
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Price per unit ($)</label>
            <input
              type="number"
              step="0.05"
              value={form.price}
              onChange={e => setField('price', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Initial Quantity</label>
            <input
              type="number"
              step="1"
              min="1"
              value={form.quantity}
              onChange={e => setField('quantity', e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Create Product</button>
      </form>
    </section>
  );
}

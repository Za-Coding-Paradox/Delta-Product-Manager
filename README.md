# 🛒 React Store Manager & Point of Sale

A minimal, single-page React application for managing store inventory and simulating customer checkouts. Built with a focus on clean, component-based architecture and robust state management.

## ✨ Features

* **Inventory Management**
  * Add new products with a title, optional description, price, and initial stock quantity.
  * Duplicate detection: Adding an existing product (matching title and price) seamlessly updates its stock rather than creating a duplicate entry.
  * Live stock adjustment: Easily increase or decrease available stock directly from the product card.
  * Auto-culling: Products whose stock drops to zero are automatically removed from both the store and any active carts.

* **Customer Cart & Checkout**
  * Add items to the cart with a single click.
  * Smart stock limits: The cart intelligently prevents users from adding more items than are currently in stock.
  * Adjust quantities inside the cart, with real-time subtotal updates.
  * Cascading updates: If inventory stock drops below what a customer currently has in their cart, the cart automatically adjusts down to match available stock.

* **Billing Summary**
  * Real-time grand total calculation.
  * One-click "Empty Basket" functionality.

## 🛠 Tech Stack

* **React 18** (Functional components & Hooks)
* **Vite** (Build tool & development server)
* **Vanilla CSS** (Custom CSS variables, responsive Grid/Flexbox layouts)

## 📁 Project Structure

The app is broken down into modular, single-responsibility components:

```text
/
├── public/
│   └── index.html             # HTML entry point
├── src/
│   ├── main.jsx               # React DOM rendering
│   ├── App.jsx                # Core state & logic (The Brain)
│   ├── App.css                # Global styles & layout
│   └── components/            # UI Components
│       ├── ProductForm.jsx    # Input validation & submission
│       ├── ProductList.jsx    # Inventory grid wrapper
│       ├── ProductCard.jsx    # Individual inventory item & stock controls
│       ├── Cart.jsx           # Basket wrapper & empty states
│       ├── CartItem.jsx       # Individual line item & quantity controls
│       └── CartSummary.jsx    # Grand total & clear cart logic
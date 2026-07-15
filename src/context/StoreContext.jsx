import { createContext, useContext, useReducer, useEffect } from 'react';
import seedData from '../data/data.json';

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = { products: [], cart: [] }; // initial state

// ─── Reducer ─────────────────────────────────────────────────────────────────
function storeReducer(state, action) {
  switch (action.type) {

    case 'SEED_PRODUCTS':
      return { ...state, products: action.payload };

    case 'ADD_PRODUCT': {
      const duplicate = state.products.find(
        p =>
          p.title.toLowerCase().trim() === action.payload.title.toLowerCase().trim() &&
          p.price === action.payload.price // duplicate matching based on price and name
      );
      if (duplicate) {
        return {
          ...state,
          products: state.products.map(p =>
            p.id === duplicate.id ? { ...p, quantity: p.quantity + action.payload.quantity } : p
          ),
        };
      }
      return { ...state, products: [...state.products, action.payload] };
    }

    case 'UPDATE_PRODUCT_QUANTITY': {
      const { id, delta } = action.payload;
      const product = state.products.find(p => p.id === id);
      if (!product) return state;

      const newStock = product.quantity + delta;
      if (newStock <= 0) {
        return {
          products: state.products.filter(p => p.id !== id),
          cart: state.cart.filter(item => item.id !== id),
        };
      }
      return {
        products: state.products.map(p => p.id === id ? { ...p, quantity: newStock } : p),
        // Safety cap: if stock drops below what's in the cart, reduce cart quantity
        cart: state.cart.map(item =>
          item.id === id && item.quantity > newStock ? { ...item, quantity: newStock } : item
        ),
      };
    }

    case 'DELETE_PRODUCT':
      return {
        products: state.products.filter(p => p.id !== action.payload),
        cart: state.cart.filter(item => item.id !== action.payload),
      };

    case 'ADD_TO_CART': {
      const product = action.payload;
      const existing = state.cart.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.quantity) return state; // block exceeding stock
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { ...state, cart: [...state.cart, { ...product, quantity: 1 }] }; 
      // basically create an object with same state as before with changes in cart, were cart is same as before with additon of a new product
    }

    case 'UPDATE_CART_QUANTITY': {
      const { id, delta } = action.payload;
      const stockLimit = state.products.find(p => p.id === id)?.quantity ?? 0;
      return {
        ...state,
        cart: state.cart
          .map(item => {
            if (item.id !== id) return item;
            const newQty = item.quantity + delta;
            if (newQty > stockLimit) return item; // block exceeding stock
            return { ...item, quantity: newQty };
          })
          .filter(item => item.quantity > 0),
      };
    }

    case 'CLEAR_CART':
      return { ...state, cart: [] };

    default:
      return state;
  }
}

// ─── Context & Provider ───────────────────────────────────────────────────────
const StoreContext = createContext(null);

// StoreProvider is a wrapper component. You put it around your whole app (in main.jsx)
// so that every component inside it can access the store — the products and cart.
export function StoreProvider({ children }) {

  // useReducer gives us two things:
  //   state    → the current data (products + cart)
  //   dispatch → a function we call to change that data
  // storeReducer is the rulebook that decides HOW state changes
  // initialState is the starting value: { products: [], cart: [] }
  const [state, dispatch] = useReducer(storeReducer, initialState);

  // useEffect with [] runs once — right after the component first appears on screen.
  // We use it here to pre-load the 4 sample products from data.json into state.
  // data.json products don't have a quantity field, so we add one (defaulting to 10).
  useEffect(() => {
    const seeded = seedData.products.map(p => ({ ...p, quantity: 10 }));
    dispatch({ type: 'SEED_PRODUCTS', payload: seeded }); // send the seeded list into the reducer
  }, []); // the empty [] means "only run this once, on mount"

  // StoreContext.Provider is what actually shares the data with the rest of the app.
  // Whatever we pass to `value` becomes available to any component that calls useStore().
  // `children` is everything nested inside <StoreProvider> in main.jsx.
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

// useStore is a shortcut hook for any component that wants to read or update the store.
// Instead of writing useContext(StoreContext) every time, components just call useStore().
// It returns { state, dispatch } — the same object we passed to the Provider above.
export function useStore() {
  return useContext(StoreContext);
}

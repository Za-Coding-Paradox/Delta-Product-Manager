import { createContext, useContext, useReducer, useEffect } from 'react';
import seedData from '../data/data.json';

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = { products: [], cart: [] };

// ─── Reducer ─────────────────────────────────────────────────────────────────
function storeReducer(state, action) {
  switch (action.type) {

    case 'SEED_PRODUCTS':
      return { ...state, products: action.payload };

    case 'ADD_PRODUCT': {
      const duplicate = state.products.find(
        p =>
          p.title.toLowerCase().trim() === action.payload.title.toLowerCase().trim() &&
          p.price === action.payload.price
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

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  // Seed products from data.json on mount.
  // data.json products have no quantity field, so we default to 10.
  useEffect(() => {
    const seeded = seedData.products.map(p => ({ ...p, quantity: 10 }));
    dispatch({ type: 'SEED_PRODUCTS', payload: seeded });
  }, []);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

// ─── Custom Hook ─────────────────────────────────────────────────────────────
export function useStore() {
  return useContext(StoreContext);
}

import { createSlice } from "@reduxjs/toolkit";

const loadCartState = () => {
  try {
    const raw = localStorage.getItem("cart_state");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saved = loadCartState();

const initialState = saved || {
  items: [],
  ui: { isOpen: false },
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload; // {id,name,price,imageUrl}
      const found = state.items.find((x) => x.id === item.id);
      if (found) found.qty += 1;
      else state.items.push({ ...item, qty: 1 });
    },

    removeFromCart(state, action) {
      const id = action.payload;
      state.items = state.items.filter((x) => x.id !== id);
    },

    clearCart(state) {
      state.items = [];
    },

    openCart(state) {
      state.ui.isOpen = true;
    },

    closeCart(state) {
      state.ui.isOpen = false;
    },

    toggleCart(state) {
      state.ui.isOpen = !state.ui.isOpen;
    },
    increaseQty(state, action) {
      const id = action.payload;
      const found = state.items.find((x) => x.id === id);
      if (found) found.qty += 1;
    },

    decreaseQty(state, action) {
      const id = action.payload;
      const found = state.items.find((x) => x.id === id);
      if (!found) return;
      if (found.qty > 1) found.qty -= 1;
      else state.items = state.items.filter((x) => x.id !== id);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  openCart,
  closeCart,
  toggleCart,
  increaseQty,
  decreaseQty,
} = cartSlice.actions;

export default cartSlice.reducer;

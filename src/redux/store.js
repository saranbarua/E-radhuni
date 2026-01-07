// import { configureStore } from "@reduxjs/toolkit";
// import loginReducer from "./features/Authentication/loginSlice";
// import cartReducer from "./features/Authentication/cartSlice";

// export const store = configureStore({
//   reducer: {
//     login: loginReducer,
//     cart: cartReducer,
//   },
//   devTools: false,
// });

import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./features/Authentication/loginSlice";
import cartReducer from "./features/Authentication/cartSlice";

// ✅ Persist only cart.items (refresh এ cart থাকবে, drawer বন্ধ থাকবে)
const loadCartItems = () => {
  try {
    const raw = localStorage.getItem("cart_items");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCartItems = (items) => {
  try {
    localStorage.setItem("cart_items", JSON.stringify(items));
  } catch {}
};

export const store = configureStore({
  reducer: {
    login: loginReducer,
    cart: cartReducer,
  },
  devTools: false,
  // ✅ cart slice initialState (preloadedState) override
  preloadedState: {
    cart: {
      items: loadCartItems(),
      ui: { isOpen: false }, // refresh এ drawer সবসময় বন্ধ
    },
  },
});

// ✅ store changes হলে cart items save হবে
store.subscribe(() => {
  const state = store.getState();
  saveCartItems(state.cart.items);
});

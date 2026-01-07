import axios from "axios";
import Cookies from "js-cookie";
import apiurl from "../../../../apiurl/apiurl";
import toast from "react-hot-toast";
import { clearCart } from "./cartSlice";

export const placeProductOrder = () => async (dispatch, getState) => {
  const token = Cookies.get("token");
  if (!token) throw new Error("NO_TOKEN");

  const cartItems = getState().cart.items;

  if (!cartItems.length) {
    toast.error("Cart খালি। আগে কিছু যোগ করুন।");
    return null;
  }

  // ✅ API expects productId + quantity
  const payload = {
    items: cartItems.map((it) => ({
      productId: it.id,
      quantity: it.qty || 1,
    })),
  };

  try {
    const res = await axios.post(`${apiurl.mainUrl}/orders`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    toast.success("Order placed successfully");
    dispatch(clearCart());

    return res.data; // created order
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.data?.message ||
      err.message ||
      "Order failed";
    toast.error(msg);
    throw err;
  }
};

import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import {
  clearCart,
  decreaseQty,
  increaseQty,
  removeFromCart,
} from "../../../redux/features/Authentication/cartSlice";
import { placeProductOrder } from "../../../redux/features/Authentication/orderActions";

const money = (n) => `৳${Number(n || 0).toLocaleString("en-BD")}`;

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((s) => s.cart.items);
  const { isLoggedIn } = useSelector((s) => s.login);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, it) => sum + Number(it.price || 0) * Number(it.qty || 1),
        0
      ),
    [items]
  );

  const handleCheckout = async () => {
    // ✅ login check
    const token = Cookies.get("token");
    if (!isLoggedIn || !token) {
      toast.error("Order করতে হলে আগে Login করুন");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    if (!items.length) {
      toast.error("Cart খালি। আগে কিছু যোগ করুন।");
      return;
    }

    try {
      const data = await dispatch(placeProductOrder());

      navigate("/order-success", { state: { order: data } });
    } catch (e) {
      // error toast thunk এ already হয়েছে
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      {/* Top */}
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            ← Back
          </button>
          <div className="text-xs uppercase tracking-widest text-gray-400">
            Cart
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.length === 0 ? (
            <div className="rounded-3xl border bg-white p-10 text-center">
              <h2 className="text-xl font-extrabold text-gray-900">
                আপনার Cart খালি
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Products থেকে পছন্দের item add করুন।
              </p>
              <button
                onClick={() => navigate("/products")}
                className="mt-5 rounded-2xl bg-gray-900 text-white px-6 py-3 text-sm font-extrabold hover:bg-black"
              >
                Browse Products
              </button>
            </div>
          ) : (
            items.map((it) => (
              <div
                key={it.id}
                className="flex gap-4 rounded-3xl border bg-white p-4"
              >
                <img
                  src={
                    it.imageUrl ||
                    "https://dummyimage.com/140x140/e5e7eb/111827&text=Item"
                  }
                  alt={it.name}
                  className="h-24 w-24 rounded-2xl object-cover border"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-sm md:text-base font-extrabold text-gray-900 line-clamp-1">
                    {it.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Unit Price:{" "}
                    <span className="font-bold text-gray-900">
                      {money(it.price)}
                    </span>
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                    {/* Qty controls */}
                    <div className="inline-flex items-center rounded-2xl border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => dispatch(decreaseQty(it.id))}
                        className="px-4 py-2 text-sm font-extrabold hover:bg-gray-50"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <div className="px-4 py-2 text-sm font-extrabold tabular-nums">
                        {it.qty}
                      </div>
                      <button
                        onClick={() => dispatch(increaseQty(it.id))}
                        className="px-4 py-2 text-sm font-extrabold hover:bg-gray-50"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500">Subtotal</p>
                      <p className="text-base font-extrabold text-gray-900">
                        {money(Number(it.price || 0) * Number(it.qty || 1))}
                      </p>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart(it.id))}
                      className="text-sm font-extrabold text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="rounded-3xl border bg-white p-6 h-fit sticky top-24">
          <h3 className="text-lg font-extrabold text-gray-900">
            Order Summary
          </h3>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Items</span>
              <span className="font-bold text-gray-900">
                {items.reduce((s, it) => s + (it.qty || 1), 0)}
              </span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900">{money(total)}</span>
            </div>

            <div className="border-t pt-3 flex justify-between">
              <span className="text-gray-700 font-semibold">Total</span>
              <span className="text-lg font-extrabold text-gray-900">
                {money(total)}
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <button
              disabled={!items.length}
              onClick={handleCheckout}
              className="rounded-2xl bg-[#8f0910] text-white py-3 text-sm font-extrabold hover:opacity-95 disabled:opacity-50"
            >
              Place Order
            </button>

            <button
              disabled={!items.length}
              onClick={() => dispatch(clearCart())}
              className="rounded-2xl border border-gray-200 bg-white py-3 text-sm font-extrabold text-gray-900 hover:bg-gray-50 disabled:opacity-50"
            >
              Clear Cart
            </button>

            <button
              onClick={() => navigate("/products")}
              className="rounded-2xl border border-gray-200 bg-gray-50 py-3 text-sm font-extrabold text-gray-900 hover:bg-gray-100"
            >
              Continue Shopping
            </button>
          </div>

          {!isLoggedIn && (
            <p className="mt-4 text-xs text-gray-500">
              Note: Order করতে হলে আগে Login করতে হবে।
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const money = (n) => `৳${Number(n || 0).toLocaleString("en-BD")}`;

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state?.order;
  console.log(order);

  useEffect(() => {
    if (!order) {
      // Refresh দিলে state থাকবে না, তাই My Orders এ পাঠিয়ে দিন
      navigate("/my-orders", { replace: true });
    }
  }, [order, navigate]);

  if (!order) return null; // redirect হচ্ছে

  const items = order?.order?.orderItems || [];
  const total = items.reduce(
    (sum, it) =>
      sum + Number(it.quantity || 0) * Number(it.product?.price || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Dummy Payment Mode
          </p>

          <h1 className="mt-2 text-2xl md:text-3xl font-extrabold text-gray-900">
            Order placed successfully
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Payment gateway এখনো যুক্ত হয়নি। আপাতত এটি “Cash on Delivery /
            Manual Confirm” হিসেবে গণ্য হবে।
          </p>

          <div className="mt-6 rounded-2xl bg-gray-50 border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="text-sm font-extrabold text-gray-900">
                {order?.order?.id || "N/A"}
              </p>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-lg font-extrabold text-gray-900">
                {money(total)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-widest text-gray-400">
              Items
            </p>

            <div className="mt-3 space-y-3">
              {items.map((it) => {
                const qty = Number(it.quantity || 0);
                const price = Number(it.product?.price || 0);
                const lineTotal = qty * price;

                return (
                  <div
                    key={it.id}
                    className="flex items-center justify-between rounded-2xl border bg-white p-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-gray-900 line-clamp-1">
                        {it?.product?.name || "Product"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {money(price)} × {qty}
                      </p>
                    </div>

                    <p className="text-sm font-extrabold text-gray-900">
                      {money(lineTotal)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/my-orders")}
              className="flex-1 rounded-2xl bg-[#8f0910] text-white py-3 text-sm font-extrabold"
            >
              View My Orders
            </button>

            <button
              onClick={() => navigate("/products")}
              className="flex-1 rounded-2xl border border-gray-200 bg-white py-3 text-sm font-extrabold text-gray-900 hover:bg-gray-50"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

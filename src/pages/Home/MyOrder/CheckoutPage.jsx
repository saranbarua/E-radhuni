import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { placeProductOrder } from "../../../redux/features/Authentication/orderActions";

const money = (n) => `৳${Number(n || 0).toLocaleString("en-BD")}`;

const PaymentLogo = ({ type }) => {
  // Tiny inline logos (dummy). চাইলে এগুলোকে আপনার brand SVG/PNG দিয়ে replace করবেন।
  const common = "h-6 w-auto";
  if (type === "visa") {
    return (
      <div className="px-2 py-1 rounded-lg border bg-white text-xs font-extrabold">
        VISA
      </div>
    );
  }
  if (type === "mastercard") {
    return (
      <div className="px-2 py-1 rounded-lg border bg-white text-xs font-extrabold">
        Mastercard
      </div>
    );
  }
  if (type === "bkash") {
    return (
      <div className="px-2 py-1 rounded-lg border bg-white text-xs font-extrabold">
        bKash
      </div>
    );
  }
  if (type === "nagad") {
    return (
      <div className="px-2 py-1 rounded-lg border bg-white text-xs font-extrabold">
        Nagad
      </div>
    );
  }
  if (type === "bank") {
    return (
      <div className="px-2 py-1 rounded-lg border bg-white text-xs font-extrabold">
        Bank
      </div>
    );
  }
  return <div className={common} />;
};

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((s) => s.cart.items);
  const { isLoggedIn } = useSelector((s) => s.login);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, it) => sum + Number(it.price || 0) * Number(it.qty || 1),
        0,
      ),
    [items],
  );

  const [billing, setBilling] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod | visa | bank | bkash | nagad
  const [agree, setAgree] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!billing.name.trim()) return "Name দিন";
    if (!billing.phone.trim()) return "Mobile Number দিন";
    if (!billing.address.trim()) return "Street address দিন";
    if (!billing.city.trim()) return "City সিলেক্ট/লিখুন";
    if (!agree) return "Terms & conditions এ agree করুন";
    if (!items.length) return "Cart খালি";
    return null;
  };

  const handlePlaceOrder = async () => {
    const token = Cookies.get("token");
    if (!isLoggedIn || !token) {
      toast.error("Order করতে হলে আগে Login করুন");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    try {
      setSubmitting(true);

      // ✅ backend এ billing/payment পাঠাতে চাইলে thunk এ payload পাঠাতে হবে
      // আপাতত dummy flow: শুধু placeProductOrder()
      const data = await dispatch(placeProductOrder());

      // ✅ OrderSuccess এ payment summary দেখাতে state এ attach করে দিন
      navigate("/order-success", {
        state: {
          order: {
            ...data,
            dummyCheckout: {
              billing,
              paymentMethod,
            },
          },
        },
      });
    } catch (e) {
      // thunk এ toast থাকলে এখানে কিছু না করলেও হবে
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/cart")}
            className="text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            ← Back to Cart
          </button>
          <div className="text-xs uppercase tracking-widest text-gray-400">
            Checkout
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Billing + Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Billing */}
          <div className="rounded-3xl border bg-white p-6">
            <h2 className="text-lg font-extrabold text-gray-900">
              Billing Details
            </h2>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <label className="text-xs font-bold text-gray-600">
                  Name (আপনার নাম)
                </label>
                <input
                  value={billing.name}
                  onChange={(e) =>
                    setBilling((p) => ({ ...p, name: e.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="আপনার নাম"
                />
              </div>

              <div className="md:col-span-1">
                <label className="text-xs font-bold text-gray-600">
                  Mobile Number (মোবাইল নাম্বার)
                </label>
                <input
                  value={billing.phone}
                  onChange={(e) =>
                    setBilling((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="01XXXXXXXXX"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-600">
                  Email Address (optional)
                </label>
                <input
                  value={billing.email}
                  onChange={(e) =>
                    setBilling((p) => ({ ...p, email: e.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="example@mail.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-600">
                  Street address
                </label>
                <input
                  value={billing.address}
                  onChange={(e) =>
                    setBilling((p) => ({ ...p, address: e.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="বাসা নাম্বার, রোড, এলাকা, উপজেলা, জেলা"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-600">City</label>
                <input
                  value={billing.city}
                  onChange={(e) =>
                    setBilling((p) => ({ ...p, city: e.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="Dhaka"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-600">
                  Order notes (optional)
                </label>
                <textarea
                  value={billing.notes}
                  onChange={(e) =>
                    setBilling((p) => ({ ...p, notes: e.target.value }))
                  }
                  className="mt-2 w-full min-h-[120px] rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="Special Instructions"
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-3xl border bg-white p-6">
            <h2 className="text-lg font-extrabold text-gray-900">
              Payment Option
            </h2>

            <div className="mt-4 space-y-3">
              {/* COD */}
              <label className="flex gap-3 rounded-2xl border p-4 cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="pay"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-extrabold text-gray-900">
                      Cash on Delivery
                    </p>
                    <div className="text-xs font-bold text-gray-500">Dummy</div>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    Pay with cash upon delivery (manual confirm).
                  </p>
                </div>
              </label>

              {/* bKash */}
              <label className="flex gap-3 rounded-2xl border p-4 cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="pay"
                  checked={paymentMethod === "bkash"}
                  onChange={() => setPaymentMethod("bkash")}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-extrabold text-gray-900">
                      bKash
                    </p>
                    <div className="flex items-center gap-2">
                      <PaymentLogo type="bkash" />
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    Dummy wallet UI only. Real gateway not connected yet.
                  </p>
                </div>
              </label>

              {/* Nagad */}
              <label className="flex gap-3 rounded-2xl border p-4 cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="pay"
                  checked={paymentMethod === "nagad"}
                  onChange={() => setPaymentMethod("nagad")}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-extrabold text-gray-900">
                      Nagad
                    </p>
                    <div className="flex items-center gap-2">
                      <PaymentLogo type="nagad" />
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    Dummy wallet UI only. Real gateway not connected yet.
                  </p>
                </div>
              </label>

              {/* Card */}
              <label className="flex gap-3 rounded-2xl border p-4 cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="pay"
                  checked={paymentMethod === "visa"}
                  onChange={() => setPaymentMethod("visa")}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-extrabold text-gray-900">
                      Card Payment
                    </p>
                    <div className="flex items-center gap-2">
                      <PaymentLogo type="visa" />
                      <PaymentLogo type="mastercard" />
                    </div>
                  </div>

                  {/* Dummy card fields (optional show) */}
                  {paymentMethod === "visa" && (
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        className="rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                        placeholder="Card Number (dummy)"
                      />
                      <input
                        className="rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                        placeholder="Name on Card (dummy)"
                      />
                      <div className="grid grid-cols-2 gap-3 md:col-span-2">
                        <input
                          className="rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                          placeholder="MM/YY"
                        />
                        <input
                          className="rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                          placeholder="CVV"
                        />
                      </div>
                      <p className="md:col-span-2 text-xs text-gray-500">
                        এইগুলো শুধু UI demo। Payment gateway connect করলে real
                        হবে।
                      </p>
                    </div>
                  )}
                </div>
              </label>

              {/* Bank */}
              <label className="flex gap-3 rounded-2xl border p-4 cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="pay"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-extrabold text-gray-900">
                      Bank Transfer
                    </p>
                    <PaymentLogo type="bank" />
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    Dummy bank method. Manual verify.
                  </p>
                </div>
              </label>
            </div>

            <div className="mt-4 flex items-start gap-2">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <p className="text-xs text-gray-600">
                By placing order, I agree to terms & conditions.
              </p>
            </div>

            <button
              disabled={submitting || !items.length}
              onClick={handlePlaceOrder}
              className="mt-5 w-full rounded-2xl bg-[#8f0910] text-white py-3 text-sm font-extrabold hover:opacity-95 disabled:opacity-50"
            >
              {submitting ? "Placing..." : "Place Order"}
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="rounded-3xl border bg-white p-6 h-fit sticky top-24">
          <h3 className="text-lg font-extrabold text-gray-900">Your Order</h3>

          <div className="mt-4 space-y-3">
            {items.map((it) => (
              <div key={it.id} className="flex gap-3">
                <img
                  src={
                    it.imageUrl ||
                    "https://dummyimage.com/64x64/e5e7eb/111827&text=Item"
                  }
                  alt={it.name}
                  className="h-14 w-14 rounded-2xl object-cover border"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold text-gray-900 line-clamp-1">
                    {it.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {money(it.price)} × {it.qty}
                  </p>
                </div>
                <p className="text-sm font-extrabold text-gray-900">
                  {money(Number(it.price || 0) * Number(it.qty || 1))}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900">{money(total)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-xs text-gray-500">
                Address দিলে দেখাবে (dummy)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Total</span>
              <span className="text-lg font-extrabold text-gray-900">
                {money(total)}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate("/products")}
            className="mt-4 w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 text-sm font-extrabold text-gray-900 hover:bg-gray-100"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

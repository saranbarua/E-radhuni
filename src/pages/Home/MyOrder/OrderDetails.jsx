import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faClock,
  faCircleCheck,
  faBan,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import apiurl from "../../../../apiurl/apiurl";
import OrderDetailsSkeleton from "../../../../components/Button/OrderDetailsSkeleton";

const money = (n) => `৳${Number(n || 0).toLocaleString("en-BD")}`;

const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const StatusBadge = ({ status }) => {
  const s = String(status || "PENDING").toUpperCase();
  const map = {
    PENDING: {
      cls: "bg-yellow-50 text-yellow-700 border-yellow-200",
      icon: faClock,
      label: "Pending",
    },
    COMPLETED: {
      cls: "bg-green-50 text-green-700 border-green-200",
      icon: faCircleCheck,
      label: "Completed",
    },
    CANCELLED: {
      cls: "bg-red-50 text-red-700 border-red-200",
      icon: faBan,
      label: "Cancelled",
    },
  };
  const item = map[s] || map.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${item.cls}`}
    >
      <FontAwesomeIcon icon={item.icon} />
      {item.label}
    </span>
  );
};

const calcOrderTotal = (order) =>
  (order?.orderItems || []).reduce((sum, it) => {
    const qty = Number(it?.quantity || 0);
    const price = Number(it?.product?.price || 0);
    return sum + qty * price;
  }, 0);

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      navigate("/login", {
        state: { from: `/my-orders/${id}` },
        replace: true,
      });
      return;
    }

    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setErr("");

      try {
        const res = await axios.get(`${apiurl.mainUrl}/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        const payload = res?.data;
        const data = payload?.data || payload; // array না, single object
        setOrder(data || null);
      } catch (e) {
        if (e.name === "CanceledError") return;
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.data?.message ||
          e?.message ||
          "Failed to load order";
        setErr(msg);
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [token, id, navigate]);

  const items = order?.orderItems || [];

  const grandTotal = useMemo(() => calcOrderTotal(order), [order]);

  if (loading) return <OrderDetailsSkeleton />;

  if (err || !order) {
    return (
      <div className="min-h-screen bg-gray-50 font-serif">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="rounded-3xl border bg-white p-8 shadow-sm text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="text-red-600"
              />
            </div>
            <h2 className="mt-4 text-xl font-extrabold text-gray-900">
              Order not found
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {err || "This order might be removed or unavailable."}
            </p>

            <button
              onClick={() => navigate("/my-orders")}
              className="mt-6 rounded-2xl bg-[#8f0910] text-white px-5 py-3 text-sm font-extrabold hover:opacity-95"
            >
              Back to My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      {/* Top */}
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-extrabold text-gray-800 hover:text-gray-900"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </button>

          <Link
            to="/products"
            className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-extrabold text-gray-900 hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Items */}
          <div className="lg:col-span-2 rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-gray-400">
              Items
            </p>

            <div className="mt-4 space-y-3">
              {items.map((it) => {
                const qty = Number(it?.quantity || 0);
                const price = Number(it?.product?.price || 0);
                const lineTotal = qty * price;

                return (
                  <div
                    key={it.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border bg-gray-50 p-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={
                          it?.product?.imageUrl ||
                          "https://dummyimage.com/120x120/e5e7eb/111827&text=Item"
                        }
                        alt={it?.product?.name || "Product"}
                        className="h-16 w-16 rounded-xl object-cover border bg-white"
                      />

                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-gray-900 line-clamp-1">
                          {it?.product?.name || "Product"}
                        </p>

                        {/* ✅ qty + price */}
                        <p className="text-xs text-gray-500 mt-1">
                          {money(price)} × {qty}
                        </p>
                      </div>
                    </div>

                    {/* ✅ line total */}
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-gray-900">
                        {money(lineTotal)}
                      </p>
                      <p className="text-[11px] text-gray-400">Line total</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-gray-400">
              Order Summary
            </p>

            <h1 className="mt-2 text-lg font-extrabold text-gray-900 break-all">
              {order?.id}
            </h1>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">Status</p>
              <StatusBadge status={order?.orderStatus} />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-gray-600">Placed</p>
              <p className="text-sm font-bold text-gray-900">
                {formatDate(order?.createdAt)}
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-gray-50 border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">Items</p>
                <p className="text-sm font-extrabold text-gray-900">
                  {items.length}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between border-t pt-3">
                <p className="text-sm font-semibold text-gray-700">Total</p>
                <p className="text-lg font-extrabold text-gray-900">
                  {money(grandTotal)}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">
              <p className="text-xs uppercase tracking-widest text-gray-400">
                Payment
              </p>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Payment gateway এখনো যুক্ত হয়নি। এই order টি “Cash on Delivery /
                Manual Confirm” হিসেবে গণ্য হবে।
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => navigate("/my-orders")}
                className="rounded-2xl bg-[#8f0910] text-white py-3 text-sm font-extrabold hover:opacity-95"
              >
                Back to My Orders
              </button>
              <Link
                to="/products"
                className="rounded-2xl border border-gray-200 bg-white py-3 text-sm font-extrabold text-gray-900 text-center hover:bg-gray-50"
              >
                Buy More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

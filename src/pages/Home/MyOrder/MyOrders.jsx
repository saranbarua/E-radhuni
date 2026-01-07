import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faClipboardList,
  faTriangleExclamation,
  faClock,
  faCircleCheck,
  faBan,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import apiurl from "../../../../apiurl/apiurl";
import Loader from "../../../../components/Loader/Loader";
import OrderDetailsSkeleton from "../../../../components/Button/OrderDetailsSkeleton";

const money = (n) => `৳${Number(n || 0).toLocaleString("en-BD")}`;

const calcOrderTotal = (order) =>
  (order?.orderItems || []).reduce((sum, it) => {
    const qty = Number(it?.quantity || 0);
    const price = Number(it?.product?.price || 0);
    return sum + qty * price;
  }, 0);

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

export default function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const token = Cookies.get("token");

  useEffect(() => {
    // ✅ login না থাকলে login এ পাঠাবে (redirect back)
    if (!token) {
      navigate("/login", { state: { from: "/my-orders" }, replace: true });
      return;
    }

    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await axios.get(`${apiurl.mainUrl}/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        // API shape handle (array or {data:[]})
        const payload = res?.data;
        const list = Array.isArray(payload) ? payload : payload?.data || [];

        setOrders(list);
      } catch (e) {
        if (e.name === "CanceledError") return;
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.data?.message ||
          e?.message ||
          "Failed to load orders";
        setErr(msg);
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [token, navigate]);

  const totalOrders = orders?.length || 0;

  const totalSpend = useMemo(() => {
    return (orders || []).reduce((sum, o) => sum + calcOrderTotal(o), 0);
  }, [orders]);

  if (loading) return <OrderDetailsSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      {/* Top */}
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#8f0910]/10 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faClipboardList}
                className="text-[#8f0910]"
              />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">
                My Orders
              </h1>
              <p className="text-xs text-gray-500">
                Your recent product orders & status
              </p>
            </div>
          </div>

          <Link
            to="/products"
            className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-extrabold text-gray-900 hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-gray-400">
              Total Orders
            </p>
            <p className="mt-2 text-2xl font-extrabold text-gray-900">
              {totalOrders}
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-gray-400">
              Total Spend
            </p>
            <p className="mt-2 text-2xl font-extrabold text-gray-900">
              {money(totalSpend)}
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-gray-400">
              Note
            </p>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Payment gateway এখনো নেই, তাই orders “Manual Confirm / COD” হিসেবে
              থাকছে।
            </p>
          </div>
        </div>

        {/* Error */}
        {err && (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="text-red-600"
              />
              <p className="text-sm font-extrabold text-red-700">{err}</p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!err && orders.length === 0 && (
          <div className="mt-8 rounded-3xl border bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faBoxOpen} className="text-gray-500" />
            </div>
            <h3 className="mt-4 text-lg font-extrabold text-gray-900">
              No orders yet
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              You haven’t placed any product order yet.
            </p>
            <Link
              to="/products"
              className="inline-flex mt-5 rounded-2xl bg-[#8f0910] text-white px-5 py-3 text-sm font-extrabold hover:opacity-95"
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* Orders */}
        {!err && orders.length > 0 && (
          <div className="mt-8 space-y-4">
            {orders.map((o) => {
              const total = calcOrderTotal(o);
              const items = o?.orderItems || [];
              const preview = items.slice(0, 2);

              return (
                <div
                  key={o.id}
                  className="rounded-3xl border bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-widest text-gray-400">
                        Order ID
                      </p>
                      <p className="mt-1 text-sm font-extrabold text-gray-900 break-all">
                        {o.id}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Placed: {formatDate(o.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={o.orderStatus} />
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-widest text-gray-400">
                          Total
                        </p>
                        <p className="text-lg font-extrabold text-gray-900">
                          {money(total)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {preview.map((it) => {
                      const qty = Number(it?.quantity || 0);
                      const price = Number(it?.product?.price || 0);
                      const line = qty * price;

                      return (
                        <div
                          key={it.id}
                          className="flex items-center gap-3 rounded-2xl border bg-gray-50 p-3"
                        >
                          <img
                            src={
                              it?.product?.imageUrl ||
                              "https://dummyimage.com/120x120/e5e7eb/111827&text=Item"
                            }
                            alt={it?.product?.name || "Product"}
                            className="h-14 w-14 rounded-xl object-cover border bg-white"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-extrabold text-gray-900 line-clamp-1">
                              {it?.product?.name || "Product"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {money(price)} × {qty} ={" "}
                              <span className="font-bold text-gray-800">
                                {money(line)}
                              </span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {items.length > 2 && (
                    <p className="mt-3 text-xs text-gray-500">
                      +{items.length - 2} more item(s)
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => navigate(`/my-orders/${o.id}`)}
                      className="inline-flex items-center justify-center gap-2 flex-1 rounded-2xl bg-[#8f0910] text-white py-3 text-sm font-extrabold hover:opacity-95"
                    >
                      <FontAwesomeIcon icon={faEye} />
                      View Details
                    </button>

                    <Link
                      to="/products"
                      className="inline-flex items-center justify-center flex-1 rounded-2xl border border-gray-200 bg-white py-3 text-sm font-extrabold text-gray-900 hover:bg-gray-50"
                    >
                      Buy Again
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

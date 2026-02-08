import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import apiurl from "../../../apiurl/apiurl";

const methods = [
  { id: "BKASH", label: "bKash", icon: "/bkash.png" },
  { id: "NAGAD", label: "Nagad", icon: "/nagad.png" },
  { id: "VISA", label: "Visa", icon: "/visa.png" },
  { id: "AMEX", label: "Amex", icon: "/amex.png" },
  { id: "DBBL", label: "DBBL", icon: "/dbbl.png" },
  { id: "MASTERCARD", label: "Mastercard", icon: "/mastercard.png" },
  { id: "OKWALLET", label: "Ok Wallet", icon: "/ok.png" },
  { id: "STPAY", label: "ST Pay", icon: "/stpay.png" },
  { id: "UPAY", label: "Upay", icon: "/upay.png" },
];

const SubscriptionCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const planId = location.state?.planId;

  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!planId) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600">No plan selected</p>
      </div>
    );
  }

  const handleContinue = async () => {
    if (!selected) {
      toast.error("Please select a payment method");
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login", { state: { from: location.pathname, planId } });
      return;
    }

    setSubmitting(true);

    try {
      // ✅ backend অনুযায়ী order place
      const res = await axios.post(
        `${apiurl.mainUrl}/subscription-plan-orders`,
        { subscriptionPlanId: planId }, // ✅ IMPORTANT: field name
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const msg =
        res.data?.message ||
        res.data?.data?.message ||
        "Subscription order placed";

      toast.success(msg);

      // ✅ redirect to my orders page
      navigate("/mysub-order");
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.data?.message ||
        e.message;
      toast.error(msg || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 py-14 px-4">
      <div className="max-w-3xl mx-auto bg-white border rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl font-extrabold text-gray-900">
          Choose payment method
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Select how you want to pay for your subscription.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {methods.map((m) => {
            const active = selected === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelected(m.id)}
                className={`border rounded-2xl p-4 transition text-left ${
                  active
                    ? "border-red-500 ring-2 ring-red-100"
                    : "border-gray-200 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={m.icon}
                    alt={m.label}
                    className="h-9 w-9 object-contain"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{m.label}</p>
                    <p className="text-xs text-gray-500">
                      Secure payment via {m.label}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full border py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
            disabled={submitting}
          >
            Back
          </button>

          <button
            onClick={handleContinue}
            disabled={!selected || submitting}
            className={`w-full py-3 rounded-xl font-semibold text-white transition ${
              selected && !submitting
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {submitting ? "Processing..." : "Continue"}
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          Payment methods are UI-only for now. Order request will be submitted.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionCheckout;

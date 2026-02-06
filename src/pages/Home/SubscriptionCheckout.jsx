import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

const methods = [
  { id: "BKASH", label: "bKash", icon: "/public/bkash.png" },
  { id: "NAGAD", label: "Nagad", icon: "/public/nagad.png" },
  { id: "VISA", label: "Visa", icon: "/public/visa.png" },
  { id: "Amex", label: "Amex", icon: "/public/amex.png" },
  { id: "DBBL", label: "DBBL", icon: "/public/dbbl.png" },
  { id: "mastercard", label: "Mastercard", icon: "/public/mastercard.png" },
  { id: "Ok Wallet", label: "Ok Wallet", icon: "/public/ok.png" },
  { id: "stpay", label: "ST Pay", icon: "/public/stpay.png" },
  { id: "Upay", label: "Upay", icon: "/public/upay.png" },
];

const SubscriptionCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const planId = location.state?.planId;

  const [selected, setSelected] = useState(null);

  if (!planId) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600">No plan selected</p>
      </div>
    );
  }

  const handleContinue = () => {
    if (!selected) {
      toast.error("Please select a payment method");
      return;
    }

    // ✅ UI-only success
    toast.success("Payment method selected successfully");

    // optional delay for premium feel
    setTimeout(() => {
      navigate("/mysub-order"); // or wherever you want
    }, 800);
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
          >
            Back
          </button>

          <button
            onClick={handleContinue}
            disabled={!selected}
            className={`w-full py-3 rounded-xl font-semibold text-white transition ${
              selected
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          This is a demo selection. No payment will be processed.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionCheckout;

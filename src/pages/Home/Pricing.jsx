import useSubscriptionPlans from "../../../components/hooks/useSubscriptionPlans";
import Loader from "../../../components/Loader/Loader";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { placeSubscriptionOrder } from "../../../components/hooks/subscriptionOrders";

const FEATURES = [
  "Unlimited access to all recipes",
  "Chef-led video tutorials",
  "Weekly new content updates",
  "Bengali & global cuisines",
  "Ad-free experience",
];

const formatDurationTitle = (months) => {
  if (!months) return "Plan";
  if (months === 1) return "1 Month";
  return `${months} Months`;
};

const pickBadges = (plans) => {
  // Most Popular: middle duration (if exists), else first
  // Best Value: highest duration
  const sorted = [...plans].sort(
    (a, b) => (a.duration || 0) - (b.duration || 0)
  );
  const bestValueId = sorted[sorted.length - 1]?.id;
  const popularId = sorted[Math.floor(sorted.length / 2)]?.id || sorted[0]?.id;

  return { bestValueId, popularId };
};

const Pricing = () => {
  const { isLoggedIn } = useSelector((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChoosePlan = async (planId) => {
    if (!isLoggedIn) {
      toast.error("Please login to continue");
      navigate("/login", { state: { from: location.pathname, planId } });
      return;
    }

    try {
      const result = await placeSubscriptionOrder(planId);
      toast.success(result?.message || "Order placed!");
      navigate("/mysub-order");
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        e.response?.data?.data?.message ||
        e.message;
      toast.error(msg || "Failed to place order");
    }
  };
  const { plans, isLoading, error } = useSubscriptionPlans();

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto bg-white border rounded-2xl p-6 text-center">
          <p className="text-red-500 font-medium">Failed to load plans</p>
          <p className="text-gray-500 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const activePlans = (plans || []).filter((p) => !p.deletedAt);
  const { bestValueId, popularId } = pickBadges(activePlans);

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 font-serif">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-900">
          Upgrade to <span className="text-red-600">Be-Radhuni Pro</span>
        </h2>

        <p className="mt-4 text-lg text-gray-600">
          Unlock full access to premium recipes, chef-led master classes, and
          new content.
        </p>

        {activePlans.length === 0 ? (
          <div className="mt-10 max-w-xl mx-auto bg-white border rounded-2xl p-6">
            <p className="text-gray-700 font-medium">
              No plans available right now.
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Please check back later.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 lg:grid-cols-3 sm:grid-cols-1">
            {activePlans.map((plan) => {
              const isPopular = plan.id === popularId;
              const isBestValue = plan.id === bestValueId;

              return (
                <div
                  key={plan.id}
                  className={`relative border rounded-2xl p-6 text-center transition-all hover:-translate-y-1 hover:shadow-xl bg-white ${
                    isPopular ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  {/* Badge Row */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {isPopular && (
                      <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                        Most Popular
                      </span>
                    )}
                    {isBestValue && (
                      <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                        Best Value
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-semibold text-gray-900 mt-4">
                    {formatDurationTitle(plan.duration)}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{plan.name}</p>

                  {/* Price */}
                  <div className="mt-5">
                    <p className="text-4xl font-extrabold text-gray-900">
                      ৳{plan.price}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      billed for {plan.duration} month
                      {plan.duration > 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="mt-6 text-gray-600 space-y-2 text-left max-w-sm mx-auto">
                    {FEATURES.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg
                          className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="leading-6">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => handleChoosePlan(plan.id)}
                    className={`mt-7 w-full py-3 px-6 rounded-xl text-base font-semibold transition ${
                      isPopular
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-gray-900 hover:bg-black text-white"
                    }`}
                  >
                    Choose Plan
                  </button>

                  <p className="mt-3 text-xs text-gray-400">
                    Cancel anytime. No hidden charges.
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-12 text-sm text-primary">
          Join 10,000+ home chefs mastering Bengali & global cuisine
        </p>
      </div>
    </div>
  );
};

export default Pricing;

import useMySubscriptionOrders from "../../../../components/hooks/useMySubscriptionOrders";
import Loader from "../../../../components/Loader/Loader";

const formatDate = (iso) => {
  if (!iso) return "N/A";
  try {
    return new Date(iso).toISOString().split("T")[0];
  } catch {
    return "N/A";
  }
};

const StatusBadge = ({ status }) => {
  const s = (status || "").toUpperCase();

  const map = {
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    ACCEPTED: "bg-green-100 text-green-700 border-green-200",
    REJECTED: "bg-red-100 text-red-700 border-red-200",
  };

  const cls = map[s] || "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}
    >
      {s || "UNKNOWN"}
    </span>
  );
};

export default function MySubscriptionOrders() {
  const { orders, isLoading, error, refetch } = useMySubscriptionOrders();

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border rounded-2xl p-6 text-center shadow-sm">
          <p className="text-red-500 font-medium">Failed to load orders</p>
          <p className="text-gray-500 text-sm mt-2">{error}</p>
          <button
            onClick={refetch}
            className="mt-4 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Subscription Orders
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track your subscription requests. Admin will accept/reject your
              order.
            </p>
          </div>

          <button
            onClick={refetch}
            className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition"
          >
            Refresh
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="mt-8 bg-white border rounded-2xl p-6 text-center shadow-sm">
            <p className="text-gray-900 font-semibold">No orders yet</p>
            <p className="text-gray-500 text-sm mt-1">
              Choose a plan to create a subscription order.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {orders.map((o) => {
              const plan = o.subscriptionPlan || o.plan;

              return (
                <div
                  key={o.id}
                  className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Order ID</p>
                      <p className="text-sm font-semibold text-gray-900 break-all">
                        {o.id}
                      </p>
                    </div>
                    <StatusBadge status={o.status} />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Plan</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {plan?.name || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {plan?.duration ? `${plan.duration} month(s)` : "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {plan?.price ? `৳${plan.price}` : "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Requested On</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(o.createdAt)}
                      </p>
                    </div>
                  </div>

                  {o.status === "ACCEPTED" && (
                    <div className="mt-4 rounded-xl bg-green-50 border border-green-100 p-3">
                      <p className="text-sm font-semibold text-green-800">
                        Approved
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        Your subscription is active (created automatically after
                        acceptance).
                      </p>
                    </div>
                  )}

                  {o.status === "REJECTED" && (
                    <div className="mt-4 rounded-xl bg-red-50 border border-red-100 p-3">
                      <p className="text-sm font-semibold text-red-800">
                        Rejected
                      </p>
                      <p className="text-xs text-red-700 mt-1">
                        Please choose another plan or contact support.
                      </p>
                    </div>
                  )}

                  {o.status === "PENDING" && (
                    <div className="mt-4 rounded-xl bg-yellow-50 border border-yellow-100 p-3">
                      <p className="text-sm font-semibold text-yellow-800">
                        Pending
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Waiting for admin approval.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

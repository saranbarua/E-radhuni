import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMySubscriptionOrders } from "./subscriptionOrders";

const useMySubscriptionOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMySubscriptionOrders();

      // backend can return array directly or {orders: []}
      const list = Array.isArray(result)
        ? result
        : result?.orders || result?.data || [];
      setOrders(list);
    } catch (e) {
      const msg = e.response?.data?.message || e.message;
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { orders, isLoading, error, refetch: load };
};

export default useMySubscriptionOrders;

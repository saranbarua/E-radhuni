import { useEffect, useState } from "react";
import axios from "axios";
import apiurl from "../../apiurl/apiurl";

const useSubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await axios.get(`${apiurl.mainUrl}/subscription-plans`, {
          headers: { "Content-Type": "application/json" },
        });

        // API returns array directly
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];

        if (mounted) setPlans(list);
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || e.message);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { plans, isLoading, error };
};

export default useSubscriptionPlans;

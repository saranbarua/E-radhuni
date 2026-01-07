import { useEffect, useState } from "react";
import axios from "axios";
import apiurl from "../../apiurl/apiurl";
import Cookies from "js-cookie"; // To get the token

const useContentDetails = (id) => {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return; // Don't make request if there's no ID

    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get the token from cookies
        const token = Cookies.get("token");

        // Prepare config with Authorization header
        const config = {
          headers: {
            Authorization: token ? `Bearer ${token}` : null, // If token exists, add it, otherwise set null
          },
        };

        const res = await axios.get(`${apiurl.mainUrl}/contents/${id}`, config);
        const data = res.data?.data || res.data; // supports both formats: { data: {...} } or direct data
        if (mounted) setContent(data);
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || e.message);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();
    return () => (mounted = false); // Cleanup on unmount
  }, [id]);

  return { content, isLoading, error };
};

export default useContentDetails;

import { useEffect, useState } from "react";
import axios from "axios";
import apiurl from "../../apiurl/apiurl";
import Cookies from "js-cookie"; // To get the token

const useContents = ({ categoryId, status = "ACTIVE", contentType } = {}) => {
  const [contents, setContents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = {};
        if (categoryId) params.categoryId = categoryId;
        if (status) params.status = status;
        if (contentType) params.contentType = contentType;

        // Get the token from Cookies
        const token = Cookies.get("token");

        // Prepare config with Authorization header
        const config = {
          headers: {
            Authorization: token ? `Bearer ${token}` : null, // If token exists, add it, otherwise set null
          },
          params, // Add query parameters
        };

        const res = await axios.get(`${apiurl.mainUrl}/contents`, config);

        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        if (mounted) setContents(list);
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || e.message);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();
    return () => (mounted = false);
  }, [categoryId, status, contentType]);

  return { contents, isLoading, error };
};

export default useContents;

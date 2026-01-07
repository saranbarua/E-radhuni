import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import fetchData from "../../utils/fetchData";
import apiurl from "../../apiurl/apiurl";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = `${apiurl.mainUrl}/products`;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetchData(url);
        // API returns array directly
        setProducts(Array.isArray(res) ? res : []);
      } catch (e) {
        setError(e?.message || "Failed to load products");
        toast.error(e?.message || "Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return { products, isLoading, error };
};

export default useProducts;

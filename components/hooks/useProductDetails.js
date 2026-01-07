import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import fetchData from "../../utils/fetchData";
import apiurl from "../../apiurl/apiurl";

const useProductDetails = (id) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const url = `${apiurl.mainUrl}/products/${id}`;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetchData(url);
        setProduct(res || null);
      } catch (e) {
        setError(e?.message || "Failed to load product");
        toast.error(e?.message || "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id]);

  return { product, isLoading, error };
};

export default useProductDetails;

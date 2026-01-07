import { useEffect, useState } from "react";
import fetchData from "../../utils/fetchData";
import apiurl from "../../apiurl/apiurl";

const useImages = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setIsError] = useState(true);

  // fetching data
  useEffect(() => {
    const fetchDataFromApi = async () => {
      setIsLoading(true);
      setIsError(null);
      const url = `${apiurl.mainUrl}/gallary`;

      try {
        const result = await fetchData(url);
        if (result?.success === true) {
          setImages(result?.data);
        }
      } catch (error) {
        setIsError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDataFromApi();
  }, []);

  return {
    images,
    isLoading,
    error,
  };
};

export default useImages;

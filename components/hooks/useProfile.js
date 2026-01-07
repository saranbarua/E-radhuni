import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import fetchData from "../../utils/fetchData";
import toast from "react-hot-toast";
import apiurl from "../../apiurl/apiurl";

const useProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = `${apiurl.mainUrl}/auth/profile`;

    const fetchDataFromApi = async () => {
      setIsLoading(true);
      setError(null);

      const token = Cookies.get("token");
      if (!token) {
        setError("No token found. Please login again.");
        setIsLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const result = await fetchData(url, config);

        // ✅ support multiple response shapes
        const user =
          result?.user ||
          result?.data?.user ||
          result?.data?.data?.user ||
          null;

        if (user) {
          setProfileData(user);
          return;
        }

        // fallback error message
        const message =
          result?.message || result?.data?.message || "Failed to load profile";
        setError(message);
        toast.error(message);
      } catch (err) {
        const msg = err?.message || "Something went wrong";
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataFromApi();
  }, []);

  return { profileData, isLoading, error };
};

export default useProfile;

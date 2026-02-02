import { useState } from "react";
import Cookies from "js-cookie";
import fetchData from "../../utils/fetchData";
import apiurl from "../../apiurl/apiurl";
import toast from "react-hot-toast";

const useUpdateProfile = () => {
  const [isSaving, setIsSaving] = useState(false);

  const updateProfile = async ({ id, payload }) => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("No token found. Please login again.");
      return null;
    }

    setIsSaving(true);

    try {
      const url = `${apiurl.mainUrl}/users/${id}`;

      const config = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      };

      const result = await fetchData(url, config);

      const updatedUser =
        result?.user || result?.data?.user || result?.data?.data?.user || null;

      toast.success("Profile updated successfully");
      return updatedUser || result;
    } catch (err) {
      toast.error(err?.message || "Failed to update profile");
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return { updateProfile, isSaving };
};

export default useUpdateProfile;

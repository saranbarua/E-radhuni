import axios from "axios";
import { setLoading, setError, setLoggedIn, resetLogin } from "./loginSlice";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import apiurl from "../../../../apiurl/apiurl";

export const loginUser = (credentials) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const response = await axios.post(
      `${apiurl.mainUrl}/auth/login`,
      credentials,
      { headers: { "Content-Type": "application/json" } }
    );

    // আপনার API: response.data.data এর ভিতরে token/user/message
    const payload = response?.data;
    if (payload?.token && payload?.user) {
      Cookies.set("token", payload.token, { expires: 7 });
      Cookies.set("user", JSON.stringify(payload.user), { expires: 7 });

      dispatch(setLoggedIn(true));
      dispatch(setError(null));

      toast.success(payload.message || "Login successful!");
      return;
    }

    dispatch(setError("Invalid server response"));
    toast.error("Invalid server response");
  } catch (error) {
    const errorMessage =
      error.response?.data?.data?.message || // যদি আপনার API error-ও data এর ভিতরে দেয়
      error.response?.data?.message ||
      error.message;

    dispatch(setError(errorMessage));
    toast.error(errorMessage || "An unexpected error occurred");
  } finally {
    dispatch(setLoading(false));
  }
};

export const logoutUser = () => (dispatch) => {
  dispatch(resetLogin());
  Cookies.remove("token");
  Cookies.remove("user");
  toast("You have been logged out.");
};

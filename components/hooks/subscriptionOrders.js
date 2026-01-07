import axios from "axios";
import Cookies from "js-cookie";
import apiurl from "../../apiurl/apiurl";

export const placeSubscriptionOrder = async (subscriptionPlanId) => {
  const token = Cookies.get("token");

  const res = await axios.post(
    `${apiurl.mainUrl}/subscription-plan-orders`,
    { subscriptionPlanId },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data?.data || res.data;
};

export const getMySubscriptionOrders = async () => {
  const token = Cookies.get("token");

  const res = await axios.get(
    `${apiurl.mainUrl}/subscription-plan-orders/my-orders`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data?.data || res.data;
};

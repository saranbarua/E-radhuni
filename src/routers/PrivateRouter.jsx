import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRouter() {
  const { isLoggedIn } = useSelector((state) => state.login);

  return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
}

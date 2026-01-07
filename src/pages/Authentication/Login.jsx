import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Input from "../../../components/Input/Input";
import { loginUser } from "../../redux/features/Authentication/loginActions";
import {
  setUsername,
  setPassword,
} from "../../redux/features/Authentication/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/Loader/Loader";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { username, password, loading, isLoggedIn } = useSelector(
    (state) => state.login
  );

  const [showModal, setShowModal] = useState(false);
  const [remember, setRemember] = useState(true);

  // ✅ restore saved username (only once)
  useEffect(() => {
    const savedUsername = Cookies.get("login_username");
    if (savedUsername) dispatch(setUsername(savedUsername));
  }, [dispatch]);

  // ✅ after login, go back to where user came from
  useEffect(() => {
    if (!isLoggedIn) return;

    const from = location.state?.from || "/profile";
    navigate(from, { replace: true });
  }, [isLoggedIn, navigate, location.state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) return;

    if (remember) Cookies.set("login_username", username, { expires: 7 });
    else Cookies.remove("login_username");

    dispatch(loginUser({ username, password }));
  };

  if (loading) return <Loader />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            required
            label="Username"
            type="text"
            value={username}
            onInput={(e) => dispatch(setUsername(e.target.value))}
            placeholder="Enter your username"
          />

          <Input
            required
            label="Password"
            type="password"
            value={password}
            onInput={(e) => dispatch(setPassword(e.target.value))}
            placeholder="Enter your password"
            showPasswordToggle
          />

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="remember" className="text-sm text-gray-600">
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-primary-light transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 font-medium hover:underline"
          >
            Sign up
          </Link>
        </div>

        <div className="mt-4 text-sm text-center">
          <button
            onClick={() => setShowModal(true)}
            className="text-red-500 font-medium hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-bold text-center mb-4">
              Forgot Password
            </h3>
            <p className="text-center text-gray-600">
              Please contact{" "}
              <a
                href="mailto:info@ctgsomitidmm.com"
                className="text-blue-500 font-medium hover:underline"
              >
                info@ctgsomitidmm.com
              </a>
            </p>
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowModal(false)}
                className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-light transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

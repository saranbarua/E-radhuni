import { useState } from "react";
import Input from "../../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import apiurl from "../../../apiurl/apiurl";
import toast from "react-hot-toast";
import Button from "../../../components/Button/Button";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    mobileNumberBD: "",
    presentAddress: "",
    password: "",

    // Optional fields for API
    email: "",
    avatarUrl: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Minimal required fields for /auth/register
    const username = (formData.fullName || "").trim(); // better: use a dedicated username field
    const password = (formData.password || "").trim();
    const phone = (formData.mobileNumberBD || "").trim();

    if (!username || !password || !phone) {
      toast.error("Username, password, and phone are required");
      setIsSubmitting(false);
      return;
    }

    // Build request body according to API
    const payload = {
      username,
      password,
      phone,
      email: formData.email?.trim() || undefined,
      address: formData.presentAddress?.trim() || undefined,
      avatarUrl: formData.avatarUrl?.trim() || undefined,
    };

    try {
      const response = await axios.post(
        `${apiurl.mainUrl}/auth/register`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response?.data;

      // API spec: { message, user, token }
      if (result?.token && result?.user) {
        Cookies.set("access_token", result.token, { expires: 7 }); // 7 days
        Cookies.set("user_role", result.user.role || "user", { expires: 7 });

        toast.success(result.message || "User registered successfully ");
        navigate("/");
      } else {
        toast.error("Registration failed. Invalid server response.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 409) {
          toast.error(
            message || "User with this username or phone already exists"
          );
        } else if (status === 400) {
          toast.error(message || "Username, password, and phone are required");
        } else {
          toast.error(message || "Server error occurred. Try again.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-1/2 my-5 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Register Your Account
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name (Username)"
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter username"
            />

            <Input
              label="Phone"
              type="text"
              id="mobileNumberBD"
              name="mobileNumberBD"
              value={formData.mobileNumberBD}
              onChange={handleChange}
              placeholder="017XXXXXXXX"
            />

            <Input
              label="Password"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />

            <Input
              label="Email (Optional)"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
            />

            <Input
              label="Address (Optional)"
              type="text"
              id="presentAddress"
              name="presentAddress"
              value={formData.presentAddress}
              onChange={handleChange}
              placeholder="Dhaka"
            />

            <Input
              label="Avatar URL (Optional)"
              type="text"
              id="avatarUrl"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <Button
            type="Register"
            title={isSubmitting ? "Processing..." : "Registration"}
            className="bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-primary-light transition duration-300"
            disabled={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};

export default Signup;

import apiurl from "../../../apiurl/apiurl";
import Input from "../../../components/Input/Input";
import { useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setLoading(true);

    try {
      const token = Cookies.get("token");
      const response = await fetch(`${apiurl.mainUrl}/member/change-pass`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password changed Succusfully");
      } else {
        toast.error("Failed to change password." || data.message);
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setNewPassword("");
      setOldPassword("");
      setConfirmNewPassword("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Change Password
        </h2>

        <Input
          required={true}
          label="Old Password"
          type="password"
          value={oldPassword}
          onInput={(e) => setOldPassword(e.target.value)}
          placeholder="Enter your old password"
        />
        <Input
          required={true}
          label="New Password"
          type="password"
          value={newPassword}
          onInput={(e) => setNewPassword(e.target.value)}
          placeholder="Enter your new password"
        />
        <Input
          required={true}
          label="Confirm New Password"
          type="password"
          value={confirmNewPassword}
          onInput={(e) => setConfirmNewPassword(e.target.value)}
          placeholder="Confirm your new password"
        />
        <button
          type="button"
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-primary"
          } text-white font-medium py-2 px-4 rounded-lg hover:bg-primary-light transition duration-300`}
          onClick={handleChangePassword}
          disabled={loading}
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;

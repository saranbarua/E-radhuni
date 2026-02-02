import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useProfile from "../../../components/hooks/useProfile";
import useUpdateProfile from "../../../components/hooks/useUpdateProfile";
import Loader from "../../../components/Loader/Loader";

const Field = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label className="text-xs font-bold text-gray-600">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
    />
  </div>
);

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { profileData, isLoading, error } = useProfile();
  const { updateProfile, isSaving } = useUpdateProfile();

  const [form, setForm] = useState({
    username: "",
    phone: "",
    email: "",
    address: "",
    avatarUrl: "",
  });

  const userId = useMemo(() => profileData?.id, [profileData]);

  useEffect(() => {
    if (profileData) {
      setForm({
        username: profileData?.username || "",
        phone: profileData?.phone || "",
        email: profileData?.email || "",
        address: profileData?.address || "",
        avatarUrl: profileData?.avatarUrl || "",
      });
    }
  }, [profileData]);

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border rounded-2xl p-6 shadow-sm">
          <p className="text-center text-red-500 font-medium">
            Failed to load profile data.
          </p>
          <button
            onClick={() => navigate("/profile")}
            className="mt-4 w-full rounded-2xl bg-gray-900 text-white py-3 text-sm font-extrabold"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    // ✅ payload only allowed fields
    const payload = {
      username: form.username.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      avatarUrl: form.avatarUrl.trim(),
    };

    // ✅ basic validation
    if (!payload.username) return toast.error("Username required");
    if (!payload.phone) return toast.error("Phone required");
    if (!payload.address) return toast.error("Address required");

    const updated = await updateProfile({ id: userId, payload });

    if (updated) {
      navigate("/profile", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/profile")}
            className="text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            ← Back
          </button>
          <div className="text-xs uppercase tracking-widest text-gray-400">
            Edit Profile
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="rounded-3xl border bg-white p-6 md:p-8 shadow-sm">
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">
            Update your profile
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            এগুলো শুধু আপনার নিজের account-এর জন্য update হবে।
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Username"
                value={form.username}
                onChange={(v) => setForm((p) => ({ ...p, username: v }))}
                placeholder="Your name"
              />

              <Field
                label="Phone"
                value={form.phone}
                onChange={(v) => setForm((p) => ({ ...p, phone: v }))}
                placeholder="01XXXXXXXXX"
              />

              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm((p) => ({ ...p, email: v }))}
                placeholder="example@mail.com"
              />

              <Field
                label="Avatar URL (optional)"
                value={form.avatarUrl}
                onChange={(v) => setForm((p) => ({ ...p, avatarUrl: v }))}
                placeholder="https://..."
              />

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-600">
                  Address
                </label>
                <textarea
                  value={form.address}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, address: e.target.value }))
                  }
                  placeholder="বাসা নাম্বার, রোড, এলাকা, জেলা"
                  className="mt-2 w-full min-h-[120px] rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 rounded-2xl bg-[#8f0910] text-white py-3 text-sm font-extrabold disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 rounded-2xl border border-gray-200 bg-white py-3 text-sm font-extrabold text-gray-900 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-900">
                Security note
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Backend এ rule থাকবে: Admin সব user update করতে পারবে, আর normal
                user শুধু নিজেরটা update করতে পারবে।
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

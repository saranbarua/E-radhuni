import { Link } from "react-router-dom";
import useProfile from "../../../components/hooks/useProfile";
import Loader from "../../../components/Loader/Loader";

const formatDate = (iso) => {
  if (!iso) return "N/A";
  try {
    return new Date(iso).toISOString().split("T")[0];
  } catch {
    return "N/A";
  }
};

const Avatar = ({ name, avatarUrl }) => {
  const initials =
    name
      ?.trim()
      ?.split(" ")
      ?.slice(0, 2)
      ?.map((w) => w[0])
      ?.join("") || "U";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name || "User"}
        className="h-16 w-16 md:h-20 md:w-20 rounded-2xl object-cover ring-2 ring-white shadow"
        crossOrigin="anonymous"
      />
    );
  }

  return (
    <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-xl md:text-2xl font-semibold shadow">
      {initials.toUpperCase()}
    </div>
  );
};

const InfoRow = ({ label, value }) => {
  const display = value ? value : "N/A";
  const isEmpty = !value;

  return (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
        <p className="text-xs sm:text-sm text-gray-500">{label}</p>
        <p
          className={`text-sm font-medium break-words sm:text-right ${
            isEmpty ? "text-gray-400" : "text-gray-900"
          }`}
        >
          {display}
        </p>
      </div>
    </div>
  );
};

const ActionButton = ({ to, children, variant = "primary" }) => {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium transition border";
  const styles =
    variant === "primary"
      ? "bg-primary text-white border-primary hover:opacity-90"
      : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50";

  return (
    <Link to={to} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
};

const MiniAction = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-3 py-2 rounded-xl text-sm font-medium bg-white border border-gray-200 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);

export default function Profile() {
  const { profileData, isLoading, error } = useProfile();

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border rounded-2xl p-6 shadow-sm">
          <p className="text-center text-red-500 font-medium">
            Failed to load profile data.
          </p>
          <p className="text-center text-gray-500 text-sm mt-2">
            Please try again later.
          </p>
          <div className="mt-4 flex justify-center">
            <Link
              to="/"
              className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const {
    id,
    username,
    phone,
    email,
    address,
    avatarUrl,
    createdAt,
    updatedAt,
  } = profileData || {};

  const copy = async (text) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={username} avatarUrl={avatarUrl || null} />

            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                {username || "User Profile"}
              </h1>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  ID: {id || "N/A"}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                  Status: Active
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  Joined: {formatDate(createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Primary Actions */}
          {/* <div className="flex flex-wrap items-center gap-2">
            <ActionButton to="/change-password" variant="primary">
              Change Password
            </ActionButton>

            <ActionButton to="/profile/edit" variant="secondary">
              Edit Profile
            </ActionButton>
          </div> */}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Quick Actions + Meta */}
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <h2 className="text-base font-bold text-gray-900">
                Quick actions
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Copy contact details quickly.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <MiniAction onClick={() => copy(phone)} disabled={!phone}>
                  Copy Phone
                </MiniAction>
                <MiniAction onClick={() => copy(email)} disabled={!email}>
                  Copy Email
                </MiniAction>
                <MiniAction
                  onClick={() =>
                    (window.location.href = phone ? `tel:${phone}` : "#")
                  }
                  disabled={!phone}
                >
                  Call
                </MiniAction>
                <MiniAction
                  onClick={() =>
                    (window.location.href = email ? `mailto:${email}` : "#")
                  }
                  disabled={!email}
                >
                  Email
                </MiniAction>
              </div>

              <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Last updated</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {formatDate(updatedAt)}
                </p>
              </div>
            </div>
          </aside>

          {/* Right: Details */}
          <main className="lg:col-span-8">
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Profile details
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Your saved contact and address information.
                  </p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                  Verified: No
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-gray-100 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Contact
                  </h3>
                  <InfoRow label="Phone" value={phone} />
                  <InfoRow label="Email" value={email} />
                </div>

                <div className="rounded-2xl border border-gray-100 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Address
                  </h3>
                  <InfoRow label="Address" value={address} />
                </div>
              </div>

              {/* Tips */}
              <div className="mt-4 rounded-2xl bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-900">
                  Small improvements that matter
                </p>
                <ul className="mt-2 text-sm text-gray-600 list-disc pl-5 space-y-1">
                  <li>Upload a profile photo for faster identification.</li>
                  <li>Verify email/phone to unlock member services.</li>
                  <li>Keep your address updated for deliveries and support.</li>
                </ul>
              </div>
            </div>

            {/* Optional: Secondary card */}
            <div className="mt-6 bg-white rounded-2xl border shadow-sm p-5">
              <h3 className="text-base font-bold text-gray-900">
                Privacy note
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                We never show your sensitive information publicly.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

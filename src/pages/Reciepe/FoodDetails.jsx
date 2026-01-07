import { useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import useContentDetails from "../../../components/hooks/useContentDetails";
import Loader from "../../../components/Loader/Loader";

const getYoutubeId = (url) => {
  if (!url) return "";
  try {
    if (url.includes("youtu.be/"))
      return url.split("youtu.be/")[1]?.split(/[?&]/)[0] || "";
    if (url.includes("v=")) return url.split("v=")[1]?.split("&")[0] || "";
    if (url.includes("/shorts/"))
      return url.split("/shorts/")[1]?.split(/[?&]/)[0] || "";
    return "";
  } catch {
    return "";
  }
};

const Badge = ({ type }) => {
  const paid = (type || "").toUpperCase() === "PAID";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
        paid
          ? "bg-amber-100 text-amber-800 border-amber-200"
          : "bg-emerald-100 text-emerald-700 border-emerald-200"
      }`}
    >
      {paid ? "PAID" : "FREE"}
    </span>
  );
};

const Chip = ({ children }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
    {children}
  </span>
);

export default function FoodDetail() {
  const { id } = useParams();
  const { content, isLoading, error } = useContentDetails(id);
  console.log(content);
  const { isLoggedIn } = useSelector((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();

  const youtubeId = useMemo(
    () => getYoutubeId(content?.youtubeLink),
    [content?.youtubeLink]
  );

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-serif">
        <div className="w-full max-w-md bg-white border rounded-2xl p-6 text-center shadow-sm">
          <p className="text-red-500 font-semibold">Failed to load content</p>
          <p className="text-gray-500 text-sm mt-2">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const paid = (content?.contentType || "FREE").toUpperCase() === "PAID";
  const locked = paid && !isLoggedIn;

  const handleLogin = () => {
    toast.error("Paid content দেখতে হলে আগে Login করুন");
    navigate("/login", {
      state: { from: location.pathname, contentId: id },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            ← Back
          </button>

          <div className="mt-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                {content?.title || "Recipe"}
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                {content?.category?.name
                  ? `Category: ${content.category.name}`
                  : "Category: N/A"}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge type={content?.contentType} />
                <Chip>{content?.status || "ACTIVE"}</Chip>
                <Chip>
                  Ingredients:{" "}
                  {Array.isArray(content?.ingredients)
                    ? content.ingredients.length
                    : 0}
                </Chip>
              </div>
            </div>

            {/* Action Card */}
            {/* <div className="bg-gray-50 border rounded-2xl p-4 w-full md:w-80">
              <p className="text-xs text-gray-500">Access</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {locked ? "Locked (Login required)" : "Available"}
              </p>

              {locked ? (
                <button
                  onClick={handleLogin}
                  className="mt-4 w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-black transition"
                >
                  Login to Unlock
                </button>
              ) : (
                <a
                  href={content?.youtubeLink || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 block text-center w-full py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition"
                >
                  Watch on YouTube
                </a>
              )}
            </div> */}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video + Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video */}
            <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
              <div className="relative aspect-video bg-black">
                {youtubeId ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={content?.title || "YouTube video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-sm">
                    Video link not available
                  </div>
                )}

                {/* Lock overlay */}
                {locked && (
                  <div className="absolute inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="max-w-md text-center">
                      <p className="text-white text-lg font-extrabold">
                        This content is PAID
                      </p>
                      <p className="text-white/90 text-sm mt-2">
                        Access পেতে Login করুন। তারপর subscription order করে
                        admin approval নিন।
                      </p>

                      <button
                        onClick={handleLogin}
                        className="mt-4 px-5 py-2.5 rounded-xl bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100"
                      >
                        Login Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-gray-900">
                Description
              </h2>

              {locked ? (
                <div className="mt-3 rounded-xl bg-gray-50 border p-4">
                  <p className="text-sm text-gray-700 font-semibold">
                    Locked Preview
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Login করলে full description দেখতে পারবেন।
                  </p>
                </div>
              ) : (
                <div
                  className="prose prose-sm max-w-none mt-3"
                  dangerouslySetInnerHTML={{
                    __html: content?.description || "<p>No description</p>",
                  }}
                />
              )}
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-6">
            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-gray-900">
                Ingredients
              </h2>

              {locked ? (
                <div className="mt-3 rounded-xl bg-gray-50 border p-4">
                  <p className="text-sm text-gray-700">
                    Login required to see ingredients list.
                  </p>
                </div>
              ) : Array.isArray(content?.ingredients) &&
                content.ingredients.length ? (
                <ul className="mt-4 space-y-2">
                  {content.ingredients.map((ing, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-red-500 shrink-0" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 mt-3">
                  No ingredients added.
                </p>
              )}
            </div>

            {/* Quick info */}
            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-extrabold text-gray-900">
                Quick Info
              </h3>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Type</span>
                  <span className="font-semibold text-gray-900">
                    {content?.contentType || "FREE"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className="font-semibold text-gray-900">
                    {content?.status || "ACTIVE"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Updated</span>
                  <span className="font-semibold text-gray-900">
                    {content?.updatedAt
                      ? new Date(content.updatedAt).toISOString().split("T")[0]
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            {locked && (
              <div className="bg-gray-900 text-white rounded-2xl p-5">
                <p className="text-sm font-extrabold">Unlock paid recipes</p>
                <p className="text-xs text-white/80 mt-2 leading-relaxed">
                  Login → Plan choose → Order pending → Admin accepted → Access
                  granted
                </p>
                <button
                  onClick={handleLogin}
                  className="mt-4 w-full py-2.5 rounded-xl bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100"
                >
                  Login & Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

const tagUi = (contentType) => {
  const paid = (contentType || "").toUpperCase() === "PAID";
  return paid
    ? {
        label: "PAID",
        className: "bg-amber-100/80 text-amber-900 border-amber-200 shadow-sm",
        dot: "bg-amber-500",
      }
    : {
        label: "FREE",
        className:
          "bg-emerald-100/80 text-emerald-900 border-emerald-200 shadow-sm",
        dot: "bg-emerald-500",
      };
};

const getYoutubeThumb = (url) => {
  if (!url) return null;
  try {
    let id = "";
    if (url.includes("youtu.be/"))
      id = url.split("youtu.be/")[1]?.split(/[?&]/)[0];
    else if (url.includes("v=")) id = url.split("v=")[1]?.split("&")[0];
    else if (url.includes("/shorts/"))
      id = url.split("/shorts/")[1]?.split(/[?&]/)[0];
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  } catch {
    return null;
  }
};
const Star = ({ filled }) => (
  <svg
    viewBox="0 0 20 20"
    className={`h-4 w-4 ${filled ? "text-amber-400" : "text-white/35"}`}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.363 2.444a1 1 0 00-.364 1.118l1.286 3.955c.3.921-.755 1.688-1.539 1.118L10.55 15.6a1 1 0 00-1.175 0l-3.398 2.467c-.783.57-1.838-.197-1.539-1.118l1.286-3.955a1 1 0 00-.364-1.118L2 9.382c-.783-.57-.38-1.81.588-1.81h4.157a1 1 0 00.95-.69l1.354-3.955z" />
  </svg>
);

const RatingPill = ({ rating = 0, count = 0 }) => {
  const safeRating = Number.isFinite(+rating) ? +rating : 0;
  const safeCount = Number.isFinite(+count) ? +count : 0;

  const filledStars = Math.round(safeRating); // 3.2 => 3, 4.6 => 5

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 backdrop-blur-md shadow-sm">
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            viewBox="0 0 20 20"
            className={`h-4 w-4 ${
              i <= filledStars ? "text-amber-400" : "text-white/30"
            }`}
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.363 2.444a1 1 0 00-.364 1.118l1.286 3.955c.3.921-.755 1.688-1.539 1.118L10.55 15.6a1 1 0 00-1.175 0l-3.398 2.467c-.783.57-1.838-.197-1.539-1.118l1.286-3.955a1 1 0 00-.364-1.118L2 9.382c-.783-.57-.38-1.81.588-1.81h4.157a1 1 0 00.95-.69l1.354-3.955z" />
          </svg>
        ))}
      </div>

      {/* Value */}
      <div className="flex items-center gap-1">
        <span className="text-xs font-extrabold text-white tabular-nums">
          {safeRating.toFixed(1)}
        </span>
        <span className="text-[11px] text-white/75">({safeCount})</span>
      </div>
    </div>
  );
};
const getStableNumber = (id) => {
  const s = String(id ?? "1");
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) % 100000;
  }
  return hash || 1;
};

const getDemoRating = (item) => {
  const base = getStableNumber(item?.id);

  const rating = 3 + (base % 3); // 3, 4, 5
  const count = 40 + (base % 160); // 40–199

  return { rating, count };
};

const StatPill = ({ label, value }) => (
  <div className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 backdrop-blur px-4 py-1.5 shadow-sm transition-all duration-300 hover:shadow-md">
    <span className="text-[11px] uppercase tracking-wide text-gray-400">
      {label}
    </span>
    <span className="text-sm font-semibold text-gray-900 tabular-nums">
      {value}
    </span>
  </div>
);

export default function RegularRanna({ heading, items = [] }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.login);

  const handleClick = (item) => {
    const type = (item.contentType || "FREE").toUpperCase();
    if (type === "PAID" && !isLoggedIn) {
      toast.error("Paid content দেখতে হলে আগে Login করুন");
      navigate("/login", { state: { from: "/", contentId: item.id } });
      return;
    }
    navigate(`/food-detail/${item.id}`);
  };

  const total = items?.length || 0;
  const paidCount = items.filter(
    (i) => (i.contentType || "").toUpperCase() === "PAID",
  ).length;
  const freeCount = total - paidCount;

  return (
    <section className="py-10 font-serif">
      <div className="max-w-6xl mx-auto px-4">
        {/* Premium Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 border border-gray-200 bg-gradient-to-r from-white to-gray-50 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-xs font-semibold text-gray-700">
                Curated Collection
              </span>
            </div>

            <h2 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              {heading}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Handpicked recipes with clean steps and ingredients.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <StatPill label="Total" value={total} />
            <StatPill label="Free" value={freeCount} />
            <StatPill label="Paid" value={paidCount} />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {items.slice(0, 4).map((item) => {
            const badge = tagUi(item.contentType);
            const thumb =
              getYoutubeThumb(item.youtubeLink) ||
              "https://dummyimage.com/600x400/e5e7eb/111827&text=Recipe";

            const isPaid =
              (item.contentType || "FREE").toUpperCase() === "PAID";
            const isLocked = isPaid && !isLoggedIn;
            const demo = getDemoRating(item);

            return (
              <button
                type="button"
                key={item.id}
                onClick={() => handleClick(item)}
                className="text-left group relative overflow-hidden rounded-3xl border border-gray-200 bg-white/70 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-400/40"
              >
                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={thumb}
                    alt={item.title}
                    className={[
                      "h-full w-full object-cover transition-transform duration-700 group-hover:scale-110",
                      isLocked ? "grayscale-[40%] opacity-90" : "",
                    ].join(" ")}
                  />

                  {/* Soft overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent opacity-90" />

                  {/* Badge */}
                  <div
                    className={`absolute top-3 left-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-extrabold tracking-wide ${badge.className}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${badge.dot}`} />
                    {badge.label}
                  </div>

                  {isLocked && (
                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="m-3 rounded-2xl border border-white/15 bg-black/50 backdrop-blur-lg px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-white text-sm font-extrabold">
                              Login to unlock
                            </p>
                            <p className="text-white/80 text-xs mt-0.5 line-clamp-1">
                              Paid recipe • full steps & video access
                            </p>
                          </div>

                          <div className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-extrabold text-gray-900">
                            <FontAwesomeIcon
                              icon={faLock}
                              className="text-red-500"
                            />
                            Unlock
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-base font-extrabold text-gray-900 line-clamp-1">
                    {item.title}
                  </h3>

                  {/* Rating (top-right) */}
                  <div className="flex items-center justify-between mt-1">
                    <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                      {item.category?.name
                        ? item.category.name
                        : "Category: N/A"}
                    </p>

                    <RatingPill
                      rating={item.rating ?? demo.rating}
                      count={item.ratingCount ?? demo.count}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-[11px] text-gray-500">
                      Ingredients{" "}
                      <span className="font-semibold text-gray-900">
                        {Array.isArray(item.ingredients)
                          ? item.ingredients.length
                          : 0}
                      </span>
                    </p>
                    {isLocked ? (
                      <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-gray-700">
                        <FontAwesomeIcon
                          icon={faLock}
                          className="text-red-500"
                        />
                        Login
                        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                          →
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-gray-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                        View
                        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                          →
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom glow line */}
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-8">
          <Link
            to="/recipes"
            className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 border border-gray-200 bg-white shadow-sm text-sm font-extrabold text-gray-900 hover:shadow-md hover:-translate-y-0.5 transition"
          >
            View more recipes
            <span className="text-red-500">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

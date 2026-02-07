import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import useContentDetails from "../../../components/hooks/useContentDetails";
import Loader from "../../../components/Loader/Loader";
import apiurl from "../../../apiurl/apiurl";
import ReviewModal from "../../../components/Modal/ReviewModal";

/** ---------- utils ---------- */
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

const safeNum = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const computeStats = (list = []) => {
  const valid = (Array.isArray(list) ? list : []).filter(
    (r) => safeNum(r?.score, 0) >= 1 && safeNum(r?.score, 0) <= 5,
  );
  if (!valid.length) return { averageRating: 0, ratingCount: 0 };
  const sum = valid.reduce((a, r) => a + safeNum(r?.score, 0), 0);
  return { averageRating: sum / valid.length, ratingCount: valid.length };
};

const getStableNumber = (id) => {
  const s = String(id ?? "1");
  let hash = 0;
  for (let i = 0; i < s.length; i++)
    hash = (hash * 31 + s.charCodeAt(i)) % 100000;
  return hash || 1;
};

const getDemoStats = (id) => {
  const base = getStableNumber(id);
  const rating = 3 + (base % 21) / 10; // 3.0–5.0
  const count = 40 + (base % 160); // 40–199
  return { averageRating: Math.min(5, rating), ratingCount: count };
};

/** ---------- small UI components ---------- */
const StarIcon = ({ filled = false, size = 18 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={filled ? "text-amber-500" : "text-gray-300"}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 17.27l5.18 3.11c.38.23.86-.11.76-.55l-1.37-5.9 4.59-3.98c.34-.29.16-.86-.29-.89l-6.04-.52-2.36-5.55c-.17-.41-.75-.41-.92 0L8.19 8.54l-6.04.52c-.45.03-.63.6-.29.89l4.59 3.98-1.37 5.9c-.1.44.38.78.76.55L12 17.27z" />
  </svg>
);

const ProgressBar = ({ value = 0 }) => (
  <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
    <div
      className="h-full rounded-full bg-amber-500"
      style={{ width: `${value}%` }}
    />
  </div>
);

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

const RatingsAndReviewsCard = ({
  averageRating = 0,
  ratingCount = 0,
  myScore = 0,
  onStarRate,
  onWriteReview,
  disabled = false,
}) => {
  const safeAvg = safeNum(averageRating, 0);
  const safeTotal = safeNum(ratingCount, 0);

  // static distribution (later backend breakdown আনলে replace করবেন)
  const dist = [
    { star: 5, pct: 78 },
    { star: 4, pct: 12 },
    { star: 3, pct: 5 },
    { star: 2, pct: 2 },
    { star: 1, pct: 3 },
  ];

  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">
      {/* Rate */}
      <div className="pb-4 border-b">
        <p className="text-base font-extrabold text-gray-900">
          Rate this recipe
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {disabled
            ? "Login করলে rating দিতে পারবেন"
            : "Tell others what you think"}
        </p>

        {/* ⭐ Stars row */}
        <div className="mt-3 flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              disabled={disabled}
              className="p-1 rounded-lg hover:bg-gray-100 transition disabled:opacity-60"
            >
              ⭐
            </button>
          ))}
        </div>

        {/* ✍️ CTA */}
        <button
          type="button"
          onClick={onWriteReview}
          className="mt-3 text-sm font-semibold text-red-500 hover:text-red-600"
        >
          Write a review
        </button>
      </div>

      {/* Stats */}
      <div className="pt-4">
        <div className="flex items-center justify-between">
          <p className="text-base font-extrabold text-gray-900">
            Ratings and reviews
          </p>
          <span className="text-xs text-gray-400">Live</span>
        </div>

        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
          Ratings and reviews are aggregated from users.
        </p>

        <div className="mt-4 grid grid-cols-12 gap-4 items-center">
          <div className="col-span-4">
            <div className="text-5xl font-extrabold text-gray-900 leading-none">
              {safeAvg.toFixed(1)}
            </div>

            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <StarIcon key={i} filled={i <= Math.round(safeAvg)} size={16} />
              ))}
            </div>

            <div className="mt-1 text-sm text-gray-500">
              {safeTotal.toLocaleString()}
            </div>
          </div>

          <div className="col-span-8 space-y-2">
            {dist.map((d) => (
              <div key={d.star} className="flex items-center gap-3">
                <div className="w-6 text-xs font-semibold text-gray-700">
                  {d.star}
                </div>
                <ProgressBar value={d.pct} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/** ---------- main page ---------- */
export default function FoodDetail() {
  const { id } = useParams();
  const { content, isLoading, error } = useContentDetails(id);

  const { isLoggedIn } = useSelector((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();

  // modal state
  const [reviewOpen, setReviewOpen] = useState(false);

  const youtubeId = useMemo(
    () => getYoutubeId(content?.youtubeLink),
    [content?.youtubeLink],
  );

  const paid = (content?.contentType || "FREE").toUpperCase() === "PAID";
  const locked = paid && !isLoggedIn;

  /** ---------- ratings state ---------- */
  const [ratings, setRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [ratingsError, setRatingsError] = useState(null);

  const [myRating, setMyRating] = useState(null);

  const token = Cookies.get("token");

  const fetchContentRatings = async () => {
    if (!id) return;
    setRatingsLoading(true);
    setRatingsError(null);
    try {
      const res = await axios.get(`${apiurl.mainUrl}/ratings/content/${id}`);
      const data = res.data?.data || res.data || [];
      setRatings(Array.isArray(data) ? data : []);
    } catch (e) {
      setRatingsError(e?.response?.data?.message || e.message);
    } finally {
      setRatingsLoading(false);
    }
  };

  const fetchMyRatings = async () => {
    if (!id || !token) {
      setMyRating(null);
      return;
    }
    try {
      const res = await axios.get(`${apiurl.mainUrl}/ratings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = res.data?.data || res.data || [];
      const mine = Array.isArray(list)
        ? list.find((r) => r?.contentId === id)
        : null;
      setMyRating(mine || null);
    } catch {
      setMyRating(null);
    }
  };

  useEffect(() => {
    fetchContentRatings();
    fetchMyRatings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  const statsFromRatings = useMemo(() => computeStats(ratings), [ratings]);
  const demo = useMemo(() => getDemoStats(id), [id]);

  const finalAverage = useMemo(() => {
    if (statsFromRatings.ratingCount > 0) return statsFromRatings.averageRating;
    if (safeNum(content?.averageRating, 0) > 0)
      return safeNum(content?.averageRating, 0);
    return demo.averageRating;
  }, [statsFromRatings, content?.averageRating, demo.averageRating]);

  const finalCount = useMemo(() => {
    if (statsFromRatings.ratingCount > 0) return statsFromRatings.ratingCount;
    if (safeNum(content?.ratingCount, 0) > 0)
      return safeNum(content?.ratingCount, 0);
    return demo.ratingCount;
  }, [statsFromRatings, content?.ratingCount, demo.ratingCount]);

  const handleLogin = () => {
    toast.error("Paid content দেখতে হলে আগে Login করুন");
    navigate("/login", { state: { from: location.pathname, contentId: id } });
  };

  const upsertRating = async ({ score, comment }) => {
    if (!token) throw new Error("Login required");

    const payload = {
      contentId: id,
      score,
      comment: comment || "",
    };

    const res = await axios.post(`${apiurl.mainUrl}/ratings`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const saved = res.data?.data || res.data?.rating || res.data;

    // update myRating immediately
    setMyRating(saved || null);

    // refresh list to keep it accurate
    await fetchContentRatings();

    return saved;
  };

  // ⭐ Star click -> only score save (comment not sent)
  const handleStarRate = async (score) => {
    if (!isLoggedIn) {
      toast.error("Rating দিতে হলে আগে Login করুন");
      navigate("/login", { state: { from: location.pathname, contentId: id } });
      return;
    }
    try {
      await upsertRating({ score }); // ✅ only score
      toast.success("আপনার rating save হয়েছে");
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message);
    }
  };

  // ✍️ CTA click
  const handleWriteReview = () => {
    if (!isLoggedIn) {
      toast.error("Review লিখতে হলে আগে Login করুন");
      navigate("/login", { state: { from: location.pathname, contentId: id } });
      return;
    }
    setReviewOpen(true);
  };

  // ✅ Modal submit -> score + comment
  const handleSubmitReview = async ({ score, comment }) => {
    await upsertRating({ score, comment });
    await fetchMyRatings();
  };

  /** ---------- loading / error ---------- */
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

  /** ---------- render ---------- */
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
                <Chip>
                  ⭐ {safeNum(finalAverage, 0).toFixed(1)} (
                  {safeNum(finalCount, 0).toLocaleString()})
                </Chip>
              </div>
            </div>
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

          {/* Right column */}
          <div className="space-y-6">
            {/* Ingredients */}
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

            {/* Ratings */}
            <RatingsAndReviewsCard
              averageRating={finalAverage}
              ratingCount={finalCount}
              myScore={safeNum(myRating?.score, 0)}
              onStarRate={handleStarRate}
              onWriteReview={handleWriteReview}
              disabled={!isLoggedIn || locked}
            />

            {/* Recent Reviews */}
            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-gray-900">
                  Recent Reviews
                </h3>
                <button
                  type="button"
                  onClick={fetchContentRatings}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Refresh
                </button>
              </div>

              {ratingsLoading ? (
                <p className="text-sm text-gray-500 mt-3">Loading reviews...</p>
              ) : ratingsError ? (
                <p className="text-sm text-red-500 mt-3">{ratingsError}</p>
              ) : !ratings.length ? (
                <p className="text-sm text-gray-500 mt-3">No reviews yet.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {ratings.slice(0, 6).map((r) => (
                    <div
                      key={r.id || `${r.contentId}-${r.createdAt}`}
                      className="border rounded-xl p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <StarIcon
                              key={i}
                              filled={i <= safeNum(r?.score, 0)}
                              size={14}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">
                          {r?.createdAt
                            ? new Date(r.createdAt).toISOString().split("T")[0]
                            : ""}
                        </span>
                      </div>

                      {r?.comment ? (
                        <p className="text-sm text-gray-700 mt-2">
                          {r.comment}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 mt-2">No comment</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
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

      {/* ✅ Review Modal (Option B) */}
      <ReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        initialScore={safeNum(myRating?.score, 0)}
        initialComment={myRating?.comment || ""}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}

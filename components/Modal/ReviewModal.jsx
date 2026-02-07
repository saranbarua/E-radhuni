import { useState } from "react";
import toast from "react-hot-toast";

const StarIcon = ({ filled, onClick }) => (
  <button type="button" onClick={onClick} className="p-1">
    <svg
      viewBox="0 0 24 24"
      className={filled ? "text-yellow-400" : "text-gray-300"}
      width={26}
      height={26}
      fill="currentColor"
    >
      <path d="M12 17.27l5.18 3.11c.38.23.86-.11.76-.55l-1.37-5.9 4.59-3.98c.34-.29.16-.86-.29-.89l-6.04-.52-2.36-5.55c-.17-.41-.75-.41-.92 0L8.19 8.54l-6.04.52c-.45.03-.63.6-.29.89l4.59 3.98-1.37 5.9c-.1.44.38.78.76.55L12 17.27z" />
    </svg>
  </button>
);

export default function ReviewModal({
  open,
  onClose,
  initialScore = 0,
  initialComment = "",
  onSubmit,
}) {
  const [score, setScore] = useState(initialScore);
  const [comment, setComment] = useState(initialComment);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!score) {
      toast.error("Please select a rating");
      return;
    }
    try {
      setLoading(true);
      await onSubmit({ score, comment });
      toast.success("Review submitted");
      onClose();
    } catch (e) {
      toast.error("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-extrabold text-gray-900">Write a review</h3>

        {/* Stars */}
        <div className="mt-4 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <StarIcon key={i} filled={i <= score} onClick={() => setScore(i)} />
          ))}
        </div>

        {/* Comment */}
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience (optional)"
          className="mt-4 w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
        />

        {/* Actions */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

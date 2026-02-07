import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import apiurl from "../../apiurl/apiurl";

const avgFromList = (list = []) => {
  if (!list.length) return { averageRating: 0, ratingCount: 0 };
  const sum = list.reduce((a, r) => a + (Number(r.score) || 0), 0);
  return { averageRating: sum / list.length, ratingCount: list.length };
};

export default function useContentRatings(contentId) {
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = Cookies.get("token");

  const fetchRatings = useCallback(async () => {
    if (!contentId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${apiurl.mainUrl}/ratings/content/${contentId}`,
      );
      const data = res.data?.data || res.data || [];
      setRatings(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setIsLoading(false);
    }
  }, [contentId]);

  // My rating (optional)
  const [myRating, setMyRating] = useState(null);
  const fetchMyRating = useCallback(async () => {
    if (!contentId || !token) return;
    try {
      const res = await axios.get(`${apiurl.mainUrl}/ratings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = res.data?.data || res.data || [];
      const mine = Array.isArray(list)
        ? list.find((r) => r?.contentId === contentId)
        : null;
      setMyRating(mine || null);
    } catch {
      // ignore silently (not critical)
    }
  }, [contentId, token]);

  useEffect(() => {
    fetchRatings();
    fetchMyRating();
  }, [fetchRatings, fetchMyRating]);

  const stats = useMemo(() => avgFromList(ratings), [ratings]);

  // ✅ Upsert rating (POST /ratings)
  const upsertRating = useCallback(
    async ({ score, comment }) => {
      if (!token) throw new Error("Login required");
      const payload = { contentId, score, comment };

      const res = await axios.post(`${apiurl.mainUrl}/ratings`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // server may return rating object / message — handle both
      const saved = res.data?.data || res.data?.rating || res.data;

      // optimistic merge into list
      setRatings((prev) => {
        const next = [...prev];
        const idx = next.findIndex(
          (r) => r?.id && saved?.id && r.id === saved.id,
        );
        if (idx >= 0) next[idx] = saved;
        else next.unshift(saved);
        return next;
      });

      setMyRating(saved);
      return saved;
    },
    [contentId, token],
  );

  return {
    ratings,
    myRating,
    stats, // { averageRating, ratingCount }
    isLoading,
    error,
    refetch: fetchRatings,
    upsertRating,
  };
}

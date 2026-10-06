import { useEffect, useState } from "react";
import api from "../services/api";

function GiftPoints() {
  const [giftPoints, setGiftPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchGiftPoints = async () => {
      if (!userId) {
        setError("Please login to view your Gift Points.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(
          `/gift-points/${userId}`
        );

        setGiftPoints(response.data);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Unable to load Gift Points."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGiftPoints();
  }, [userId]);

  if (loading) {
    return <p>Loading Gift Points...</p>;
  }

  if (error) {
    return (
      <div>
        <h1>Gift Points</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Gift Points</h1>

      <h2>
        {giftPoints?.points ?? 0} Points
      </h2>

      <p>
        Earn 1 Gift Point for every ₹100 spent.
      </p>

      {giftPoints?.updatedAt && (
        <p>
          <strong>Last Updated:</strong>{" "}
          {new Date(
            giftPoints.updatedAt
          ).toLocaleString()}
        </p>
      )}
    </div>
  );
}

export default GiftPoints;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function GiftPoints() {
  const [giftPoints, setGiftPoints] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const userId =
    localStorage.getItem("userId");

  const userName =
    localStorage.getItem("userName");

  /*
   * Backend LocalDateTime values are generated in UTC
   * on the deployed Render server but do not contain
   * timezone information.
   *
   * Treat timestamps without an offset as UTC before
   * displaying them in India Standard Time.
   */
  const parseBackendDate = (dateValue) => {
    if (!dateValue) {
      return null;
    }

    const hasTimezone =
      dateValue.endsWith("Z") ||
      /[+-]\d{2}:\d{2}$/.test(dateValue);

    return new Date(
      hasTimezone ? dateValue : `${dateValue}Z`
    );
  };

  const formatGiftPointDate = (dateValue) => {
    const date = parseBackendDate(dateValue);

    if (!date || Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  useEffect(() => {
    const fetchGiftPoints = async () => {
      if (!userId) {
        setError(
          "Please sign in to view your Gift Points."
        );

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
    return (
      <div className="catalogue-state">
        <div className="loading-spinner" />

        <h2>Loading your rewards...</h2>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="empty-page-state">
        <span className="empty-page-icon">
          🎁
        </span>

        <h1>Gift Points</h1>

        <p>
          Sign in to see the rewards you've earned.
        </p>

        <Link
          className="button button-primary"
          to="/login"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-page-state">
        <span className="empty-page-icon">
          !
        </span>

        <h1>Gift Points</h1>

        <p>{error}</p>

        <Link
          className="button button-secondary"
          to="/products"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const points =
    Number(giftPoints?.points) || 0;

  return (
    <div className="rewards-page">
      <section className="rewards-hero">
        <div className="rewards-copy">
          <span className="page-eyebrow">
            BookStore Rewards
          </span>

          <h1>
            Your reading earns rewards.
          </h1>

          <p>
            {userName
              ? `${userName}, every purchase brings you closer to your next reward.`
              : "Every purchase brings you closer to your next reward."}
          </p>
        </div>

        <div className="points-card">
          <span>Available Balance</span>

          <strong>{points}</strong>

          <p>Gift Points</p>
        </div>
      </section>

      <section className="rewards-grid">
        <article className="reward-info-card">
          <div className="reward-icon">
            ₹
          </div>

          <h2>Earn as you shop</h2>

          <p>
            Earn 1 Gift Point for every ₹100 spent
            on successful purchases.
          </p>
        </article>

        <article className="reward-info-card">
          <div className="reward-icon">
            ✦
          </div>

          <h2>Built into checkout</h2>

          <p>
            Eligible points are automatically added
            after a successful payment.
          </p>
        </article>

        <article className="reward-info-card">
          <div className="reward-icon">
            ↻
          </div>

          <h2>Keep reading</h2>

          <p>
            Continue discovering books and building
            your rewards balance.
          </p>
        </article>
      </section>

      <section className="reward-balance-section">
        <div>
          <span className="page-eyebrow">
            Reward Activity
          </span>

          <h2>Your Gift Points</h2>
        </div>

        <div className="reward-balance-row">
          <div>
            <span>Current Balance</span>

            <strong>
              {points}{" "}
              {points === 1
                ? "Point"
                : "Points"}
            </strong>
          </div>

          {giftPoints?.updatedAt && (
            <div>
              <span>Last Updated</span>

              <strong>
                {formatGiftPointDate(
                  giftPoints.updatedAt
                )}
              </strong>
            </div>
          )}
        </div>

        <Link
          className="button button-primary"
          to="/products"
        >
          Continue Shopping
        </Link>
      </section>
    </div>
  );
}

export default GiftPoints;
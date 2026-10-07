import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function RecommendationImage({ product }) {
  const [failed, setFailed] = useState(false);

  if (!product.imageUrl || failed) {
    return (
      <div className="book-placeholder recommendation-cover">
        <span>RECOMMENDED</span>
        <strong>{product.name}</strong>
      </div>
    );
  }

  return (
    <img
      className="product-image"
      src={product.imageUrl}
      alt={product.name}
      onError={() => setFailed(true)}
    />
  );
}

function Recommendations() {
  const [recommendations, setRecommendations] =
    useState([]);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] =
    useState("info");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!userId) {
        setMessage(
          "Please sign in to view personalized recommendations."
        );

        setMessageType("warning");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(
          `/recommendations/${userId}`
        );

        setRecommendations(response.data);
      } catch (error) {
        console.error(
          "Recommendation error:",
          error
        );

        setMessage(
          "Unable to load recommendations."
        );

        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [userId]);

  const addToCart = async (productId) => {
    if (!userId) {
      setMessage(
        "Please sign in before adding books to your cart."
      );

      setMessageType("warning");
      return;
    }

    try {
      await api.post(
        `/cart/${userId}/items`,
        {
          productId,
          quantity: 1,
        }
      );

      setMessage(
        "Recommended book added to your cart."
      );

      setMessageType("success");
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error;

      setMessage(
        backendMessage ||
          "Unable to add book to cart."
      );

      setMessageType("error");
    }
  };

  if (loading) {
    return (
      <div className="catalogue-state">
        <div className="loading-spinner" />

        <h2>
          Finding books for you...
        </h2>

        <p>
          Using your order history to personalize
          your catalogue.
        </p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="empty-page-state">
        <span className="empty-page-icon">✨</span>

        <h1>Recommendations for you</h1>

        <p>
          Sign in to discover books based on your
          order history.
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

  return (
    <div className="commerce-page">
      <section className="recommendation-hero">
        <div>
          <span className="page-eyebrow">
            Personalized Discovery
          </span>

          <h1>Recommended for You</h1>

          <p>
            Book suggestions selected from your
            previous order history and interests.
          </p>
        </div>

        <div className="recommendation-symbol">
          ✦
        </div>
      </section>

      {message && (
        <div
          className={`commerce-message ${messageType}`}
        >
          <span>{message}</span>

          {messageType === "success" && (
            <Link to="/cart">
              View Cart →
            </Link>
          )}
        </div>
      )}

      {recommendations.length === 0 ? (
        <div className="empty-page-state">
          <span className="empty-page-icon">
            📖
          </span>

          <h2>
            We're still learning your taste
          </h2>

          <p>
            Purchase more books and we'll use your
            order history to improve your
            recommendations.
          </p>

          <Link
            className="button button-primary"
            to="/products"
          >
            Explore Catalogue
          </Link>
        </div>
      ) : (
        <>
          <div className="results-summary">
            <p>
              <strong>
                {recommendations.length}
              </strong>{" "}
              personalized{" "}
              {recommendations.length === 1
                ? "recommendation"
                : "recommendations"}
            </p>
          </div>

          <section className="product-grid">
            {recommendations.map((product) => {
              const inStock =
                Number(
                  product.stockQuantity
                ) > 0;

              return (
                <article
                  className="product-card"
                  key={product.id}
                >
                  <div className="product-image-wrapper">
                    <RecommendationImage
                      product={product}
                    />

                    <span
                      className={`stock-badge ${
                        inStock
                          ? "in-stock"
                          : "out-of-stock"
                      }`}
                    >
                      {inStock
                        ? "In Stock"
                        : "Out of Stock"}
                    </span>
                  </div>

                  <div className="product-card-body">
                    <div className="product-meta">
                      <span>
                        {product.category?.name ||
                          "Books"}
                      </span>

                      {product.brand?.name && (
                        <>
                          <span className="meta-dot">
                            •
                          </span>

                          <span>
                            {product.brand.name}
                          </span>
                        </>
                      )}
                    </div>

                    <h2>{product.name}</h2>

                    <p className="product-description">
                      {product.description}
                    </p>

                    <div className="product-price-row">
                      <div>
                        <span className="price-label">
                          Price
                        </span>

                        <strong className="product-price">
                          ₹
                          {Number(
                            product.price
                          ).toFixed(2)}
                        </strong>
                      </div>

                      <span className="stock-count">
                        {product.stockQuantity}{" "}
                        available
                      </span>
                    </div>

                    <div className="product-actions single">
                      <button
                        type="button"
                        disabled={!inStock}
                        onClick={() =>
                          addToCart(product.id)
                        }
                      >
                        {inStock
                          ? "Add to Cart"
                          : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </>
      )}
    </div>
  );
}

export default Recommendations;
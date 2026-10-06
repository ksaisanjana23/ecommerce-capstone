import { useEffect, useState } from "react";
import api from "../services/api";

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!userId) {
        setMessage("Please log in to view personalized recommendations.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(
          `/recommendations/${userId}`
        );

        setRecommendations(response.data);
      } catch (error) {
        console.error("Recommendation error:", error);
        setMessage("Unable to load recommendations.");
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [userId]);

  const addToCart = async (productId) => {
    if (!userId) {
      setMessage("Please log in before adding products to your cart.");
      return;
    }

    try {
      await api.post(`/cart/${userId}/items`, {
        productId,
        quantity: 1,
      });

      setMessage("Product added to cart successfully.");
    } catch (error) {
      console.error("Add to cart error:", error);

      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error;

      setMessage(
        backendMessage || "Unable to add product to cart."
      );
    }
  };

  if (loading) {
    return (
      <div>
        <h1>Recommended for You</h1>
        <p>Loading recommendations...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Recommended for You</h1>

      <p>
        Personalized book recommendations based on your
        order history.
      </p>

      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}

      {recommendations.length === 0 ? (
        <p>
          No personalized recommendations are available yet.
          Purchase more books to help us improve your
          recommendations.
        </p>
      ) : (
        recommendations.map((product) => (
          <div key={product.id}>
            <h2>{product.name}</h2>

            <p>{product.description}</p>

            <p>
              <strong>Price:</strong>{" "}
              ₹{Number(product.price).toFixed(2)}
            </p>

            <p>
              <strong>Category:</strong>{" "}
              {product.category?.name}
            </p>

            <p>
              <strong>Brand:</strong>{" "}
              {product.brand?.name}
            </p>

            <p>
              <strong>Stock:</strong>{" "}
              {product.stockQuantity}
            </p>

            <button
              type="button"
              disabled={product.stockQuantity <= 0}
              onClick={() => addToCart(product.id)}
            >
              {product.stockQuantity > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </button>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Recommendations;
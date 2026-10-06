import { useEffect, useState } from "react";
import api from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedTo, setRelatedTo] = useState("");
  const [relatedLoading, setRelatedLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error(error);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setMessage(
        "Please login before adding products to the cart."
      );
      return;
    }

    try {
      await api.post(`/cart/${userId}/items`, {
        productId,
        quantity: 1,
      });

      setMessage("Product added to cart successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Unable to add product to cart.");
    }
  };

  const handleRelatedProducts = async (product) => {
    try {
      setRelatedLoading(true);
      setRelatedProducts([]);
      setRelatedTo(product.name);

      const response = await api.get(
        `/products/${product.id}/related`
      );

      setRelatedProducts(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load related products.");
    } finally {
      setRelatedLoading(false);
    }
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Books</h1>

      {message && <p>{message}</p>}

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div>
          {products.map((product) => (
            <div key={product.id}>
              <h2>{product.name}</h2>

              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  width="150"
                />
              )}

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
                onClick={() =>
                  handleAddToCart(product.id)
                }
                disabled={product.stockQuantity <= 0}
              >
                {product.stockQuantity > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>

              {" "}

              <button
                type="button"
                onClick={() =>
                  handleRelatedProducts(product)
                }
              >
                View Related Products
              </button>

              <hr />
            </div>
          ))}
        </div>
      )}

      {relatedTo && (
        <div>
          <h2>
            Related Products for {relatedTo}
          </h2>

          {relatedLoading ? (
            <p>Loading related products...</p>
          ) : relatedProducts.length === 0 ? (
            <p>No related products found.</p>
          ) : (
            relatedProducts.map((product) => (
              <div key={product.id}>
                <h3>{product.name}</h3>

                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    width="120"
                  />
                )}

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

                <button
                  type="button"
                  onClick={() =>
                    handleAddToCart(product.id)
                  }
                  disabled={product.stockQuantity <= 0}
                >
                  {product.stockQuantity > 0
                    ? "Add to Cart"
                    : "Out of Stock"}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Products;
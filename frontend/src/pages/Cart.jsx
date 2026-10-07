import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const loadCart = async () => {
    if (!userId) {
      setMessage("Please sign in to view your cart.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/cart/${userId}`);
      setCart(response.data);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Unable to load your cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [userId]);

  const updateQuantity = async (item, quantity) => {
    if (quantity < 1) {
      return;
    }

    try {
      setUpdatingId(item.id);

      await api.put(
        `/cart/${userId}/items/${item.id}`,
        { quantity }
      );

      await loadCart();
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to update quantity."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setUpdatingId(itemId);

      await api.delete(
        `/cart/${userId}/items/${itemId}`
      );

      await loadCart();

      setMessage("Item removed from your cart.");
    } catch (error) {
      console.error(error);
      setMessage("Unable to remove item.");
    } finally {
      setUpdatingId(null);
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) {
      return 0;
    }

    return cart.items.reduce(
      (total, item) =>
        total +
        Number(item.product.price) * item.quantity,
      0
    );
  };

  const proceedToCheckout = () => {
    if (!cart?.items?.length) {
      setMessage("Your cart is empty.");
      return;
    }

    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="catalogue-state">
        <div className="loading-spinner" />
        <h2>Loading your cart...</h2>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="empty-page-state">
        <span className="empty-page-icon">🛒</span>
        <h1>Your cart is waiting</h1>
        <p>Sign in to add and manage your books.</p>
        <Link className="button button-primary" to="/login">
          Sign In
        </Link>
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="commerce-page">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">
            Shopping Cart
          </span>
          <h1>Your Cart</h1>
          <p>
            Review your books before continuing to
            checkout.
          </p>
        </div>

        <div className="catalogue-count">
          <strong>{items.length}</strong>
          <span>{items.length === 1 ? "Item" : "Items"}</span>
        </div>
      </div>

      {message && (
        <div className="commerce-message">{message}</div>
      )}

      {items.length === 0 ? (
        <div className="empty-page-state">
          <span className="empty-page-icon">📚</span>
          <h2>Your cart is empty</h2>
          <p>
            Explore the catalogue and add something
            worth reading.
          </p>

          <Link
            className="button button-primary"
            to="/products"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-items">
            {items.map((item) => (
              <article
                className="cart-item"
                key={item.id}
              >
                <div className="mini-book-cover">
                  <span>BOOK</span>
                </div>

                <div className="cart-item-info">
                  <span className="item-category">
                    {item.product.category?.name ||
                      "Book"}
                  </span>

                  <h2>{item.product.name}</h2>

                  <p>
                    {item.product.description}
                  </p>

                  <strong className="cart-price">
                    ₹
                    {Number(
                      item.product.price
                    ).toFixed(2)}
                  </strong>
                </div>

                <div className="cart-item-controls">
                  <span className="quantity-label">
                    Quantity
                  </span>

                  <div className="quantity-control">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={
                        updatingId === item.id ||
                        item.quantity <= 1
                      }
                      onClick={() =>
                        updateQuantity(
                          item,
                          item.quantity - 1
                        )
                      }
                    >
                      −
                    </button>

                    <strong>{item.quantity}</strong>

                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={
                        updatingId === item.id
                      }
                      onClick={() =>
                        updateQuantity(
                          item,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <strong className="item-subtotal">
                    ₹
                    {(
                      Number(item.product.price) *
                      item.quantity
                    ).toFixed(2)}
                  </strong>

                  <button
                    type="button"
                    className="text-danger-button"
                    disabled={
                      updatingId === item.id
                    }
                    onClick={() =>
                      removeItem(item.id)
                    }
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </section>

          <aside className="order-summary-card">
            <span className="page-eyebrow">
              Order Summary
            </span>

            <h2>Summary</h2>

            <div className="summary-row">
              <span>Items</span>
              <strong>{items.length}</strong>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>
                ₹{calculateTotal().toFixed(2)}
              </strong>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <strong>Free</strong>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <strong>
                ₹{calculateTotal().toFixed(2)}
              </strong>
            </div>

            <button
              type="button"
              className="full-width-button"
              onClick={proceedToCheckout}
            >
              Proceed to Checkout
            </button>

            <Link
              className="continue-shopping"
              to="/products"
            >
              ← Continue Shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;
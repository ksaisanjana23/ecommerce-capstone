import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const [processingOrderId, setProcessingOrderId] =
    useState(null);

  const [cancellingOrderId, setCancellingOrderId] =
    useState(null);

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  /*
   * Spring Boot currently returns LocalDateTime values
   * without timezone information.
   *
   * Render stores/creates these timestamps in UTC.
   * Appending "Z" tells JavaScript to interpret the value
   * as UTC before converting it to the user's required
   * India Standard Time display.
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

  const formatOrderDate = (dateValue) => {
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

  const fetchOrders = async () => {
    if (!userId) {
      setMessage("Please sign in to view your orders.");
      setMessageType("warning");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(
        `/orders/${userId}`
      );

      setOrders(response.data);
    } catch (error) {
      console.error(error);

      setMessage("Unable to load order history.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const handleBuyAgain = async (orderId) => {
    try {
      setProcessingOrderId(orderId);
      setMessage("");

      await api.post(
        `/orders/${userId}/${orderId}/buy-again`
      );

      navigate("/cart");
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to add order items to cart."
      );

      setMessageType("error");
    } finally {
      setProcessingOrderId(null);
    }
  };

  const canCancelOrder = (order) => {
    if (order.status !== "CONFIRMED") {
      return false;
    }

    const orderDate = parseBackendDate(order.orderDate);

    if (!orderDate || Number.isNaN(orderDate.getTime())) {
      return false;
    }

    const orderTime = orderDate.getTime();
    const currentTime = Date.now();
    const fortyEightHours = 48 * 60 * 60 * 1000;

    return (
      currentTime >= orderTime &&
      currentTime - orderTime <= fortyEightHours
    );
  };

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel Order #${orderId}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingOrderId(orderId);
      setMessage("");

      await api.put(
        `/orders/${userId}/${orderId}/cancel`
      );

      setMessage(
        `Order #${orderId} cancelled successfully.`
      );

      setMessageType("success");

      await fetchOrders();
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to cancel order."
      );

      setMessageType("error");
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "status-confirmed";

      case "CANCELLED":
        return "status-cancelled";

      case "PENDING":
        return "status-pending";

      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="catalogue-state">
        <div className="loading-spinner" />
        <h2>Loading your orders...</h2>
        <p>Retrieving your order history.</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="empty-page-state">
        <span className="empty-page-icon">📦</span>

        <h1>Your orders</h1>

        <p>
          Sign in to view your order history.
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
      <div className="page-header">
        <div>
          <span className="page-eyebrow">
            Your Purchases
          </span>

          <h1>Order History</h1>

          <p>
            Review your purchases, buy your favourite
            books again, or manage eligible orders.
          </p>
        </div>

        <div className="catalogue-count">
          <strong>{orders.length}</strong>

          <span>
            {orders.length === 1
              ? "Order"
              : "Orders"}
          </span>
        </div>
      </div>

      {message && (
        <div
          className={`commerce-message ${messageType}`}
        >
          {message}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="empty-page-state">
          <span className="empty-page-icon">📚</span>

          <h2>No orders yet</h2>

          <p>
            Your completed purchases will appear here.
          </p>

          <Link
            className="button button-primary"
            to="/products"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article
              className="order-card"
              key={order.id}
            >
              <header className="order-card-header">
                <div>
                  <span className="order-label">
                    Order
                  </span>

                  <h2>#{order.id}</h2>
                </div>

                <div className="order-header-meta">
                  <span
                    className={`order-status ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                  <span className="order-date">
                    {formatOrderDate(order.orderDate)}
                  </span>
                </div>
              </header>

              <div className="order-card-content">
                <section className="order-items-section">
                  <h3>Items</h3>

                  <div className="order-items-list">
                    {order.items?.map((item) => (
                      <div
                        className="order-item-row"
                        key={item.id}
                      >
                        <div className="mini-book-cover small">
                          <span>BOOK</span>
                        </div>

                        <div className="order-item-copy">
                          <strong>
                            {item.product?.name || "Book"}
                          </strong>

                          <span>
                            ₹
                            {Number(
                              item.price
                            ).toFixed(2)}{" "}
                            × {item.quantity}
                          </span>
                        </div>

                        <strong className="order-item-price">
                          ₹
                          {(
                            Number(item.price) *
                            item.quantity
                          ).toFixed(2)}
                        </strong>
                      </div>
                    ))}
                  </div>
                </section>

                <aside className="order-delivery-section">
                  <h3>Delivery Address</h3>

                  {order.address ? (
                    <>
                      <strong>
                        {order.address.fullName}
                      </strong>

                      <p>
                        {order.address.addressLine1}
                        {order.address.addressLine2
                          ? `, ${order.address.addressLine2}`
                          : ""}
                      </p>

                      <p>
                        {order.address.city},{" "}
                        {order.address.state} -{" "}
                        {order.address.postalCode}
                      </p>

                      <p>
                        {order.address.country}
                      </p>
                    </>
                  ) : (
                    <p>
                      Address information unavailable.
                    </p>
                  )}
                </aside>
              </div>

              <footer className="order-card-footer">
                <div className="order-total">
                  <span>Order Total</span>

                  <strong>
                    ₹
                    {Number(
                      order.totalAmount
                    ).toFixed(2)}
                  </strong>
                </div>

                {order.status === "CONFIRMED" && (
                  <div className="order-actions">
                    <button
                      type="button"
                      className="secondary-action"
                      disabled={
                        processingOrderId === order.id
                      }
                      onClick={() =>
                        handleBuyAgain(order.id)
                      }
                    >
                      {processingOrderId === order.id
                        ? "Adding..."
                        : "Buy Again"}
                    </button>

                    {canCancelOrder(order) && (
                      <button
                        type="button"
                        className="danger-button"
                        disabled={
                          cancellingOrderId === order.id
                        }
                        onClick={() =>
                          handleCancelOrder(order.id)
                        }
                      >
                        {cancellingOrderId === order.id
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>
                    )}
                  </div>
                )}
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
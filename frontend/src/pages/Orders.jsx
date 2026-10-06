import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [processingOrderId, setProcessingOrderId] =
    useState(null);
  const [cancellingOrderId, setCancellingOrderId] =
    useState(null);

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    if (!userId) {
      setMessage("Please login to view your orders.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/orders/${userId}`);
      setOrders(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load order history.");
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
    } finally {
      setProcessingOrderId(null);
    }
  };

  const canCancelOrder = (order) => {
    if (order.status !== "CONFIRMED") {
      return false;
    }

    const orderTime = new Date(order.orderDate).getTime();
    const currentTime = Date.now();

    const fortyEightHours =
      48 * 60 * 60 * 1000;

    return currentTime - orderTime <= fortyEightHours;
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

      await fetchOrders();
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to cancel order."
      );
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div>
      <h1>Order History</h1>

      {message && <p>{message}</p>}

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id}>
            <h2>Order #{order.id}</h2>

            <p>
              <strong>Status:</strong>{" "}
              {order.status}
            </p>

            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(
                order.orderDate
              ).toLocaleString()}
            </p>

            <h3>Delivery Address</h3>

            <p>{order.address.fullName}</p>

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

            <h3>Items</h3>

            {order.items.map((item) => (
              <div key={item.id}>
                <p>
                  <strong>
                    {item.product.name}
                  </strong>
                </p>

                <p>
                  ₹{item.price} × {item.quantity}
                </p>

                <p>
                  Subtotal: ₹
                  {(
                    Number(item.price) *
                    item.quantity
                  ).toFixed(2)}
                </p>
              </div>
            ))}

            <h3>
              Total: ₹
              {Number(
                order.totalAmount
              ).toFixed(2)}
            </h3>

            {order.status === "CONFIRMED" && (
              <>
                <button
                  onClick={() =>
                    handleBuyAgain(order.id)
                  }
                  disabled={
                    processingOrderId === order.id
                  }
                >
                  {processingOrderId === order.id
                    ? "Adding..."
                    : "Buy Again"}
                </button>

                {" "}

                {canCancelOrder(order) && (
                  <button
                    onClick={() =>
                      handleCancelOrder(order.id)
                    }
                    disabled={
                      cancellingOrderId === order.id
                    }
                  >
                    {cancellingOrderId === order.id
                      ? "Cancelling..."
                      : "Cancel Order"}
                  </button>
                )}
              </>
            )}

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
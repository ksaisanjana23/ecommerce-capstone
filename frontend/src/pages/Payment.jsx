import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const orderId = localStorage.getItem("currentOrderId");

  const handlePayment = async () => {
    if (!userId || !orderId) {
      setMessage("Order information is missing.");
      return;
    }

    try {
      setProcessing(true);
      setMessage("");

      const response = await api.post(
        `/payments/${userId}/orders/${orderId}`,
        {
          paymentMethod,
        }
      );

      if (response.status !== 201) {
        throw new Error("Unexpected payment response.");
      }

      localStorage.setItem(
        "lastPayment",
        JSON.stringify(response.data)
      );

      localStorage.setItem("lastOrderId", orderId);

      localStorage.removeItem("currentOrderId");
      localStorage.removeItem("selectedAddressId");

      navigate("/payment-success");
    } catch (error) {
      console.error("Payment error:", error);

      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error;

      setMessage(
        backendMessage ||
          error.message ||
          "Unable to process payment."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <h1>Payment</h1>

      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}

      {!orderId ? (
        <p>No pending order found.</p>
      ) : (
        <>
          <p>
            <strong>Order:</strong> #{orderId}
          </p>

          <label htmlFor="paymentMethod">
            Payment Method:{" "}
          </label>

          <select
            id="paymentMethod"
            value={paymentMethod}
            disabled={processing}
            onChange={(event) =>
              setPaymentMethod(event.target.value)
            }
          >
            <option value="UPI">UPI</option>
            <option value="CARD">Card</option>
            <option value="NET_BANKING">
              Net Banking
            </option>
            <option value="COD">
              Cash on Delivery
            </option>
          </select>

          <br />
          <br />

          <button
            type="button"
            onClick={handlePayment}
            disabled={processing}
          >
            {processing
              ? "Processing Payment..."
              : "Pay Now"}
          </button>
        </>
      )}
    </div>
  );
}

export default Payment;
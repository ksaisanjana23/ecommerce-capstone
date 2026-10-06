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
          paymentMethod: paymentMethod,
        }
      );

      localStorage.setItem(
        "lastPayment",
        JSON.stringify(response.data)
      );

      localStorage.setItem(
        "lastOrderId",
        orderId
      );

      localStorage.removeItem("currentOrderId");
      localStorage.removeItem("selectedAddressId");

      navigate("/payment-success");
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to process payment."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <h1>Payment</h1>

      {message && <p>{message}</p>}

      {!orderId ? (
        <p>No pending order found.</p>
      ) : (
        <>
          <p>
            <strong>Order:</strong> #{orderId}
          </p>

          <label>
            Payment Method:
            {" "}
            <select
              value={paymentMethod}
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
          </label>

          <br />
          <br />

          <button
            onClick={handlePayment}
            disabled={processing}
          >
            {processing
              ? "Processing..."
              : "Pay Now"}
          </button>
        </>
      )}
    </div>
  );
}

export default Payment;
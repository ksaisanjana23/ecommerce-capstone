import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const paymentMethods = [
  {
    value: "UPI",
    title: "UPI",
    description:
      "Pay securely using your preferred UPI app.",
    icon: "₹",
  },
  {
    value: "CARD",
    title: "Credit / Debit Card",
    description:
      "Pay using a supported credit or debit card.",
    icon: "▣",
  },
  {
    value: "NET_BANKING",
    title: "Net Banking",
    description:
      "Complete payment through your bank.",
    icon: "🏦",
  },
  {
    value: "COD",
    title: "Cash on Delivery",
    description:
      "Pay when your order reaches you.",
    icon: "◎",
  },
];

function Payment() {
  const [paymentMethod, setPaymentMethod] =
    useState("UPI");

  const [processing, setProcessing] =
    useState(false);

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const orderId =
    localStorage.getItem("currentOrderId");

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
        throw new Error(
          "Unexpected payment response."
        );
      }

      localStorage.setItem(
        "lastPayment",
        JSON.stringify(response.data)
      );

      localStorage.setItem(
        "lastOrderId",
        orderId
      );

      localStorage.removeItem(
        "currentOrderId"
      );

      localStorage.removeItem(
        "selectedAddressId"
      );

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
    <div className="commerce-page payment-page">
      <div className="checkout-progress">
        <span className="completed">
          <b>1</b> Cart
        </span>

        <span className="completed">
          <b>2</b> Checkout
        </span>

        <span className="active">
          <b>3</b> Payment
        </span>
      </div>

      <div className="page-header">
        <div>
          <span className="page-eyebrow">
            Final Step
          </span>

          <h1>Choose Payment Method</h1>

          <p>
            Select how you'd like to complete your
            order.
          </p>
        </div>
      </div>

      {message && (
        <div className="commerce-message error">
          {message}
        </div>
      )}

      {!orderId ? (
        <div className="empty-page-state">
          <span className="empty-page-icon">
            🧾
          </span>

          <h2>No pending order found</h2>

          <p>
            Add books to your cart and complete
            checkout first.
          </p>

          <Link
            className="button button-primary"
            to="/products"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="payment-layout">
          <section className="payment-method-card">
            <div className="order-reference">
              <span>Order Reference</span>
              <strong>#{orderId}</strong>
            </div>

            <h2>Payment Method</h2>

            <div className="payment-methods">
              {paymentMethods.map((method) => {
                const selected =
                  paymentMethod === method.value;

                return (
                  <label
                    key={method.value}
                    className={`payment-option ${
                      selected ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={selected}
                      disabled={processing}
                      onChange={(event) =>
                        setPaymentMethod(
                          event.target.value
                        )
                      }
                    />

                    <span className="payment-icon">
                      {method.icon}
                    </span>

                    <span className="payment-copy">
                      <strong>
                        {method.title}
                      </strong>

                      <small>
                        {method.description}
                      </small>
                    </span>

                    <span className="payment-check">
                      {selected ? "✓" : ""}
                    </span>
                  </label>
                );
              })}
            </div>

            <button
              type="button"
              className="full-width-button payment-button"
              onClick={handlePayment}
              disabled={processing}
            >
              {processing
                ? "Processing Payment..."
                : paymentMethod === "COD"
                  ? "Place Order"
                  : "Pay Securely"}
            </button>

            <p className="secure-note">
              🔒 Secure transaction
            </p>
          </section>

          <aside className="payment-info-card">
            <span className="page-eyebrow">
              Secure Payment
            </span>

            <h3>Your checkout is protected</h3>

            <p>
              Your payment request is securely
              processed by the e-commerce backend.
            </p>

            <div className="payment-info-item">
              <strong>Order</strong>
              <span>#{orderId}</span>
            </div>

            <div className="payment-info-item">
              <strong>Selected Method</strong>
              <span>
                {
                  paymentMethods.find(
                    (method) =>
                      method.value ===
                      paymentMethod
                  )?.title
                }
              </span>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Payment;
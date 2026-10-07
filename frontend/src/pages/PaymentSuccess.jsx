import { Link } from "react-router-dom";

function PaymentSuccess() {
  const paymentData =
    localStorage.getItem("lastPayment");

  const orderId =
    localStorage.getItem("lastOrderId");

  let payment = null;

  try {
    payment = paymentData
      ? JSON.parse(paymentData)
      : null;
  } catch {
    payment = null;
  }

  if (!payment) {
    return (
      <div className="empty-page-state">
        <span className="empty-page-icon">
          🧾
        </span>

        <h1>Payment Confirmation</h1>

        <p>
          No recent payment information is
          available.
        </p>

        <Link
          className="button button-primary"
          to="/orders"
        >
          View Order History
        </Link>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✓</div>

        <span className="page-eyebrow">
          Order Confirmed
        </span>

        <h1>Payment Successful</h1>

        <p className="success-intro">
          Thank you. Your order has been confirmed
          successfully.
        </p>

        <div className="confirmation-number">
          <span>Order ID</span>
          <strong>#{orderId}</strong>
        </div>

        <div className="confirmation-details">
          <div>
            <span>Payment Status</span>
            <strong>
              {payment.status || "SUCCESS"}
            </strong>
          </div>

          <div>
            <span>Amount Paid</span>
            <strong>
              ₹
              {Number(
                payment.amount || 0
              ).toFixed(2)}
            </strong>
          </div>

          <div>
            <span>Payment Method</span>
            <strong>
              {payment.paymentMethod || "—"}
            </strong>
          </div>

          <div>
            <span>Payment Date</span>
            <strong>
              {payment.paymentDate
                ? new Date(
                    payment.paymentDate
                  ).toLocaleString()
                : "—"}
            </strong>
          </div>
        </div>

        <div className="success-note">
          <strong>What's next?</strong>

          <p>
            You can track this order from your order
            history and use Buy Again whenever you
            want to purchase the same books again.
          </p>
        </div>

        <div className="success-actions">
          <Link
            className="button button-primary"
            to="/orders"
          >
            View Order History
          </Link>

          <Link
            className="button button-secondary"
            to="/products"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
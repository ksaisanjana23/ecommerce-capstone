import { Link } from "react-router-dom";

function PaymentSuccess() {
  const paymentData = localStorage.getItem("lastPayment");
  const orderId = localStorage.getItem("lastOrderId");

  const payment = paymentData
    ? JSON.parse(paymentData)
    : null;

  if (!payment) {
    return (
      <div>
        <h1>Payment Confirmation</h1>
        <p>No payment information available.</p>

        <Link to="/orders">
          View Order History
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Payment Successful</h1>

      <p>Your order has been confirmed successfully.</p>

      <h2>Order Confirmation</h2>

      <p>
        <strong>Order ID:</strong> #{orderId}
      </p>

      <p>
        <strong>Payment Status:</strong>{" "}
        {payment.status}
      </p>

      <p>
        <strong>Amount Paid:</strong>{" "}
        ₹{Number(payment.amount).toFixed(2)}
      </p>

      <p>
        <strong>Payment Method:</strong>{" "}
        {payment.paymentMethod}
      </p>

      <p>
        <strong>Transaction ID:</strong>{" "}
        {payment.transactionId}
      </p>

      <p>
        <strong>Payment Date:</strong>{" "}
        {new Date(payment.paymentDate).toLocaleString()}
      </p>

      <br />

      <Link to="/orders">
        View Order History
      </Link>

      {" | "}

      <Link to="/products">
        Continue Shopping
      </Link>
    </div>
  );
}

export default PaymentSuccess;
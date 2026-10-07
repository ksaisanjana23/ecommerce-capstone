import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Checkout() {
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] =
    useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const loadCheckoutData = async () => {
      if (!userId) {
        setMessage(
          "Please sign in to continue checkout."
        );
        setLoading(false);
        return;
      }

      try {
        const [cartResponse, addressResponse] =
          await Promise.all([
            api.get(`/cart/${userId}`),
            api.get(`/addresses/${userId}`),
          ]);

        setCart(cartResponse.data);
        setAddresses(addressResponse.data);

        if (addressResponse.data.length > 0) {
          setSelectedAddressId(
            String(addressResponse.data[0].id)
          );
        }
      } catch (error) {
        console.error(error);

        setMessage(
          "Unable to load checkout information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [userId]);

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

  const handleContinue = async () => {
    if (!selectedAddressId) {
      setMessage(
        "Please select a delivery address."
      );
      return;
    }

    if (!cart?.items?.length) {
      setMessage("Your cart is empty.");
      return;
    }

    try {
      setProcessing(true);
      setMessage("");

      const response = await api.post(
        `/orders/${userId}`,
        {
          addressId: Number(selectedAddressId),
        }
      );

      localStorage.setItem(
        "currentOrderId",
        String(response.data.id)
      );

      localStorage.setItem(
        "selectedAddressId",
        selectedAddressId
      );

      navigate("/payment");
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to create order."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="catalogue-state">
        <div className="loading-spinner" />
        <h2>Preparing checkout...</h2>
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="commerce-page">
      <div className="checkout-progress">
        <span className="completed">
          <b>1</b> Cart
        </span>
        <span className="active">
          <b>2</b> Checkout
        </span>
        <span>
          <b>3</b> Payment
        </span>
      </div>

      <div className="page-header">
        <div>
          <span className="page-eyebrow">
            Secure Checkout
          </span>
          <h1>Checkout</h1>
          <p>
            Confirm your delivery details before
            payment.
          </p>
        </div>
      </div>

      {message && (
        <div className="commerce-message">
          {message}
        </div>
      )}

      <div className="checkout-layout">
        <section className="checkout-content">
          <div className="checkout-section-card">
            <div className="section-title-row">
              <div>
                <span className="section-number">
                  01
                </span>
                <h2>Delivery Address</h2>
              </div>
            </div>

            {addresses.length === 0 ? (
              <div className="inline-empty-state">
                <p>
                  No delivery addresses are available.
                </p>
              </div>
            ) : (
              <div className="address-grid">
                {addresses.map((address) => {
                  const selected =
                    selectedAddressId ===
                    String(address.id);

                  return (
                    <label
                      key={address.id}
                      className={`address-card ${
                        selected ? "selected" : ""
                      }`}
                    >
                      <div className="address-radio-row">
                        <input
                          type="radio"
                          name="deliveryAddress"
                          value={address.id}
                          checked={selected}
                          onChange={(event) =>
                            setSelectedAddressId(
                              event.target.value
                            )
                          }
                        />

                        <strong>
                          {address.fullName}
                        </strong>
                      </div>

                      <p>
                        {address.addressLine1}
                        {address.addressLine2
                          ? `, ${address.addressLine2}`
                          : ""}
                      </p>

                      <p>
                        {address.city},{" "}
                        {address.state} -{" "}
                        {address.postalCode}
                      </p>

                      <p>{address.country}</p>

                      <span>
                        Phone: {address.phone}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="checkout-section-card">
            <div className="section-title-row">
              <div>
                <span className="section-number">
                  02
                </span>
                <h2>Order Items</h2>
              </div>

              <Link to="/cart">Edit Cart</Link>
            </div>

            {items.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div className="checkout-items">
                {items.map((item) => (
                  <div
                    className="checkout-item"
                    key={item.id}
                  >
                    <div>
                      <strong>
                        {item.product.name}
                      </strong>

                      <span>
                        ₹
                        {Number(
                          item.product.price
                        ).toFixed(2)}{" "}
                        × {item.quantity}
                      </span>
                    </div>

                    <strong>
                      ₹
                      {(
                        Number(
                          item.product.price
                        ) * item.quantity
                      ).toFixed(2)}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="order-summary-card">
          <span className="page-eyebrow">
            Payment Summary
          </span>

          <h2>Your Order</h2>

          <div className="summary-row">
            <span>Products</span>
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
            disabled={
              processing ||
              !selectedAddressId ||
              items.length === 0
            }
            onClick={handleContinue}
          >
            {processing
              ? "Creating Order..."
              : "Continue to Payment"}
          </button>

          <p className="secure-note">
            Secure checkout • Your order details are
            protected
          </p>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Checkout() {
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const loadCheckoutData = async () => {
      if (!userId) {
        setMessage("Please sign in to continue checkout.");
        setLoading(false);
        return;
      }

      try {
        const [cartResponse, addressResponse] = await Promise.all([
          api.get(`/cart/${userId}`),
          api.get(`/addresses/${userId}`),
        ]);

        setCart(cartResponse.data);

        const loadedAddresses = Array.isArray(addressResponse.data)
          ? addressResponse.data
          : [];

        setAddresses(loadedAddresses);

        if (loadedAddresses.length > 0) {
          setSelectedAddressId(String(loadedAddresses[0].id));
        } else {
          setShowAddressForm(true);
        }
      } catch (error) {
        console.error(error);
        setMessage("Unable to load checkout information.");
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
        total + Number(item.product.price) * item.quantity,
      0
    );
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;

    setAddressForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSaveAddress = async (event) => {
    event.preventDefault();

    if (!userId) {
      setMessage("Please sign in before adding an address.");
      return;
    }

    const requiredFields = [
      "fullName",
      "phone",
      "addressLine1",
      "city",
      "state",
      "postalCode",
      "country",
    ];

    const hasMissingField = requiredFields.some(
      (field) => !addressForm[field].trim()
    );

    if (hasMissingField) {
      setMessage("Please complete all required address fields.");
      return;
    }

    if (!/^[0-9]{10}$/.test(addressForm.phone.trim())) {
      setMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!/^[0-9]{6}$/.test(addressForm.postalCode.trim())) {
      setMessage("Please enter a valid 6-digit PIN code.");
      return;
    }

    try {
      setSavingAddress(true);
      setMessage("");

      const response = await api.post(
        `/addresses/${userId}`,
        {
          fullName: addressForm.fullName.trim(),
          phone: addressForm.phone.trim(),
          addressLine1: addressForm.addressLine1.trim(),
          addressLine2: addressForm.addressLine2.trim(),
          city: addressForm.city.trim(),
          state: addressForm.state.trim(),
          postalCode: addressForm.postalCode.trim(),
          country: addressForm.country.trim(),
        }
      );

      const createdAddress = response.data;

      setAddresses((current) => [
        ...current,
        createdAddress,
      ]);

      setSelectedAddressId(String(createdAddress.id));
      setShowAddressForm(false);

      setAddressForm({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
      });

      setMessage(
        "Delivery address saved successfully."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to save delivery address."
      );
    } finally {
      setSavingAddress(false);
    }
  };

  const handleContinue = async () => {
    if (!selectedAddressId) {
      setMessage("Please select a delivery address.");
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
            Confirm your delivery details before payment.
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

              {addresses.length > 0 && (
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() =>
                    setShowAddressForm((current) => !current)
                  }
                >
                  {showAddressForm
                    ? "Cancel"
                    : "Add New Address"}
                </button>
              )}
            </div>

            {addresses.length > 0 && (
              <div className="address-grid">
                {addresses.map((address) => {
                  const selected =
                    selectedAddressId === String(address.id);

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
                        {address.city}, {address.state} -{" "}
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

            {showAddressForm && (
              <form
                onSubmit={handleSaveAddress}
                style={{
                  marginTop: "24px",
                  display: "grid",
                  gap: "16px",
                }}
              >
                <div>
                  <label htmlFor="fullName">
                    Full Name *
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={addressForm.fullName}
                    onChange={handleAddressChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone">
                    Phone Number *
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={addressForm.phone}
                    onChange={handleAddressChange}
                    placeholder="10-digit phone number"
                    maxLength="10"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="addressLine1">
                    Address Line 1 *
                  </label>

                  <input
                    id="addressLine1"
                    name="addressLine1"
                    type="text"
                    value={addressForm.addressLine1}
                    onChange={handleAddressChange}
                    placeholder="House number, street, area"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="addressLine2">
                    Address Line 2
                  </label>

                  <input
                    id="addressLine2"
                    name="addressLine2"
                    type="text"
                    value={addressForm.addressLine2}
                    onChange={handleAddressChange}
                    placeholder="Landmark, apartment, etc."
                  />
                </div>

                <div>
                  <label htmlFor="city">
                    City *
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                    placeholder="City"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="state">
                    State *
                  </label>

                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={addressForm.state}
                    onChange={handleAddressChange}
                    placeholder="State"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="postalCode">
                    PIN Code *
                  </label>

                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    value={addressForm.postalCode}
                    onChange={handleAddressChange}
                    placeholder="6-digit PIN code"
                    maxLength="6"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="country">
                    Country *
                  </label>

                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={addressForm.country}
                    onChange={handleAddressChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="button button-primary"
                  disabled={savingAddress}
                >
                  {savingAddress
                    ? "Saving Address..."
                    : "Save Delivery Address"}
                </button>
              </form>
            )}

            {addresses.length === 0 &&
              !showAddressForm && (
                <div className="inline-empty-state">
                  <p>
                    No delivery addresses are available.
                  </p>
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

              <Link to="/cart">
                Edit Cart
              </Link>
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
                        Number(item.product.price) *
                        item.quantity
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
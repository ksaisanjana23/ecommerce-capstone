import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Checkout() {
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const loadCheckoutData = async () => {
      if (!userId) {
        setMessage("Please login to continue checkout.");
        setLoading(false);
        return;
      }

      try {
        const [cartResponse, addressResponse] = await Promise.all([
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
        setMessage("Unable to load checkout information.");
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [userId]);

  const calculateTotal = () => {
    if (!cart?.items) return 0;

    return cart.items.reduce((total, item) => {
      return (
        total +
        Number(item.product.price) * item.quantity
      );
    }, 0);
  };

  const handleContinue = async () => {
    if (!selectedAddressId) {
      setMessage("Please select a delivery address.");
      return;
    }

    if (!cart?.items || cart.items.length === 0) {
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
    return <p>Loading checkout...</p>;
  }

  return (
    <div>
      <h1>Checkout</h1>

      {message && <p>{message}</p>}

      <h2>Delivery Address</h2>

      {addresses.length === 0 ? (
        <p>No delivery addresses available.</p>
      ) : (
        addresses.map((address) => (
          <div key={address.id}>
            <label>
              <input
                type="radio"
                name="deliveryAddress"
                value={address.id}
                checked={
                  selectedAddressId === String(address.id)
                }
                onChange={(event) =>
                  setSelectedAddressId(event.target.value)
                }
              />

              {" "}

              <strong>{address.fullName}</strong>
            </label>

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
            <p>Phone: {address.phone}</p>

            <hr />
          </div>
        ))
      )}

      <h2>Order Summary</h2>

      {!cart?.items || cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.items.map((item) => (
            <div key={item.id}>
              <p>
                <strong>{item.product.name}</strong>
              </p>

              <p>
                ₹{item.product.price} × {item.quantity}
              </p>

              <p>
                Subtotal: ₹
                {(
                  Number(item.product.price) *
                  item.quantity
                ).toFixed(2)}
              </p>
            </div>
          ))}

          <hr />

          <h2>
            Total: ₹{calculateTotal().toFixed(2)}
          </h2>

          <button
            onClick={handleContinue}
            disabled={processing}
          >
            {processing
              ? "Creating Order..."
              : "Continue to Payment"}
          </button>
        </>
      )}
    </div>
  );
}

export default Checkout;
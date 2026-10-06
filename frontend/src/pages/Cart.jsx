import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const fetchCart = async () => {
    if (!userId) {
      setMessage("Please login to view your cart.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/cart/${userId}`);
      setCart(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }

    try {
      const response = await api.put(
        `/cart/${userId}/items/${itemId}`,
        {
          quantity: newQuantity,
        }
      );

      setCart(response.data);
      setMessage("Cart updated successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Unable to update quantity.");
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await api.delete(
        `/cart/${userId}/items/${itemId}`
      );

      setCart(response.data);
      setMessage("Item removed from cart.");
    } catch (error) {
      console.error(error);
      setMessage("Unable to remove item.");
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) {
      return 0;
    }

    return cart.items.reduce((total, item) => {
      return (
        total +
        Number(item.product.price) * item.quantity
      );
    }, 0);
  };

  const proceedToCheckout = () => {
    if (!cart?.items || cart.items.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    navigate("/checkout");
  };

  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (!userId) {
    return (
      <div>
        <h1>Your Cart</h1>
        <p>Please login to view your cart.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Your Cart</h1>

      {message && <p>{message}</p>}

      {!cart?.items || cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.items.map((item) => (
            <div key={item.id}>
              <h2>{item.product.name}</h2>

              {item.product.imageUrl && (
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  width="150"
                />
              )}

              <p>{item.product.description}</p>

              <p>
                <strong>Price:</strong> ₹{item.product.price}
              </p>

              <p>
                <strong>Quantity:</strong> {item.quantity}
              </p>

              <button
                onClick={() =>
                  updateQuantity(item.id, item.quantity - 1)
                }
                disabled={item.quantity <= 1}
              >
                -
              </button>

              {" "}

              <button
                onClick={() =>
                  updateQuantity(item.id, item.quantity + 1)
                }
              >
                +
              </button>

              {" "}

              <button onClick={() => removeItem(item.id)}>
                Remove
              </button>

              <p>
                <strong>Subtotal:</strong>{" "}
                ₹
                {(
                  Number(item.product.price) *
                  item.quantity
                ).toFixed(2)}
              </p>

              <hr />
            </div>
          ))}

          <h2>
            Total: ₹{calculateTotal().toFixed(2)}
          </h2>

          <button onClick={proceedToCheckout}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
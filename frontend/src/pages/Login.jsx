import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    if (message) {
      setMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "userId",
        response.data.id
      );

      localStorage.setItem(
        "userName",
        response.data.name
      );

      localStorage.setItem(
        "userEmail",
        response.data.email
      );

      window.dispatchEvent(
        new Event("auth-changed")
      );

      navigate("/products");
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-panel auth-intro">
        <Link className="auth-brand" to="/">
          <span className="brand-mark">B</span>

          <div>
            <strong>BookStore</strong>
            <span>Read. Discover. Repeat.</span>
          </div>
        </Link>

        <div className="auth-intro-content">
          <span className="page-eyebrow">
            Welcome Back
          </span>

          <h1>
            Your next great read is waiting.
          </h1>

          <p>
            Sign in to continue shopping, manage
            your orders and discover personalized
            book recommendations.
          </p>

          <div className="auth-benefits">
            <div>
              <span>✓</span>
              Personalized recommendations
            </div>

            <div>
              <span>✓</span>
              Easy order management
            </div>

            <div>
              <span>✓</span>
              Gift Points on purchases
            </div>
          </div>
        </div>

        <div className="auth-quote">
          <span>BOOKSTORE</span>

          <p>
            Discover stories. Build your library.
          </p>
        </div>
      </section>

      <section className="auth-panel auth-form-panel">
        <div className="auth-form-wrapper">
          <span className="page-eyebrow">
            Account Access
          </span>

          <h2>Sign in</h2>

          <p className="auth-subtitle">
            Enter your account details to continue.
          </p>

          {message && (
            <div className="commerce-message error">
              {message}
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <div className="form-field">
              <label htmlFor="login-email">
                Email Address
              </label>

              <input
                id="login-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="login-password">
                Password
              </label>

              <input
                id="login-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="full-width-button auth-submit"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>
          </form>

          <div className="auth-switch">
            <span>New to BookStore?</span>

            <Link to="/register">
              Create an account
            </Link>
          </div>

          <Link
            className="auth-home-link"
            to="/"
          >
            ← Back to BookStore
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Login;
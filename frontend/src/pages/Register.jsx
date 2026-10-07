import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    if (message) {
      setMessage("");
      setSuccess(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setSuccess(false);

      await api.post(
        "/auth/register",
        formData
      );

      setSuccess(true);

      setMessage(
        "Account created successfully. Redirecting you to sign in..."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error(error);

      setSuccess(false);

      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Registration failed. Please try again."
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
            Join BookStore
          </span>

          <h1>
            Start building your reading journey.
          </h1>

          <p>
            Create an account to shop books, manage
            orders, receive recommendations and
            collect rewards.
          </p>

          <div className="auth-benefits">
            <div>
              <span>✓</span>
              Browse the complete catalogue
            </div>

            <div>
              <span>✓</span>
              Personalized recommendations
            </div>

            <div>
              <span>✓</span>
              Earn Gift Points as you shop
            </div>
          </div>
        </div>

        <div className="auth-quote">
          <span>BOOKSTORE</span>
          <p>
            Every library begins with one book.
          </p>
        </div>
      </section>

      <section className="auth-panel auth-form-panel">
        <div className="auth-form-wrapper">
          <span className="page-eyebrow">
            Create Account
          </span>

          <h2>Join BookStore</h2>

          <p className="auth-subtitle">
            Create your account in just a few
            seconds.
          </p>

          {message && (
            <div
              className={`commerce-message ${
                success ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <div className="form-field">
              <label htmlFor="register-name">
                Full Name
              </label>

              <input
                id="register-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                autoComplete="name"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="register-email">
                Email Address
              </label>

              <input
                id="register-email"
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
              <label htmlFor="register-password">
                Password
              </label>

              <input
                id="register-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a secure password"
                autoComplete="new-password"
                minLength="6"
                required
              />

              <small className="field-hint">
                Use at least 6 characters.
              </small>
            </div>

            <button
              type="submit"
              className="full-width-button auth-submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <div className="auth-switch">
            <span>Already have an account?</span>

            <Link to="/login">
              Sign in
            </Link>
          </div>

          <Link
            className="auth-home-link"
            to="/"
          >
            ← Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Register;
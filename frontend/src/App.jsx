import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Link,
} from "react-router-dom";

import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import GiftPoints from "./pages/GiftPoints";
import Recommendations from "./pages/Recommendations";

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">
            Your next great read is here
          </span>

          <h1>
            Discover books you'll
            <span> love to read.</span>
          </h1>

          <p>
            Browse our collection, discover personalized
            recommendations, and enjoy a simple and secure
            shopping experience.
          </p>

          <div className="hero-actions">
            <Link
              to="/products"
              className="button button-primary"
            >
              Browse Books
            </Link>

            <Link
              to="/recommendations"
              className="button button-secondary"
            >
              View Recommendations
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-book-card">
            <span className="book-icon">📚</span>
            <h3>Explore. Read. Repeat.</h3>
            <p>
              Technology, programming, cloud and more.
            </p>
          </div>
        </div>
      </section>

      <section className="feature-section">
        <div className="section-heading">
          <span>Why BookStore?</span>
          <h2>Everything you need for your next book</h2>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon">📖</div>
            <h3>Curated Catalogue</h3>
            <p>
              Browse books by category and publisher and
              quickly discover titles that interest you.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>Recommendations</h3>
            <p>
              Discover personalized books based on your
              previous order history.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">🎁</div>
            <h3>Gift Points</h3>
            <p>
              Earn reward points when you purchase books
              and keep track of your balance.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}

function Navigation() {
  return (
    <header className="site-header">
      <div className="navbar">
        <Link to="/" className="brand">
          <span className="brand-mark">B</span>

          <div>
            <span className="brand-name">BookStore</span>
            <span className="brand-tagline">
              Read. Discover. Grow.
            </span>
          </div>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">
            Home
          </NavLink>

          <NavLink to="/products">
            Books
          </NavLink>

          <NavLink to="/recommendations">
            For You
          </NavLink>

          <NavLink to="/orders">
            Orders
          </NavLink>

          <NavLink to="/gift-points">
            Rewards
          </NavLink>
        </nav>

        <div className="nav-actions">
          <NavLink
            to="/cart"
            className="cart-link"
          >
            Cart
          </NavLink>

          <NavLink
            to="/login"
            className="login-link"
          >
            Login
          </NavLink>

          <NavLink
            to="/register"
            className="signup-link"
          >
            Sign Up
          </NavLink>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navigation />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/recommendations"
            element={<Recommendations />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/payment"
            element={<Payment />}
          />

          <Route
            path="/payment-success"
            element={<PaymentSuccess />}
          />

          <Route
            path="/orders"
            element={<Orders />}
          />

          <Route
            path="/gift-points"
            element={<GiftPoints />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />
        </Routes>
      </main>

      <footer className="site-footer">
        <div>
          <strong>BookStore</strong>
          <p>
            Cloud Fullstack E-Commerce Capstone
          </p>
        </div>

        <p>
          Built with React, Spring Boot and PostgreSQL
        </p>
      </footer>
    </BrowserRouter>
  );
}

export default App;
# 📚 BookStore — Full-Stack E-Commerce Application

A full-stack e-commerce bookstore developed as a Cloud Fullstack Developer Capstone Project.

The application provides a complete online bookstore experience including authentication, product discovery, shopping cart management, checkout, payments, order management, personalized recommendations, gift points, and order cancellation.

---

## 👩‍💻 Project Information

**Project:** Cloud Fullstack Developer Capstone  
**Application:** BookStore E-Commerce Platform  
**Developer:** Sanjana  
**Architecture:** React → REST API → Spring Boot → PostgreSQL

---

## ✨ Features

### Authentication & Security

- User registration and login
- JWT-based authentication
- Spring Security integration
- BCrypt password hashing
- Protected REST endpoints
- User-level authorization
- CORS configuration
- Centralized exception handling

### Product Catalogue

- Browse books
- Search books
- Filter by category
- Filter by publisher/brand
- Product pricing and stock availability
- Related book suggestions
- Responsive product cards
- Graceful fallback for unavailable product images

### Shopping Cart

- Add books to cart
- Update quantities
- Remove items
- Automatic total calculation
- Persistent user-specific cart
- Stock-aware checkout

### Checkout & Address Management

- Saved delivery addresses
- Address selection during checkout
- Order summary
- Server-side stock validation
- Transactional checkout workflow

### Payments

Supported payment methods:

- UPI
- Card
- Net Banking
- Cash on Delivery

Payment processing confirms the order, updates inventory, removes purchased cart items, and awards gift points.

### Order Management

- Order history
- Detailed order information
- Buy Again functionality
- Order status tracking
- Cancellation within 48 hours
- Automatic stock restoration after cancellation
- Payment refund status handling
- Gift-point reversal after cancellation

### Recommendations

Personalized recommendations are generated using categories from the user's confirmed purchase history.

### Gift Points

Customers earn:

**1 gift point for every ₹100 spent on successful purchases.**

Points are awarded after successful payment and reversed when an eligible order is cancelled.

---

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- JavaScript
- React Router
- Axios
- HTML5
- CSS3

### Backend

- Java 21
- Spring Boot
- Spring MVC
- Spring Data JPA
- Spring Security
- JWT Authentication
- Maven
- Bean Validation

### Database

- PostgreSQL

### API Documentation

- OpenAPI
- Swagger UI

### Development & Version Control

- Visual Studio Code
- Git
- GitHub

---

## 🏗️ Application Architecture

```text
┌──────────────────────────────┐
│        React Frontend        │
│      Vite + React Router     │
└──────────────┬───────────────┘
               │
               │ HTTP / JSON
               ▼
┌──────────────────────────────┐
│      Spring Boot REST API    │
│                              │
│ Controllers                  │
│ Services                     │
│ Security / JWT               │
│ Repositories                 │
└──────────────┬───────────────┘
               │
               │ Spring Data JPA
               ▼
┌──────────────────────────────┐
│          PostgreSQL          │
│           Database           │
└──────────────────────────────┘
```

---

## 📁 Project Structure

```text
ecommerce-capstone/
│
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/ecommerce/backend/
│           │   ├── config/
│           │   ├── controller/
│           │   ├── entity/
│           │   ├── exception/
│           │   ├── repository/
│           │   └── service/
│           │
│           └── resources/
│               └── application.properties
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── assets/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
│
├── .gitignore
└── README.md
```

---

## 🗃️ Core Domain Model

The backend contains entities representing the main e-commerce workflow:

- User
- Category
- Brand
- Product
- Address
- Cart
- CartItem
- Order
- OrderItem
- Payment
- GiftPoint

---

## 🔌 REST API Overview

Major API groups include:

```text
/api/auth
/api/products
/api/categories
/api/brands
/api/cart
/api/addresses
/api/orders
/api/payments
/api/recommendations
/api/gift-points
```

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Products

```text
GET    /api/products
GET    /api/products/{id}
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
```

### Cart

```text
GET    /api/cart/{userId}
POST   /api/cart/{userId}/items
PUT    /api/cart/{userId}/items/{itemId}
DELETE /api/cart/{userId}/items/{itemId}
```

The application also provides REST endpoints for addresses, orders, payments, recommendations, gift points, related products, Buy Again, and order cancellation.

---

## 🔐 Security

The application uses JWT authentication with Spring Security.

After successful login, the backend generates a JWT. The React application stores the authentication information and Axios automatically includes the token in authenticated API requests.

Protected endpoints validate both authentication and user ownership to prevent one authenticated user from accessing another user's protected resources.

Passwords are stored using BCrypt hashing.

Sensitive configuration such as database passwords and JWT secrets is supplied through environment variables rather than committed to Git.

---

## 💳 Transactional Checkout Workflow

The checkout implementation avoids modifying inventory before payment succeeds.

```text
Cart
  ↓
Create PENDING Order
  ↓
Select Payment Method
  ↓
Validate Order + Inventory
  ↓
Process Payment
  ↓
Reduce Stock
  ↓
Confirm Order
  ↓
Remove Purchased Cart Items
  ↓
Award Gift Points
```

Transactional database handling helps prevent partial checkout updates from being persisted if payment processing fails.

---

## ❌ Order Cancellation Workflow

Confirmed orders can be cancelled within the supported 48-hour cancellation period.

```text
Confirmed Order
      ↓
Cancellation
      ↓
Restore Product Stock
      ↓
Update Payment to REFUNDED
      ↓
Reverse Earned Gift Points
      ↓
Mark Order CANCELLED
```

---

## 📖 Recommendation Logic

Recommendations use the customer's confirmed purchase history.

The application:

1. Reads products from confirmed orders.
2. Determines previously purchased categories.
3. Searches for available products from those categories.
4. Excludes products already purchased.
5. Returns relevant in-stock recommendations.

---

## 🚀 Running the Project Locally

### Prerequisites

Install:

- Java 21
- Maven
- PostgreSQL
- Node.js
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/ksaisanjana23/ecommerce-capstone.git
cd ecommerce-capstone
```

### 2. Create the PostgreSQL Database

Create a database named:

```text
ecommerce_db
```

Example:

```sql
CREATE DATABASE ecommerce_db;
```

### 3. Configure Backend Environment Variables

The backend requires database credentials and a JWT secret.

PowerShell example:

```powershell
$env:DB_PASSWORD="your-postgresql-password"
$env:JWT_SECRET="your-secure-jwt-secret"
```

Never commit real passwords or JWT secrets to the repository.

### 4. Run the Backend

```bash
cd backend
mvn spring-boot:run
```

By default, the backend runs at:

```text
http://localhost:8080
```

### 5. Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

---

## 📘 API Documentation

While the backend is running locally, Swagger UI is available at:

```text
http://localhost:8080/swagger-ui.html
```

The OpenAPI specification is available at:

```text
http://localhost:8080/v3/api-docs
```

Swagger can be used to explore and test the REST APIs.

---

## 🧪 Testing

The application workflow has been tested for:

- Registration
- Login and JWT authentication
- Public product catalogue
- Product filtering
- Related products
- Cart operations
- Address management
- Checkout
- Pending order creation
- Payment processing
- Successful order confirmation
- Inventory reduction
- Order history
- Buy Again
- Personalized recommendations
- Gift-point calculation
- 48-hour cancellation
- Inventory restoration
- Payment refund state
- Gift-point reversal
- Authorization failures
- Validation errors
- Missing-resource handling

The React frontend has also been verified using a production Vite build.

---

## 🌐 Deployment

The application is designed for the following cloud deployment architecture:

```text
React Frontend
      ↓
Cloud-hosted Spring Boot REST API
      ↓
Cloud PostgreSQL Database
```

Live application and API URLs will be added after cloud deployment.

---

## 📸 Application Screenshots

Final project screenshots can include:

- Home Page
- Product Catalogue
- Login / Registration
- Shopping Cart
- Checkout
- Payment
- Payment Confirmation
- Order History
- Recommendations
- Gift Points
- Swagger API Documentation

---

## 🔄 Git & GitHub Workflow

Development follows a feature-branch workflow:

```text
main
  ↑
feature/product-catalog
```

The application was developed on a feature branch and integrated into `main` through a GitHub Pull Request.

---

## 🔮 Future Enhancements

Potential production enhancements include:

- Real payment gateway integration
- Email notifications
- Password reset
- Product reviews and ratings
- Admin dashboard
- Inventory administration
- Cloud object storage for book images
- Advanced recommendation algorithms
- Database-level inventory locking for high-concurrency purchasing
- Automated CI/CD pipeline
- Automated integration and end-to-end testing

---

## 👩‍💻 Developer

**Sanjana**

Cloud Fullstack Developer Capstone Project

---

## 📄 License

This project was developed for educational and demonstration purposes.
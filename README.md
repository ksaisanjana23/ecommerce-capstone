# BookStore — Full-Stack E-Commerce Application

A cloud-deployed full-stack bookstore application developed as part of a Cloud Fullstack Developer Capstone Project.

## Project Information

- **Project:** Cloud Fullstack Developer Capstone
- **Application:** BookStore E-Commerce Platform
- **Developer:** Sanjana
- **Architecture:** React → REST API → Spring Boot → PostgreSQL
- **Deployment:** Render

## Live Application

| Resource | URL |
|---|---|
| Frontend | https://ecommerce-capstone-frontend.onrender.com |
| Backend Products API | https://ecommerce-capstone-em12.onrender.com/api/products |
| Swagger UI | https://ecommerce-capstone-em12.onrender.com/swagger-ui.html |
| GitHub | https://github.com/ksaisanjana23/ecommerce-capstone |

**Note:** Free-tier hosting may cause a delay on the first request after inactivity.

## Features

### Authentication and Security
- User registration and login
- JWT authentication and Spring Security
- BCrypt password hashing
- Protected APIs and user-level authorization
- Centralized exception handling

### Book Catalogue
- Browse and search books
- Filter by category and publisher
- View prices and stock availability
- Related product suggestions
- Responsive product cards

### Shopping Cart and Checkout
- Add, update, and remove cart items
- Persistent user-specific cart
- Delivery address management
- Server-side stock validation
- Transactional order processing

### Payment Workflow
- UPI, Card, Net Banking, and Cash on Delivery options
- Simulated payment processing for educational demonstration
- Order confirmation and inventory updates
- Gift-point awards

**Payment disclosure:** No real payment gateway is integrated. Online payment selections simulate successful transactions without charging a bank account or card. Cash on Delivery represents payment due upon delivery. The current confirmation screen may use generic payment-success wording for COD; this does not mean cash was collected.

### Order Management
- Order history and order details
- Buy Again
- Cancellation within 48 hours
- Stock restoration after cancellation
- Simulated refund status
- Gift-point reversal

### Recommendations and Rewards
- Personalized recommendations based on confirmed purchases
- Related book suggestions
- 1 gift point per ₹100 of eligible purchases
- Gift-point balance display

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, React Router, Axios, HTML5, CSS3 |
| Backend | Java 21, Spring Boot, Spring MVC, Spring Data JPA, Spring Security, JWT |
| Database | PostgreSQL |
| API Documentation | OpenAPI, Swagger UI |
| Build Tools | Maven, npm |
| Development | VS Code, Git, GitHub |
| Deployment | Render, Docker |

## Architecture

```text
+-------------------------------+
|       React + Vite            |
|   Frontend / React Router     |
+---------------+---------------+
                |
                | HTTPS / JSON
                v
+-------------------------------+
|      Spring Boot REST API     |
| Controllers, Services, JWT    |
| Validation, Business Logic    |
| Spring Data JPA Repositories  |
+---------------+---------------+
                |
                | JDBC / JPA
                v
+-------------------------------+
|         PostgreSQL            |
| Products, Users, Cart, Orders |
| Payments, Addresses, Rewards  |
+-------------------------------+
```

## Project Structure

```text
ecommerce-capstone/
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/ecommerce/backend/
│       └── resources/application.properties
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
├── .gitignore
└── README.md
```

## Core Domain Model

User, Category, Brand, Product, Address, Cart, CartItem, Order, OrderItem, Payment, and GiftPoint.

## REST API Overview

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

Example endpoints:

```http
POST   /api/auth/register
POST   /api/auth/login
GET    /api/products
GET    /api/products/{id}
GET    /api/categories
GET    /api/brands
```

Protected APIs support cart management, addresses, checkout, payment simulation, orders, cancellation, Buy Again, recommendations, and gift points.

See Swagger UI for the complete API documentation.

## Local Development

### Prerequisites

Java 21, Maven, Node.js, npm, PostgreSQL, and Git.

### Backend Setup

Create a PostgreSQL database named `ecommerce_db`.

Configure these environment variables:

```text
DATABASE_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
```

Start the backend:

```powershell
cd backend
mvn spring-boot:run
```

Default backend: http://localhost:8080

### Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

Default frontend: http://localhost:5173

For a different API server, configure `VITE_API_BASE_URL` with the API base URL ending in `/api`.

### Build Verification

Backend:

```powershell
cd backend
mvn clean package
```

Frontend:

```powershell
cd frontend
npm run build
```

## Cloud Deployment

The application is hosted on Render:

- **Frontend:** React/Vite static site
- **Backend:** Docker-based Spring Boot web service
- **Database:** Managed PostgreSQL
- **Configuration:** Environment variables for database access, JWT signing, frontend origin, and API URL

Credentials and secrets must never be committed to GitHub.

## Testing and Demonstration

The application demonstrates:

1. Registration and login
2. Book browsing and filtering
3. Shopping cart management
4. Delivery address selection
5. Order placement and simulated payment
6. Order history and Buy Again
7. Order cancellation
8. Gift points and recommendations
9. REST API documentation through Swagger UI

## Screenshots

Screenshots of the deployed application can be added under a `screenshots/` folder.

Suggested screenshots:
- Home
- Book Catalogue
- Cart
- Checkout
- Order Confirmation
- Order History
- Recommendations
- Gift Points
- Swagger UI

## Walkthrough Video

A silent screen-recorded walkthrough of the application and supporting backend code has been prepared.

**Video:** Available upon request. A shareable link may be added after uploading.

## Future Enhancements

- Real payment gateway integration
- Automatic expired-session handling
- Improved Cash on Delivery payment-state management
- Enhanced recommendations
- Expanded automated testing and CI/CD

## Developer

**Sanjana**

Cloud Fullstack Developer Capstone Project

## License

Developed for educational and demonstration purposes.


## Project Demonstration Video

[Watch the E-commerce Project Demo](./ecommerce-demo-compressed.mp4)

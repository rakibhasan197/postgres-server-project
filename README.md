# ShopSphere E-Commerce Backend API

A production-ready, modular REST API server built using Node.js, Express, TypeScript, PostgreSQL, and Prisma ORM. It implements robust JWT authentication, role-based access control (RBAC), E-Commerce catalog functionality, reviews management, soft delete capabilities, and Next.js frontend client compatibility endpoints.

---

## 🛠️ Technology Stack
- **Core**: Node.js, TypeScript, Express
- **ORM & Database**: Prisma Client, PostgreSQL
- **Security**: JWT (jsonwebtoken), Bcrypt (password hashing)
- **Validation**: Zod (environment variables, request inputs)
- **Development Tools**: ts-node-dev, Prisma Studio, ESLint

---

## 📁 Project Structure
The codebase follows a clean, feature-driven modular structure:
```
src/
├── config/             # Strongly typed configurations (Zod env loader)
├── lib/                # Shared helper libraries (prisma client, jwt, catchAsync, apiResponse)
├── middlewares/        # Express middlewares (auth guard, validate schema, global error handler)
├── modules/            # Feature-based domain modules
│   ├── auth/           # Login, registration, token issuance
│   ├── user/           # User profiles management
│   ├── category/       # Store categories CRUD
│   ├── product/        # Store catalog products CRUD (with soft delete)
│   └── review/         # Product rating & customer reviews CRUD
├── routes/             # Unified Express router
├── app.ts              # Express application bootstrap & route mounting
└── server.ts           # HTTP server initialization
```

---

## 💾 Database Schema & Mapping
The models are defined in [schema.prisma](prisma/schema.prisma) and mapped directly to existing PostgreSQL tables to prevent table recreation:

- **User** (`User` table): Represents accounts. Role can be `ADMIN` or `USER`. Supports `isDeleted` soft delete.
- **Category** (`Category` table): Organizes products. Supports `isDeleted` soft delete.
- **Product** (`Product` table): Store catalog products. Supports `isDeleted` soft delete and `status` (`ACTIVE`, `DRAFT`, `OUT_OF_STOCK`).
- **Review** (`Review` table): Customer ratings (1-5) and feedback on specific products.

---

## 🚀 Getting Started

### 1. Configure Environment
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:<password>@localhost:5432/prisma_db"
JWT_SECRET="your-super-secure-key"
PORT=5000
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Sync Database & Generate Client
```bash
npx prisma db push
```

### 4. Run Seeding Script
Populates the database with default Categories, Users, Products, and Reviews:
```bash
npx prisma db seed
```

### 5. Run Server in Development Mode
```bash
npm run dev
```

---

## 🔌 API Endpoints Documentation

### 🔒 Authentication (`/api/v1/auth`)
- `POST /auth/register` - Registers a new user.
- `POST /auth/login` - Authenticates credentials and returns a JWT token.

### 👤 Users (`/api/v1/users`)
- `GET /users` - Get all users (Admin only, non-deleted).
- `GET /users/:id` - Get user profile details by ID.
- `PUT /users/:id` - Update user details (Requester must be the user themselves or an Admin).
- `DELETE /users/:id` - Soft deletes a user.

### 📦 Categories (`/api/v1/categories`)
- `POST /categories` - Create a new category (Admin only).
- `GET /categories` - Fetch all active categories.
- `GET /categories/:id` - Fetch single category with its products.
- `PUT /categories/:id` - Update category information (Admin only).
- `DELETE /categories/:id` - Soft deletes a category.

### 🛒 Products (`/api/v1/products`)
- `POST /products` - List a new product (Authenticated Vendor/Admin).
- `GET /products` - Get all products (supports price filters, search terms, and category IDs).
- `GET /products/:id` - Get product details, including user reviews.
- `PUT /products/:id` - Update product details (Vendor owner or Admin only).
- `DELETE /products/:id` - Soft deletes a product.

### ⭐ Reviews (`/api/v1/reviews`)
- `POST /reviews` - Add a review to a product (Authenticated users).
- `GET /reviews/product/:productId` - Get all reviews for a product.
- `PUT /reviews/:id` - Update a review (Review author or Admin only).
- `DELETE /reviews/:id` - Delete a review (Review author or Admin only).

### 🌐 Next.js Simple CRUD Client Compatibility
Directly exposed at `/` to serve the custom Server Actions of the frontend client:
- `GET /users` - Returns a flat array of active users mapped with `_id`.
- `GET /users/:id` - Returns a single user object mapped with `_id`.
- `DELETE /users/:id` - Soft deletes the user and returns `{ deletedCount: 1 }` to trigger Next.js revalidation.

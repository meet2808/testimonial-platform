# Testimonial Platform

A full-stack platform for collecting, moderating, and displaying customer testimonials.

---

## 📋 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, TypeScript, TailwindCSS v4 |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT in HttpOnly Cookie |
| Validation | Zod (client + server) |
| Forms | React Hook Form |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL (running locally)

---

### 1. Clone and navigate

```bash
git clone <repo-url>
cd testimonial-platform
```

---

### 2. Setup the Backend

```bash
cd backend
```

**Configure environment variables:**

```bash
cp .env.example .env
```

Edit `.env` and update `DATABASE_URL` with your PostgreSQL connection string:

```env
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/testimonial_db
```

**Install dependencies:**

```bash
npm install
```

**Run database migration:**

```bash
npm run db:migrate
```

**Seed the admin account:**

```bash
npm run db:seed
```

This creates the admin account:
- **Email:** `admin@testimonial.com`
- **Password:** `Admin@123456`

**Start the backend:**

```bash
npm run dev
```

The API will be available at: `http://localhost:5000`
Health check: `http://localhost:5000/api/v1/health`

---

### 3. Setup the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at: `http://localhost:5173`

---

## 🌐 Application Routes

| Route | Description |
|---|---|
| `/` | Testimonial submission form (public) |
| `/testimonials` | Public testimonial wall |
| `/widget` | Embeddable widget view |
| `/admin/login` | Admin login |
| `/admin` | Admin dashboard (protected) |

---

## 📡 API Endpoints

### Public
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/v1/testimonials` | Submit a testimonial |
| `GET` | `/api/v1/testimonials/public` | Get approved testimonials |
| `GET` | `/api/v1/testimonials/widget` | Get approved testimonials (widget) |

### Auth
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Admin login |
| `POST` | `/api/v1/auth/logout` | Admin logout |
| `GET` | `/api/v1/auth/me` | Verify session |

### Admin (Protected)
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/v1/admin/testimonials` | List all (filter/search/sort/paginate) |
| `GET` | `/api/v1/admin/testimonials/:id` | Get single testimonial |
| `PATCH` | `/api/v1/admin/testimonials/:id/approve` | Approve |
| `PATCH` | `/api/v1/admin/testimonials/:id/reject` | Reject |
| `DELETE` | `/api/v1/admin/testimonials/:id` | Delete |
| `GET` | `/api/v1/admin/stats` | Dashboard stats |

---

## 🖼️ Embeddable Widget

Embed the testimonial widget on any website:

```html
<iframe
  src="http://localhost:5173/widget"
  width="100%"
  height="300"
  frameborder="0"
  style="border-radius: 12px;"
></iframe>
```

---

## 📁 Project Structure

```
testimonial-platform/
├── frontend/          # React + Vite + TypeScript
│   └── src/
│       ├── api/       # Axios API calls
│       ├── components/# Reusable UI components
│       ├── context/   # Auth context
│       ├── hooks/     # Custom data hooks
│       ├── pages/     # Page components
│       ├── router/    # React Router config
│       ├── schemas/   # Zod validation schemas
│       ├── types/     # TypeScript types
│       └── utils/     # Utility functions
│
└── backend/           # Express + TypeScript
    ├── src/
    │   ├── config/    # App config + Prisma singleton
    │   ├── controllers/
    │   ├── services/
    │   ├── repositories/
    │   ├── middleware/
    │   ├── routes/
    │   ├── schemas/   # Zod schemas
    │   ├── types/     # TypeScript types
    │   └── utils/     # Utilities
    └── prisma/        # Schema + migrations + seed
```

---

## 🔐 Admin Credentials

| Field | Value |
|---|---|
| Email | `admin@testimonial.com` |
| Password | `Admin@123456` |

> ⚠️ These are hardcoded development credentials. Change them in `prisma/seed.ts` before deploying.

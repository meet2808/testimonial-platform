# Testimonial Platform

A production-ready full-stack platform for collecting, moderating, and displaying customer testimonials. Built with modern UI aesthetics, layered backend architecture, half-star rating support, embeddable widget options, Supabase Cloud Storage, and anti-spam protection.

---

## 🌐 Live Production Deployment

| Layer | Hosting Provider | Live URL / Detail |
|---|---|---|
| **Frontend** | **Vercel** | [https://testimonial-platform-zeta.vercel.app](https://testimonial-platform-zeta.vercel.app) |
| **Backend API** | **Render** | [https://testimonial-backend-u8wv.onrender.com](https://testimonial-backend-u8wv.onrender.com) |
| **Database** | **Supabase** | Cloud PostgreSQL (managed via Prisma ORM) |
| **File Storage** | **Supabase Storage** | Public Bucket (`testimonial-platform-image`) |

---

## 📋 Tech Stack & Key Features

| Layer | Technology & Features |
|---|---|
| **Frontend** | React 19, Vite, TypeScript, TailwindCSS v4, React Router, Lucide Icons |
| **Backend** | Node.js, Express, TypeScript (Layered Architecture: Controller $\rightarrow$ Service $\rightarrow$ Repository) |
| **Database** | PostgreSQL on Supabase Cloud via Prisma ORM |
| **Cloud Storage** | Supabase Storage Bucket for profile image CDN delivery |
| **Auth** | JWT stored in HttpOnly / SameSite:Strict Cookie |
| **Validation** | Zod (shared validation schemas client & server) |
| **Forms** | React Hook Form with Zod resolver |
| **Ratings** | 0.5 step half-star rating system (0.5 to 5.0) |
| **Anti-Spam** | Honeypot trap field with bot deception (silent 201 response) |
| **Retention** | Automated background purge for rejected testimonials (30 mins) |
| **Widget** | Embeddable `<iframe>` widget with continuous auto-scroll carousel & grid layouts |
| **UX Loaders** | Card & Table Skeleton pulse shimmer loaders for smooth loading states |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL (Local or Supabase Database)

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

Edit `.env` and update your PostgreSQL connection string & Supabase storage bucket settings:

```env
# Database Connection (Supabase or Local PostgreSQL)
DATABASE_URL="postgresql://postgres:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# CORS Origin
CORS_ORIGIN=https://testimonial-platform-zeta.vercel.app

# Supabase Storage Configuration
SUPABASE_BUCKET_URL=https://[YOUR-PROJECT-REF].supabase.co/storage/v1/object/public/testimonial-platform-image
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Install dependencies:**

```bash
npm install
```

**Run database migration & sync:**

```bash
npm run db:migrate
```

**Seed the admin account:**

```bash
npm run db:seed
```

This creates the default admin account:
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
| `/` | Public testimonial submission form |
| `/testimonials` | Public testimonial wall (Grid/Masonry layout) |
| `/widget` | Embeddable widget view |
| `/admin/login` | Admin login portal |
| `/admin` | Protected admin moderation dashboard |

---

## 🖼️ Embeddable Widget Customization

The `/widget` route is designed to be embedded in third-party websites via an `<iframe>`. It supports URL Query Parameters for instant customization without writing code:

### Supported Query Parameters

| Parameter | Options | Default | Description |
|---|---|---|---|
| `layout` | `carousel`, `grid` | `carousel` | **Carousel**: 60 FPS continuous auto-scroll (pauses on hover).<br>**Grid**: Responsive multi-column grid layout. |
| `theme` | `dark`, `light`, `transparent` | `dark` | Color theme for cards and background. `transparent` matches the host website background. |
| `accent` | `indigo`, `blue`, `emerald`, `amber`, `rose`, `violet`, `orange`, `teal` **or hex** | `indigo` | Accent color for the header bar indicator (e.g. `?accent=emerald` or `?accent=ff5722`). |

### Live Embed Snippets

#### 1. Default (Continuous Auto-Scrolling Carousel — Dark Mode)
```html
<iframe
  src="https://testimonial-platform-zeta.vercel.app/widget?layout=carousel&theme=dark"
  width="100%"
  height="240"
  frameborder="0"
  style="border-radius: 12px; overflow: hidden;"
></iframe>
```

#### 2. Responsive Grid Layout — Light Mode with Emerald Accent
```html
<iframe
  src="https://testimonial-platform-zeta.vercel.app/widget?layout=grid&theme=light&accent=emerald"
  width="100%"
  height="480"
  frameborder="0"
  style="border-radius: 12px; overflow: hidden;"
></iframe>
```

#### 3. Transparent Background (Matches Host Website)
```html
<iframe
  src="https://testimonial-platform-zeta.vercel.app/widget?layout=grid&theme=transparent&accent=ff5722"
  width="100%"
  height="480"
  frameborder="0"
  allowtransparency="true"
  style="background: transparent; border-radius: 12px;"
></iframe>
```

---

## 📡 API Endpoints

### Public Endpoints
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/v1/testimonials` | Submit a new testimonial (supports multipart form data with profile image) |
| `GET` | `/api/v1/testimonials/public` | Get all approved testimonials for the public wall |
| `GET` | `/api/v1/testimonials/widget` | Get approved testimonials for the embeddable widget |

### Authentication Endpoints
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Admin login (issues HttpOnly JWT cookie) |
| `POST` | `/api/v1/auth/logout` | Admin logout (clears JWT cookie) |
| `GET` | `/api/v1/auth/me` | Verify session on app load |

### Admin Endpoints (Protected — Requires Valid JWT Cookie)
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/v1/admin/testimonials` | List testimonials with search, status filter (`ALL`/`PENDING`/`APPROVED`/`REJECTED`), sorting, and pagination (10/25/50) |
| `GET` | `/api/v1/admin/testimonials/:id` | Get single testimonial full details |
| `PATCH` | `/api/v1/admin/testimonials/:id/approve` | Approve a pending or rejected testimonial |
| `PATCH` | `/api/v1/admin/testimonials/:id/reject` | Reject a pending or approved testimonial |
| `DELETE` | `/api/v1/admin/testimonials/:id` | Permanently delete a testimonial |
| `GET` | `/api/v1/admin/stats` | Get aggregate dashboard counters (total, pending, approved, rejected) |

---

## 🛡️ Anti-Spam & Auto-Purge Features

1. **Honeypot Trap Field**:
   The public form includes an invisible `honeypot` field. Automated spam bots fill out all input fields; when detected, the API deceives the bot with a `201 Created` response without storing anything in PostgreSQL.

2. **Automated Rejected Cleanup**:
   Rejected testimonials are kept temporarily for administrative review. A background process automatically purges `REJECTED` testimonials after the 30-minute retention window.

---

## 📁 Project Structure

```text
testimonial-platform/
├── frontend/          # React + Vite + TypeScript
│   └── src/
│       ├── api/       # Axios API calls (baseURL with VITE_API_BASE_URL)
│       ├── components/# Reusable UI components & Layout (Navbar, CardSkeleton, TableSkeleton, StarRating, etc.)
│       ├── context/   # Auth context & session management
│       ├── hooks/     # Custom data hooks (useAdminTestimonials, usePublicTestimonials, etc.)
│       ├── pages/     # Page components (SubmissionPage, PublicWallPage, WidgetPage, DashboardPage, LoginPage)
│       ├── router/    # React Router & ProtectedRoute guard
│       ├── schemas/   # Zod validation schemas
│       ├── types/     # Shared TypeScript types
│       └── utils/     # Formatters & helper functions
│
└── backend/           # Express + TypeScript
    ├── src/
    │   ├── config/    # App configuration & Prisma singleton
    │   ├── controllers/# HTTP request & response handlers (Supabase Storage Direct REST Upload)
    │   ├── services/  # Business logic layer
    │   ├── repositories/# Database access layer (Prisma ORM)
    │   ├── middleware/# Auth, error handling, Zod validation, Multer upload
    │   ├── routes/    # Express feature routers
    │   ├── schemas/   # Zod backend schemas
    │   ├── types/     # Backend TypeScript definitions
    │   └── utils/     # AppError & response builders
    └── prisma/        # Schema, migrations & seed script
```

---

## 🔐 Default Admin Credentials

| Field | Value |
|---|---|
| **Email** | `admin@testimonial.com` |
| **Password** | `Admin@123456` |

> ⚠️ These are development credentials. Update them in `prisma/seed.ts` before deploying to production.

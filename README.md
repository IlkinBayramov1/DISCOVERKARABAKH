# DISCOVER KARABAKH (DiscoverKarabakh Platform)

[![Node.js](https://img.shields.io/badge/Node.js-v20.x-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?style=for-the-badge&logo=redis)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

**DISCOVER KARABAKH** is an enterprise-grade, multi-tenant smart tourism, hospitality, logistics, utility management, and regional governance ecosystem designed specifically for the Karabakh region of Azerbaijan. 

The platform connects tourists, local residents, investors, B2B vendors, drivers, and municipal government administrators into a unified digital infrastructure.

---

## Key Functional Domains

### 1. Smart Hospitality & Accommodations
* **Property Management**: Complete dashboard for hotels, resorts, guest houses, and apartments.
* **Room Types & Rate Plans**: Dynamic room categorization, meal plan configurations (`RO`, `BB`, `HB`, `FB`, `AI`), prepayment policies, and cancellation rules.
* **Dynamic Daily Pricing Engine**: Automated date-based pricing, min/max stay constraints, occupancy-based price adjustment rules, and closed-to-arrival (CTA) controls.
* **Inventory Lock & Yield Management**: Real-time room availability tracking with temporary locks during check-out to prevent overbooking.

### 2. Tours & Cultural Experiences
* **Multi-Day Tour Packages**: Customizable itineraries with daily schedules, difficulty levels (*Easy, Medium, Hard, Extreme*), group capacity thresholds, and meeting points.
* **Date-Specific Availability & Pricing**: Flexible date-bound seat availability and custom pricing overrides.

### 3. Events & Digital Ticketing
* **Cultural Events & Concerts**: Capacity tracking, ticket tiers, and scheduling.
* **QR-Coded E-Tickets**: Automated digital QR code ticket generation with scan-to-checkin validation for event security.

### 4. Gastronomy & Dining (Restaurants)
* **Culinary Venue Directory**: Searchable restaurants, cafes, and traditional dining spots categorized by cuisine.
* **Digital Menus & Add-Ons**: Item options, choice add-ons, price modifiers, promo codes, and operating hours.

### 5. Smart Regional Guide & Attractions
* **Attractions Database**: Museums, parks, historic monuments, and memorial complexes across Karabakh.
* **Interactive Features**: 360° virtual tour embeds, audio guide streaming, live crowd-level tracking, working hours, and review analytics.

### 6. Smart Transport & Ride-Hailing
* **On-Demand Passenger Rides**: Ride requesting for Economy, Business, Minivan, and Bus categories.
* **Driver Verification & Capability Management**: License validation, background checks, and capability badges (*PASSENGER, LIGHT_CARGO, HEAVY_CARGO, HAZARDOUS, REFRIGERATED*).
* **Real-Time GPS Tracking**: Powered by Socket.io for live vehicle location streaming and status updates (*Pending, DriverAssigned, OnWayToPickup, Ongoing, Completed*).

### 7. Freight & Cargo Logistics
* **Logistics Fleet Oversight**: Managing specialized cargo vehicles (*Box, Refrigerated, Flatbed, Liquid*).
* **Shipment Lifecycle Management**: Weight/volume constraint calculations, hazardous/temperature-controlled cargo handling, digital proof of delivery, and signature capture.

### 8. Karabakh Smart Utility Billing (Abonent System)
* **Resident Abonent Integration**: Abonent account registration and binding for local infrastructure services.
* **CSV Batch Uploads & Rollback**: Admin capability to bulk-upload utility bills with complete audit logging and batch rollback mechanisms.
* **Online Utility Payments**: Instant online bill settlement for electricity, natural gas, water, and municipal services.

### 9. Universal Financial Engine & Wallets
* **Polymorphic Booking Engine**: Single transactional pipeline supporting Stays, Tours, Events, Vehicles, and Attractions.
* **Digital Wallets**: Vendor payout management, wallet transactions, balance tracking, and withdrawal requests.
* **Promotions & Audit Logs**: Stackable promo codes, tax rules, and immutable booking state audit logs.

### 10. Multi-Persona Role-Based Access Control (RBAC)
* **7 Persona Roles**: `admin`, `vendor`, `tourist`, `resident`, `investor`, `driver`, `user`.
* **Superadmin Governance**: System approvals, user bans, fraud detection alerts, review moderation, and regional analytics.

---

## Architecture & Monorepo Structure

The project is organized as a high-performance monorepo separating concerns between the modular Node.js/Express backend API and specialized Vite-powered React frontend applications.

```
DISCOVERKARABAKH/
├── back/                       # Enterprise Node.js / Express Backend
│   ├── cache/                  # Redis caching service
│   ├── config/                 # Environment & database configurations
│   ├── core/                   # Shared errors, base service, pagination
│   ├── docs/                   # API documentation assets
│   ├── events/                 # Pub/Sub event emitters
│   ├── i18n/                   # Internationalization translations (AZ, EN, RU)
│   ├── jobs/                   # Scheduled cron jobs (node-cron)
│   ├── middlewares/            # Auth JWT, RBAC, rate-limiting, error handling
│   ├── modules/                # Domain-Driven Functional Modules
│   │   ├── admins/             # Superadmin endpoints & utility logs
│   │   ├── auth/               # JWT Authentication & Registration
│   │   ├── booking/            # Polymorphic Booking Engine
│   │   ├── businesses/         # Hotel, Tour, Event, Restaurant, Attraction modules
│   │   ├── interactions/       # Reviews, Ratings, Wishlists
│   │   ├── payments/           # Financial transactions & payment gateways
│   │   ├── shared/             # File Upload (S3/Cloudflare R2), Notifications
│   │   ├── transport/          # Ride hailing, Cargo logistics, Driver profiles
│   │   ├── users/              # User profile & persona management
│   │   ├── utility/            # Abonent & bill management system
│   │   └── vendors/            # Vendor onboarding & business profiles
│   ├── monitoring/             # Health metrics & Sentry error tracking
│   ├── node_modules/
│   ├── policies/               # Access policies & business rules
│   ├── prisma/                 # Database Schema & Migrations
│   │   └── schema.prisma       # Complete MySQL Data Model (1400+ lines)
│   ├── queues/                 # BullMQ queue workers
│   ├── routes/                 # Express Router hierarchy (/api/v1)
│   ├── security/               # Encryption & token utilities
│   ├── storage/                # Storage adaptors (S3, Cloudinary, Local)
│   ├── webhooks/               # External payment webhook listeners
│   ├── app.js                  # Express App configuration & middleware
│   ├── server.js               # HTTP server & Socket.io initialization
│   ├── start.sh                # Production entrypoint & database migration script
│   └── package.json
│
├── front/                      # Monorepo Frontend Applications
│   ├── apps/
│   │   ├── web/                # Public Tourist, Resident & Investor Portal (Port 5174)
│   │   ├── vendor/             # B2B Vendor Partner Management Dashboard (Port 5175)
│   │   └── admin/              # Superadmin & Government Control Panel (Port 5176)
│   ├── packages/
│   │   └── ui/                 # Shared UI Design Tokens, Components & Utilities (@dk/ui)
│   ├── scripts/                # Development & build orchestration scripts
│   ├── package.json            # Monorepo workspace configuration
│   └── tsconfig.base.json
│
├── scripts/                    # Image optimization & setup automation scripts
├── Dockerfile                  # Multi-stage production build image
├── docker-compose.yml          # Full stack orchestration (Backend + MySQL + Redis)
├── docs.md                     # Comprehensive backend architecture guide
└── README.md                   # Platform Documentation (This File)
```

---

## 🛠️ Technology Stack

### Backend Technologies
* **Runtime & Framework**: Node.js (v20+), Express.js 5.x
* **Database & ORM**: MySQL 8.0, Prisma ORM (with full-text search preview features)
* **Cache & Queues**: Redis 7, BullMQ
* **Real-time Engine**: Socket.io (Bi-directional WebSocket connection for ride tracking)
* **Security & Auth**: JWT (JSON Web Tokens), Bcryptjs, Helmet, Express Rate Limit, CORS
* **File Storage**: AWS S3 / Cloudflare R2 / Cloudinary / Multer with Sharp image optimization
* **Monitoring & Utilities**: Sentry, Morgan logger, Node-cron, XLSX, PDFKit / JSPDF

### Frontend Technologies
* **Framework**: React 19, TypeScript (~5.9)
* **Build System**: Vite 7, npm Workspaces (Monorepo)
* **State & Data Fetching**: TanStack React Query v5, Axios, React Context API
* **Icons & Visualization**: Lucide React, Recharts analytics library
* **Design System**: Glassmorphism UI, Vanilla CSS3 / TailwindCSS in shared `@dk/ui` package

---

## ⚙️ Getting Started & Installation

### 1. Prerequisites
Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v20.x or higher)
* [MySQL](https://www.mysql.com/) (v8.0 or higher)
* [Redis](https://redis.io/) (v7.x or higher)
* [Docker & Docker Compose](https://www.docker.com/) *(Optional, for containerized run)*

### 2. Environment Setup

#### Backend Environment (`back/.env`)
Create a `.env` file inside the `back/` directory:
```env
PORT=4000
NODE_ENV=development
DATABASE_URL="mysql://root:password@localhost:3306/discoverkarabakh"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your_secure_jwt_secret_key_here"
JWT_EXPIRES_IN="7d"

# Frontend URLs for CORS
FRONTEND_WEB_URL="http://localhost:5174"
FRONTEND_VENDOR_URL="http://localhost:5175"
FRONTEND_ADMIN_URL="http://localhost:5176"

# Optional Cloud Storage (S3 / Cloudflare R2)
S3_ENDPOINT=""
S3_ACCESS_KEY_ID=""
S3_SECRET_ACCESS_KEY=""
S3_BUCKET_NAME=""
S3_PUBLIC_URL=""
```

---

### 3. Local Installation & Running

#### Step 1: Install Backend Dependencies & Run Database Migrations
```bash
cd back
npm install

# Run Prisma migrations to generate database tables
npx prisma migrate dev

# (Optional) Seed initial data
node seed_attraction_categories.js
node seed_utilities.js
```

#### Step 2: Start Backend Server
```bash
# Development mode with Nodemon
npm run server

# Production mode
npm start
```
*The backend API will start at `http://localhost:4000`.*

#### Step 3: Install & Start Frontend Monorepo
Open a new terminal window:
```bash
cd front
npm install

# Start all frontend applications concurrently
npm run dev
```

You can also start specific apps individually:
```bash
npm run dev:web      # Starts Public Web Portal on http://localhost:5174
npm run dev:vendor   # Starts Vendor Partner Portal on http://localhost:5175
npm run dev:admin    # Starts Admin Governance Panel on http://localhost:5176
```

---

## Docker Deployment

The project includes a multi-stage `Dockerfile` and `docker-compose.yml` for running the entire stack (Backend, MySQL, Redis) with a single command.

```bash
# Build and run all containers in background
docker-compose up --build -d
```

Containers launched:
* `discoverkarabakh_backend`: Express API server listening on port `4000` (mapped to port `80`)
* `discoverkarabakh_mysql`: Managed MySQL 8.0 instance with persistent volume
* `discoverkarabakh_redis`: Redis 7 Alpine cache and BullMQ broker

---

## Main API Endpoints Summary (`/api/v1`)

| Module | Endpoint | Description |
| :--- | :--- | :--- |
| **Health** | `GET /api/v1/` | System status & healthcheck |
| **Auth** | `POST /api/v1/auth/register` | User registration with persona selection |
| **Auth** | `POST /api/v1/auth/login` | Authentication & JWT token issuance |
| **Hotels** | `GET /api/v1/hotels` | Search & filter accommodations |
| **Hotels** | `POST /api/v1/hotels` | Create new hotel property (Vendor) |
| **Tours** | `GET /api/v1/tours` | List travel packages & itineraries |
| **Events** | `GET /api/v1/events` | Browse regional events & tickets |
| **Restaurants**| `GET /api/v1/restaurants` | List dining venues & menus |
| **Attractions**| `GET /api/v1/attractions` | Explore historic sites & museums |
| **Transport** | `POST /api/v1/transport/rides` | Request ride-hailing service |
| **Logistics** | `POST /api/v1/transport/shipments` | Schedule cargo transport |
| **Utility** | `GET /api/v1/utility/bills/:code` | Query abonent utility bills |
| **Utility** | `POST /api/v1/utility/pay` | Pay utility bills online |
| **Bookings** | `POST /api/v1/bookings` | Create polymorphic reservation |
| **Payments** | `POST /api/v1/payments/checkout` | Process online booking payment |
| **Admin** | `POST /api/v1/admins/utility/upload` | Bulk upload CSV utility bills |

---

## 🤝 Contribution & License

Designed and developed by **İlkin Bayramov** for the **DISCOVER KARABAKH** platform initiative.

© 2026 DISCOVER KARABAKH. All rights reserved.

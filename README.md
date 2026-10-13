# ResortHub — Full-Stack MERN Resort & Stay Discovery Platform

ResortHub is an information and discovery directory for handcrafted resorts, beach sanctuaries, and nature retreats in Kannur, Kerala.

---

## Architecture Overview

```
Resort-Hub/
├── client/                      # React 18 + Vite Frontend
│   ├── src/
│   │   ├── components/          # Navbar, ResortCard, RoomCard, Modals, etc.
│   │   ├── context/             # AuthContext (JWT cookie & state management)
│   │   ├── pages/               # Resorts, ResortDetails, Login, Register, Profile
│   │   └── services/            # API communication layer
│   └── package.json
└── server/                      # Node.js + Express + MongoDB Backend
    ├── src/
    │   ├── config/              # MongoDB connection & Argon2id security helpers
    │   ├── models/              # Mongoose User & Resort models
    │   ├── controllers/         # Auth & Resort route logic
    │   ├── middleware/          # JWT Auth, Admin guards, and Error handlers
    │   ├── routes/              # Express REST routes
    │   └── scripts/             # Safe & idempotent database seed script
    ├── .env.example             # Documented environment variables
    ├── server.js                # Server entrypoint
    └── package.json
```

---

## 1. Prerequisites

Make sure you have installed on your computer:
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **MongoDB Atlas Account**: A free cloud cluster from [mongodb.com/atlas](https://www.mongodb.com/atlas)

---

## 2. Backend Setup & Configuration

### Step 1: Navigate to the `server` directory
```bash
cd server
```

### Step 2: Install dependencies
```bash
npm install
```
Installed packages:
* `express`: REST API web framework
* `mongoose`: MongoDB ODM
* `argon2`: Password hashing strictly using the **Argon2id** variant
* `jsonwebtoken`: Token generation for authentication
* `cookie-parser`: Parses secure `HttpOnly` cookies
* `cors`: Cross-Origin Resource Sharing handling
* `helmet`: HTTP header security
* `express-rate-limit`: Brute-force protection on authentication routes
* `dotenv`: Environment variable management

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(On Windows PowerShell, run: `copy .env.example .env`)*

Open `.env` and fill in your values:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<your_username>:<your_password>@cluster0.xxxxx.mongodb.net/resorthub?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

> **How to get your MongoDB Atlas URI:**
> 1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
> 2. Under **Security > Network Access**, click **Add IP Address** and choose **Allow Access from Anywhere (`0.0.0.0/0`)** for development.
> 3. Under **Security > Database Access**, create a database user with read & write permissions.
> 4. Go to **Database > Clusters > Connect > Drivers > Node.js** and copy your connection string into `MONGODB_URI`.

---

## 3. Seed Database with Sample Resorts

Populate MongoDB Atlas with curated Kannur resorts and a default administrator account:
```bash
npm run seed
```

This script:
* Idempotently cleans up old records (safe to rerun at any time without creating duplicates).
* Inserts 8 curated resorts in Kannur with nested room models, amenities, and Google Maps queries.
* Automatically creates an administrator account:
  * **Email**: `admin@resorthub.com`
  * **Password**: `AdminPass123!`

---

## 4. Starting the Backend Server

### Development Mode (with automatic reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

Once running, you should see:
```text
===============================================
  ResortHub Backend Server Running!
  Local URL:   http://localhost:5000
  Healthcheck: http://localhost:5000/api/health
  Environment: development
===============================================
MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
```

---

## 5. API Reference

### Healthcheck
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Checks server uptime and status |

### Authentication
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account (strictly sets role to `user`) |
| `POST` | `/api/auth/login` | Public | Verifies Argon2id password and sets `HttpOnly` JWT cookie |
| `GET` | `/api/auth/me` | Authenticated | Verifies JWT cookie and returns authenticated profile |
| `POST` | `/api/auth/logout` | Public | Clears authentication cookie |

### Resorts
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/resorts` | Public | Fetch all resorts. Supports `?search=`, `?category=`, and `?minRating=` |
| `GET` | `/api/resorts/:id` | Public | Fetch a single resort with nested rooms |
| `POST` | `/api/resorts` | **Admin Only** | Create a new resort with rooms |
| `PUT` | `/api/resorts/:id` | **Admin Only** | Update an existing resort |
| `DELETE` | `/api/resorts/:id` | **Admin Only** | Delete a resort by ID |

---

## 6. Running the Frontend with Backend

In another terminal, start the Vite client:
```bash
cd client
npm run dev
```
Open `http://localhost:5173` to explore ResortHub!

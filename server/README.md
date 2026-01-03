# 🚀 Task Management CRUD API (Dockerized)

Ek robust Task Management Backend system jo **Node.js**, **Express**, aur **PostgreSQL** ka upyog karke banaya gaya hai. Ye project puri tarah se **Dockerized** hai aur **JWT authentication** aur **Cookie-based sessions** ko support karta hai.

---

## ✨ Features

- **User Auth:** Register aur Login `bcryptjs` hashing aur `JWT` tokens ke saath.
- **Security:** Cookies mein stored tokens (`httpOnly`, `Secure`, `SameSite`).
- **CRUD Operations:** Tasks create, read, update, aur delete karne ki suvidha.
- **Database:** PostgreSQL relational database with Foreign Key mapping (Users -> Tasks).
- **Dockerized:** Ek single command se pura environment setup (App + DB).
- **Production Ready:** Docker Hub image integration (`v3`).

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL 15
- **DevOps:** Docker, Docker Compose
- **Auth:** JSON Web Tokens (JWT) & BcryptJS

---

## ⚙️ Setup & Installation

### 1. Prerequisites

Aapke system mein niche di gayi cheezein honi chahiye:

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 2. Environment Variables (`.env`)

Project ke root folder mein ek `.env` file banayein aur ye variables dalein:

```env
PORT=3000
DB_HOST=db
DB_USER=admin
DB_NAME=crud_app
DB_PASSWORD=password
DB_PORT=5432
JWT_SECRET=your_super_secret_key
SECURE=false
SAMESITE=lax
NODE_ENV=development

```

### 3. Running with Docker 🐳

Ab bas ek command chalao aur magic dekho:

```bash
docker-compose up -d

```

Isse:

1. **PostgreSQL** container start ho jayega.
2. **Node.js** server (`pawan630703/basic-server:v3`) pull hokar start ho jayega.
3. Database tables automatically create ho jayengi.

---

## 🔌 API Endpoints

### Auth Routes

| Method | Endpoint                | Description                     |
| ------ | ----------------------- | ------------------------------- |
| POST   | `/api/v1/auth/register` | Naya user create karein         |
| POST   | `/api/v1/auth/login`    | Login karke cookie prapt karein |

### Task Routes (Protected)

| Method | Endpoint                   | Description                 |
| ------ | -------------------------- | --------------------------- |
| GET    | `/api/v1/tasks/all`        | User ke saare tasks dekhein |
| POST   | `/api/v1/tasks/create`     | Naya task add karein        |
| PUT    | `/api/v1/tasks/update/:id` | Task update karein          |
| DELETE | `/api/v1/tasks/delete/:id` | Task delete karein          |

---

## 📂 Project Structure

```text
├── config/             # DB connection logic
├── controllers/        # Business logic (Auth, Tasks)
├── middleware/         # Auth verification (JWT)
├── routes/             # API Route definitions
├── docker-compose.yml  # Docker orchestration
├── Dockerfile          # Image build instructions
└── server.js           # Entry point

```

---

## 🛡️ Database Schema

Project mein do tables hain:

1. **Users:** `id`, `email`, `password`, `role`, `created_at`
2. **Tasks:** `id`, `user_id` (FK), `task_name`, `description`, `is_completed`, `created_at`

---


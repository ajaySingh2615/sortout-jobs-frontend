# SortOut Jobs Frontend

A job platform frontend (JobHai / Naukri style) — Next.js, React, Tailwind CSS, Shadcn UI.

---

## Tech Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| Framework      | Next.js 16 (App Router)             |
| UI             | React 19, Tailwind CSS 4, Shadcn UI |
| Forms          | React Hook Form + Zod               |
| HTTP           | Axios (with interceptors)            |
| State          | React Context (AuthContext)           |
| Notifications  | Sonner (toast)                        |
| Icons          | Lucide React                          |
| Animations     | Framer Motion                         |

---

## Backend Connection

This frontend connects to **sortout-backend** (Express + PostgreSQL) running at `http://localhost:8000`.

### Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Set in `.env.local` (already configured).

### Auth Flow

1. **Phone OTP (primary):** User enters phone number → `POST /api/auth/request-otp` → OTP sent via Twilio → User enters 6-digit code → `POST /api/auth/verify-otp` → Logged in
2. **Email/Password (backup):** `POST /api/auth/register` or `POST /api/auth/login`
3. **Google OAuth (backup):** `POST /api/auth/google` with id_token
4. **Token refresh:** `POST /api/auth/refresh` with refreshToken in body
5. **Logout:** `POST /api/auth/logout` with refreshToken in body

### Backend Response Format

All auth endpoints return:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logged in",
  "data": {
    "user": {
      "id": "uuid",
      "email": "string | null",
      "phone": "string | null",
      "name": "string",
      "avatarUrl": "string | null",
      "role": "user | admin",
      "emailVerifiedAt": "date | null",
      "phoneVerifiedAt": "date | null",
      "createdAt": "date",
      "updatedAt": "date"
    },
    "accessToken": "jwt-string",
    "refreshToken": "hex-string",
    "expiresIn": "15m"
  }
}
```

### Token Storage

- `accessToken` → localStorage (sent as `Authorization: Bearer` header)
- `refreshToken` → localStorage (sent in request body for refresh/logout)
- `user` → localStorage (JSON stringified user object from backend)

---

## Getting Started

### 1. Start the backend

```bash
cd ../sortout-backend
docker-compose up -d    # PostgreSQL
npm run dev             # Express server on :8000
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the frontend

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
sortout-job-frontend/
├── app/                    # Next.js App Router pages
│   ├── page.js             # Landing page
│   ├── layout.js           # Root layout (AuthProvider)
│   ├── dashboard/          # User dashboard (protected)
│   ├── onboarding/         # Onboarding flow (protected)
│   └── admin/              # Admin panel (admin role)
├── components/
│   ├── auth/               # PhoneLoginForm, ProtectedRoute, AdminRoute
│   ├── admin/              # AdminLoginForm, AdminLayout
│   ├── jobs/               # JobCard
│   ├── landing/            # Hero, USP, TopCompanies, etc.
│   ├── layout/             # Header, Footer, DashboardNavbar
│   ├── profile/            # Profile sections + edit modals
│   └── ui/                 # Shadcn UI primitives
├── context/
│   └── AuthContext.jsx     # Auth state (user, token, login, logout)
├── services/
│   ├── api.js              # Axios instance + interceptors
│   ├── auth.service.js     # Auth API calls
│   ├── profile.service.js  # Profile API calls
│   ├── job.service.js      # Job API calls
│   ├── onboarding.service.js # Onboarding API calls
│   └── admin.service.js    # Admin API calls
├── constants/              # Enums, static data
├── lib/                    # Utilities (cn)
└── .env.local              # NEXT_PUBLIC_API_URL
```

---

## Auth API Endpoints (Connected)

| Method | Backend Endpoint           | Frontend Service Call         | Status |
|--------|---------------------------|-------------------------------|--------|
| POST   | /api/auth/request-otp     | `authService.sendOtp(phone)`  | Done   |
| POST   | /api/auth/verify-otp      | `authService.verifyOtp(phone, code)` | Done |
| POST   | /api/auth/login           | `authService.login(email, pw)` | Done  |
| POST   | /api/auth/register        | `authService.register(name, email, pw)` | Done |
| POST   | /api/auth/logout          | `authService.logout()`        | Done   |
| POST   | /api/auth/refresh         | `authService.refreshToken()`  | Done   |
| GET    | /api/auth/me              | `authService.getMe()`         | Done   |
| POST   | /api/auth/forgot-password | `authService.forgotPassword(email)` | Done |
| POST   | /api/auth/reset-password  | `authService.resetPassword(token, pw)` | Done |
| POST   | /api/auth/verify-email    | `authService.verifyEmail(token)` | Done |
| POST   | /api/auth/resend-verify-email | `authService.resendVerification(email)` | Done |
| POST   | /api/auth/google          | `authService.googleAuth(idToken)` | Done |
| POST   | /api/auth/link-phone      | `authService.linkPhone(phone, code)` | Done |
| POST   | /api/auth/link-email      | `authService.linkEmail(email, pw, name)` | Done |

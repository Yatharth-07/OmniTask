# OmniTask - Frontend Application

This is the frontend client for the OmniTask application. It connects to the FastAPI backend, provides a comprehensive JWT authentication flow, and a role-based Dashboard for Task management.

## 🎨 UI/UX Design Philosophy

The application interface is crafted balancing Google's Material Design principles and Apple's Human Interface Guidelines.
- **Premium Aesthetics:** Clean typography (Inter font), soft shadows, and subtle translucent blur effects (glassmorphism in modals and navbars) emulate a high-end SaaS product.
- **Micro-Interactions:** Buttons scale down on click (`active:scale-[0.98]`), form elements smoothly transition ring colors on focus, and modals animate gracefully. 
- **Accessibility:** High-contrast text colors, clear focus indicators (`focus-visible` rings), and standard ARIA integration via React Router and React Hook Form. 
- **Responsiveness:** Full mobile support via flex layouts, making task management easy on any device.

## 🛠️ Tech Stack & Architecture

- **Framework:** React 19 bootstrapped with [Vite](https://vitejs.dev/) for blazing fast HMR and optimized builds.
- **Language:** TypeScript for type safety across API boundaries.
- **Routing:** React Router v6.
- **State Management & Data Fetching:** Local Context API (`AuthContext`) paired with Axios interceptors for automated JWT injection and global 401 handling.
- **Styling:** Tailwind CSS v4.
- **Form Validation:** React Hook Form + Yup, ensuring fast client-side error handling before hitting the API.
- **Testing:** Vitest and Testing Library (Jest DOM) for modern, fast unit and integration tests.

## 🚀 Setup & Installation

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- The FastAPI Backend must be running (default `http://localhost:8000`)

### 2. Environment Setup
Clone the repository, navigate into the `frontend` folder, and configure your environment variables:
```bash
cd frontend
cp .env.example .env
```
Ensure `VITE_API_URL` points to your backend instance.

### 3. Install Dependencies
```bash
npm install
```

### 4. Running the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`. 

*(Note: Tailwind v4 compiles highly efficiently on the fly, so initial load is extremely fast!)*

## 🧪 Testing

The frontend features robust unit and integration tests covering form validation, rendering, and mocked Axios API behavior.

To run the Vitest test suite:
```bash
npm run test
```

## 🔐 Security Features
- Passes JWT Tokens strictly through encrypted `Authorization: Bearer <token>` Headers globally via generic Axios interceptors.
- Implements `ProtectedRoute` wrapper guarding components to prevent unauthenticated access. 
- Frontend roles dictating Dashboard logic (`admin` vs `user`) strictly mirror backend enforcement. Bypassing frontend UI will still result in API `403 Forbidden` errors.

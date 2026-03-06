<div align="center">
  <h1 align="center">OmniTask Everywhere</h1>
  <p align="center">
    A comprehensive full-stack task management platform built with React, Tailwind CSS, and FastAPI.
  </p>
</div>

<br />

## 🌟 Overview

**OmniTask** is a modern, responsive, and secure task management solution. It features a robust Python FastAPI backend for high-performance API delivery and a rich React frontend engineered for a premium user experience.

The platform provides comprehensive JWT-based authentication, role-based access control (`admin` and `user`), and complete CRUD capabilities for seamless task management.

## ✨ Key Features

### 🎨 Frontend UI/UX
- **Premium Aesthetics**: Crafted with Tailwind CSS v4 featuring glassmorphism surfaces, soft shadows, and dynamic micro-interactions.
- **Responsive Layout**: Fully responsive mobile-first design ensuring a great experience on any device.
- **Client-side Validation**: Instant feedback via React Hook Form and Yup validation schema.
- **State Management**: Robust Context API combined with automated Axios interceptors for JWT token lifecycle management.

### ⚙️ Backend Architecture
- **JWT Authorization**: Secure endpoint protection issuing transient JWT tokens upon login.
- **Role-Based Access Control**:
  - `User`: Can manage their own tasks.
  - `Admin`: Global capabilities to manage all platform tasks and individual user accounts.
- **Data Persistence**: SQLAlchemy ORM integrated with SQLite for reliable data storage.
- **Interactive Documentation**: Auto-generated OpenAPI Swagger documentation available out-of-the-box.

---

## 🛠️ Tech Stack

### Frontend Client
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4 + Lucide React (Icons)
- **Data Fetching**: Axios
- **Testing**: Vitest + Testing Library

### Backend API
- **Framework**: FastAPI (Python 3.9+)
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: PyJWT + Passlib (bcrypt)
- **Validation**: Pydantic
- **Testing**: Pytest + HTTPX

---

## 🚀 Getting Started

To run the full stack locally, you will need to start both the backend API and the frontend development server.

### 1. Repository Setup

Clone the repository to your local machine:
```bash
git clone https://github.com/your-username/omnitask-everywhere.git
cd omnitask-everywhere
```

### 2. Backend Setup

1. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   # source venv/bin/activate
   ```
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Set up Environment Variables:**
   Copy `.env.example` to `.env` (or configure the `SECRET_KEY` directly).
4. **Start the FastAPI server:**
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```
   *The API will be available at `http://localhost:8000`*
   *Interactive Docs: `http://localhost:8000/docs`*

### 3. Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Setup environment:**
   Copy `.env.example` to `.env`. Ensure `VITE_API_URL` points to the backend (default: `http://localhost:8000`).
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start the Vite development server:**
   ```bash
   npm run dev
   ```
   *The application will be available at `http://localhost:5173`*

---

## Endpoints Overview

### Authentication
- `POST /auth/register` - Register a new account
- `POST /auth/login` - Authenticate and receive JWT token

### Tasks Management
- `POST /tasks/` - Create a new task
- `GET /tasks/` - Retrieve tasks (Scored by user role)
- `PUT /tasks/{task_id}` - Update a task
- `DELETE /tasks/{task_id}` - Delete a task

### User Management (Admin Only)
- `GET /users/` - Retrieve all registered users
- `DELETE /users/{user_id}` - Delete a user account

---

## 🧪 Testing

Both environments include comprehensive test suites to ensure maximum reliability.

### Backend Tests
```bash
# In the root directory (with venv activated)
pytest tests/
```

### Frontend Tests
```bash
# In the frontend directory
npm run test
```

## 📜 License

[MIT License](LICENSE)

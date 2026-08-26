# Task & Team Management Platform

## Project Overview

A robust, full-stack Task & Team Management Platform designed for personal and team productivity. This application allows users to create, organize, assign, and track tasks with a seamless, highly responsive, and beautiful user interface. It features secure JWT-based authentication, an intuitive dashboard with metric tracking, and a comprehensive suite of task management tools.

## Features

### Authentication & Security
- **Secure Access:** Complete JWT-based authentication flow (Register, Login, Logout).
- **Encrypted Credentials:** Passwords are securely hashed using `bcrypt` before database storage.
- **Persistent Sessions:** "Remember Me" functionality utilizing intelligent local/session storage logic.
- **Route Protection:** Frontend React routes are strictly protected against unauthorized access.
- **API Security:** Backend REST APIs are guarded by robust authorization middleware, ensuring users can only interact with tasks they own or are explicitly assigned to.

### Task Management
- **Full CRUD Operations:** Create, Read, Update, and Delete tasks.
- **Rich Task Metadata:** Every task tracks its Title, Description, Priority (Low, Medium, High), Status (Pending, In Progress, Completed), Due Date, and the Assigned User.
- **Team Collaboration:** Ability to dynamically assign tasks to other registered members of the platform.
- **Robust Authorization:** 
  - Only the task creator or the assigned user can edit a task's status or details.
  - Only the original task creator is permitted to permanently delete the task.

### Dashboard & Analytics
- **At-a-Glance Metrics:** A centralized dashboard displays real-time statistics including Total Tasks, Pending Tasks, In Progress Tasks, and Completed Tasks.
- **Dynamic Layout:** Responsive sidebar and top navigation for seamless platform traversal.

### Advanced Filtering & Search
- **Text Search:** Instantly search for specific tasks by their title.
- **Categorical Filtering:** Filter the task board by specific Statuses or Priorities.
- **Chronological Sorting:** Sort all active tasks by their Due Date.

### Premium UI/UX Experience
- **Dark Mode Aesthetic:** A sleek, "Professional Black" aesthetic utilizing Shadcn UI components.
- **Responsive Design:** Fully responsive layout that adapts to desktop, tablet, and mobile views.
- **Instant Feedback:** Graceful, non-intrusive toast notifications (via `sonner`) for all user actions and error handling.
- **Graceful Error Handling:** Comprehensive global error catching for Network Errors, 404s, Unauthorized Access (401), and API validation failures.

## Tech Stack

### Frontend (Client)
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS v4 & Shadcn UI
- **Network Requests:** Axios (with custom request/response interceptors)

### Backend (Server)
- **Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt.js

## API Documentation

The backend exposes a fully RESTful API architecture. Requests and responses are formatted in JSON.

### Authentication Endpoints
| Method | Endpoint      | Description |
|--------|--------------|-------------|
| POST   | `/register`  | Register a new user account |
| POST   | `/login`     | Authenticate a user and return a JWT |
| GET    | `/users`     | Retrieve a list of all registered users (for assignment) |

### Task Endpoints
*Note: All task endpoints require a valid JWT passed in the `Authorization: Bearer <token>` header.*

| Method | Endpoint      | Description |
|--------|--------------|-------------|
| GET    | `/tasks`     | Retrieve all tasks created by or assigned to the authenticated user |
| GET    | `/tasks/:id` | Retrieve details of a specific task |
| POST   | `/tasks`     | Create a new task |
| PUT    | `/tasks/:id` | Update an existing task (Requires Creator or Assignee privileges) |
| DELETE | `/tasks/:id` | Delete a task (Requires Creator privileges) |

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB Atlas account and connection string

### 1. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory:
   ```env
   PORT=8080
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` directory:
   ```env
   VITE_BACKEND_URL=http://localhost:8080
   ```
4. Start the frontend Vite server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

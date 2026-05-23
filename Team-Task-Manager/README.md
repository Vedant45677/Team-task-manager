# Team Task Manager 🚀

A high-performance, full-stack project coordination platform featuring dynamic role-based workspaces, team member assignments, and an interactive status board.

---

## ✨ System Features

### 👤 Role-Based Controls & Workspaces
- **Workspace Admins**: Command center capability. Full CRUD privileges over projects and tasks. Can recruit and assign registered users to project scopes.
- **Team Members**: Collaborative workflow capability. Access assigned project spaces and track active tasks. Empowered to update the status coordinate of tasks assigned directly to them.

### 📊 Real-Time Operations Dashboard
- **Aggregate Analytics**: real-time cards tracking **Total Tasks**, **Active Operations** (Pending & In Progress), **Completed Achievements**, and **Overdue Milestones** (automatically calculated when deadlines lapse).
- **Interactive Completion Charts**: Dynamic visual representations tracking the progress of project workflows.
- **Auditing Logs**: Live action feed tracking recent changes across the workspace.

### 📋 Interactive Task Kanban Board
- **Fluid Status Columns**: Interactive boards organizing tasks into **Pending**, **In Progress**, and **Completed**.
- **Progression Controls**: Visual indicators allowing assignees to swap task states.
- **Metadata Badges**: Quick visual cues for task priority levels, deadlines, and assigned team members.

---

## 🛠️ Technology Stack

- **Frontend Core**: React (Vite), Tailwind CSS (Premium B2B SaaS Light Theme), Lucide Icons
- **HTTP client**: Axios with automated Interceptors
- **Client Routing**: React Router v6 with Auth & Role protected guards
- **Backend Runtime**: Node.js & Express.js
- **Database Engine**: MongoDB via Mongoose ORM
- **Authentication**: JWT-based stateless tokens & Bcrypt password hashing

---

## 📦 Project Structure

```
team-task-manager/
├── backend/                  # RESTful API Express Server
│   ├── config/               # Database connectivity configurations
│   ├── controllers/          # Business logic handlers (Auth, Projects, Tasks)
│   ├── middleware/           # JWT authenticators, role checkers, error catchers
│   ├── models/               # Mongoose DB Schemas (User, Project, Task)
│   └── routes/               # API Router mounts
├── frontend/                 # Vite SPA Client App
│   ├── src/
│   │   ├── components/       # Pages layout & navigation bars
│   │   ├── context/          # Global Auth state provider
│   │   ├── hooks/            # Axios instance with interceptors
│   │   ├── pages/            # View components (Dashboard, Kanban board, Projects)
│   │   └── router/           # Navigation routes & guards
│   └── tailwind.config.js    # Custom brand styles
└── README.md
```

---

## 🚀 Fast-Track Local Installation

### Prerequisites
- [Node.js](https://nodejs.org) (v18+ recommended)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB running)

### 1. Configure the API Server (Backend)
Navigate to the backend directory, initialize dependencies, and configure environment keys.
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```ini
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_complex_signing_key_here
NODE_ENV=development
```
Start the backend server in development mode:
```bash
npm run dev
# Server will launch on http://localhost:5000
```

### 2. Configure the Client Application (Frontend)
Navigate to the frontend directory, install scaffolding packages, and set up development keys.
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend/` directory:
```ini
VITE_API_BASE_URL=http://localhost:5000
```
Start the development Vite web server:
```bash
npm run dev
# Client app will launch on http://localhost:5173
```

---

## 🚦 API Route Documentation

### 🔐 Authentication (`/api/auth`)
- `POST /signup` - Register user. Body: `{ name, email, password, role }` (Public)
- `POST /login` - Sign-in credentials verification. Body: `{ email, password }` (Public)
- `GET /profile` - Fetch current user profile details (Protected)
- `GET /users` - Retrieve lists of registered workspace users (Protected)

### 📂 Workspaces (`/api/projects`)
- `GET /` - Fetch all projects matching user permissions (Protected)
- `POST /` - Create a new project. Body: `{ name, description, members, deadline }` (Protected - Admin Only)
- `PUT /:id` - Update project details (Protected - Admin Only)
- `DELETE /:id` - Delete project and all associated tasks (Protected - Admin Only)

### 📋 Milestones & Tasks (`/api/tasks`)
- `GET /project/:projectId` - Get all tasks inside a project (Protected)
- `POST /` - Create a task. Body: `{ title, description, project, assignee, priority, deadline }` (Protected - Admin Only)
- `PUT /:id` - Update task parameters (Protected - Admins edit all, Members edit status only for assigned tasks)
- `DELETE /:id` - Delete task (Protected - Admin Only)
- `GET /dashboard` - Fetch aggregated task statistics and recent activity logs (Protected)

---

## ⚡ Demo Testing Guide

To experience the platform's role permissions:

1. **Register Admin**: Sign up on `/signup` with role **Workspace Admin**.
2. **Register Member**: Sign up a second user with role **Team Member**.
3. **Build Workspace (Admin)**: Log in as the Admin, go to **Projects**, click **New Project**, title it, select the Member checkbox, and submit.
4. **Deploy Tasks (Admin)**: Enter the project card, click **Add Task**, assign it to your Member, set a high priority, select a deadline, and create.
5. **Update Coordinates (Member)**: Log out and log in as the Member. You'll see the assigned task. Click **Update Status** or use the action arrows on the Kanban board to advance the card to **In Progress** or **Completed**.
6. **Verify Access (Member)**: Notice that as a Member, you cannot create projects or delete tasks. Attempting unauthorized updates will result in graceful UI warnings.

---

## 🌐 Production Deployment Guide

### Database Setup
1. Spin up a free M0 Cluster on MongoDB Atlas.
2. In network access, set IP access to `0.0.0.0/0` (allowing serverless access).
3. Create a DB User with readWrite permissions.

### Backend Hosting (Railway or Render)
1. Link your git repository.
2. Direct build command to target `backend/package.json`. Start command: `node backend/server.js`.
3. Set environment variables matching your backend `.env` keys.

### Frontend Hosting (Vercel)
1. Connect Vercel to your git repository.
2. Configure the root directory setting to `frontend/`.
3. Add the `VITE_API_BASE_URL` environment key pointing to your live backend endpoint.

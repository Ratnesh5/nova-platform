# NOVA — Team Productivity Platform
> **Tagline**: *Plan. Collaborate. Deliver.*

**NOVA** is an enterprise-grade full-stack project management application built to help engineering, product, and design teams organize complex initiatives, manage multi-stage sprint tasks, collaborate in real time, and gain visual delivery intelligence from a unified interface.

---

## 🌟 Key Highlights & Features

### 1. 🔐 Authentication & Role-Based Access Control (RBAC)
- **JWT Session Security**: Secure password hashing with bcrypt, JSON Web Token cookie/header authentication, and protected API endpoints.
- **1-Click Evaluator Demo Accounts**: Instant demo login buttons on the login page and sidebar (Alex Rivera — Lead Admin, Sarah Chen — Frontend, Elena Rostova — Designer).
- **Multi-Role Permissions**: Supports `ADMIN`, `MEMBER`, and `VIEWER` roles with tailored capabilities.

### 2. 📁 Multi-Project Workspaces & Roadmaps
- **Project Directory**: Grid/Card view with category filters (`Engineering`, `Design`, `Product`, `Marketing`, `Operations`, `Security`), progress indicators, key prefix tags (e.g., `NOVA`, `MOB`, `DSN`, `SEC`), and active members.
- **Project Creation & Customization**: Create custom projects with budget tracking, deadlines, category classification, and custom hex color theme branding.
- **Dynamic Progress Calculation**: Project completion percentage automatically computed from linked task completion states.

### 3. 📋 Kanban Board & Interactive Task Management
- **4-Stage Kanban Workflow**: Drag-and-drop / 1-click status transitions between `To Do` → `In Progress` → `In Review` → `Done`.
- **List / Table View**: Sortable and filterable table with quick inline status updates and priority badges.
- **Subtask Checklists**: Add checklist steps, toggle checkboxes with progress bar computation.
- **Team Discussion & Comments**: Leave timestamped comments on any task card.
- **Task Metadata**: Due dates, estimated vs. actual hours, assignees, and priority tags (`Urgent`, `High`, `Medium`, `Low`).

### 4. 👥 Team Directory & Workload Management
- **Collaborator Directory**: View team members, job titles, departments, and active project assignments.
- **Workload Distribution**: Visual capacity indicators showing completed vs. active tasks assigned to each team member.

### 5. 📈 Productivity Analytics & Intelligence
- **Interactive KPI Dashboard**: Real-time delivery velocity rate, total work items, and hours spent vs. estimated.
- **Recharts Data Visualizations**: Donut charts for task stage breakdown, bar charts for priority urgency matrix, and project health progress bars.
- **Audit & Activity Feed**: Chronological live feed logging task moves, creations, comments, and project updates.
- **Export Reports**: 1-click download of executive analytics reports in CSV format.

### 6. 🔄 1-Click Database Reset & Demo Seeder
- Included `/api/seed` endpoint and UI "Reset Sample Data" button to instantly restore realistic mock data anytime for testing and evaluation.

---

## 🏗️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | **Next.js 16 (App Router)** + **React 19** + **TypeScript** |
| **Styling & Aesthetics** | **Tailwind CSS v4** + Custom Glassmorphism Theme & Dark Mode Tokens |
| **Icons & Visuals** | **Lucide-React** |
| **Data Visualizations** | **Recharts** |
| **Database & ORM** | **Prisma ORM** + **SQLite** (instant local database, Postgres ready) |
| **Authentication** | **JWT (jsonwebtoken)** + **bcryptjs** password encryption |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0 or higher
- **npm** or **yarn** / **pnpm**

### 2. Installation
```bash
# Clone or navigate to the repository directory
cd sanskar

# Install project dependencies
npm install
```

### 3. Database Setup & Seeding
```bash
# Push Prisma schema to SQLite database
npx prisma db push

# (Optional) Seed database with realistic projects, tasks, and users
# Or simply hit http://localhost:3000/api/seed or use the 1-click button in the UI
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🔑 Demo Login Credentials

For quick evaluation, you can use the **1-Click Demo Login** buttons on the login page or enter credentials manually:

| Persona | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Alex Rivera** (Lead) | `alex@nova.io` | `password123` | `ADMIN` |
| **Sarah Chen** (Frontend) | `sarah@nova.io` | `password123` | `MEMBER` |
| **Marcus Johnson** (Backend) | `marcus@nova.io` | `password123` | `MEMBER` |
| **Elena Rostova** (Design) | `elena@nova.io` | `password123` | `MEMBER` |
| **David Kim** (QA / Sec) | `david@nova.io` | `password123` | `MEMBER` |

---

## 📡 REST API Architecture

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT |
| `POST` | `/api/auth/demo` | 1-Click demo authentication session |
| `GET / POST` | `/api/auth/me` | Fetch active session / Logout |
| `GET / POST` | `/api/projects` | List filtered projects / Create project |
| `GET / PUT / DELETE` | `/api/projects/:id` | Project details, updates, deletion |
| `POST / DELETE` | `/api/projects/:id/members` | Add / Remove project member |
| `GET / POST` | `/api/tasks` | List filtered tasks / Create task |
| `GET / PUT / DELETE` | `/api/tasks/:id` | Task details, status change, deletion |
| `POST / PUT / DELETE` | `/api/tasks/:id/subtasks` | Subtask checklist management |
| `GET / POST` | `/api/tasks/:id/comments` | Task discussion comments |
| `GET` | `/api/users` | Team directory & workload counts |
| `GET` | `/api/analytics` | Global metrics, charts & velocity data |
| `POST` | `/api/seed` | Reset & reseed database with sample data |

---

## 🛠️ Build & Production
```bash
# Build optimized production bundle
npm run build

# Start production server
npm run start
```

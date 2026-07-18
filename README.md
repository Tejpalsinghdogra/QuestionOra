# QuestionOra (React + Express + MongoDB)

QuestionOra is a student-driven, multi-role academic platform dedicated to hosting and organizing previous year question papers of GNA University. It allows students to easily search and download past Mid-Semester Examinations (MSE) and End-Semester Examinations (ESE), organized by campus blocks and departments.

---

## Project Architecture

The project is structured as a full-stack JavaScript application:
- **Client (Frontend):** Built with React 19, Vite, React Router (v7), and Vanilla CSS styling.
- **Server (Backend):** Built with Node.js, Express, MongoDB (using Mongoose ODM), JWT-based session security, and Cloudinary storage integration for file uploads.

---

## Database Schemas & Models

### 1. User Model (server/models/User.js)
Stores account information and assigns access levels (User, Teacher, Admin).
- `name` (String, required, trimmed)
- `email` (String, required, unique, lowercase)
- `password` (String, required)
- `role` (String, enum: `['user', 'teacher', 'admin']`, default: `'user'`)
- `isActive` (Boolean, default: `true` - checked upon login to control account suspension)

### 2. Paper Model (server/models/Paper.js)
Tracks the question papers uploaded to the platform.
- `title` (String, required - e.g., "DAA 2024 MSE")
- `department` (String, required - e.g., "BtechCSE", "Bca")
- `semester` (String, required - e.g., "Sem-1", "Sem-2")
- `year` (Number, required)
- `type` (String, enum: `['MSE', 'ESE']`, required)
- `fileUrl` (String, required - secure Cloudinary asset url)
- `uploadedBy` (ObjectId ref User, required)
- `status` (String, enum: `['active', 'rejected', 'removed']`, default: `'active'`)
- `statusMessage` (String, default: `""` - admin notes for rejection or removal)
- `downloads` (Number, default: `0` - tracks overall download usage)

### 3. Report Model (server/models/Report.js)
Tracks flagged or problematic question papers reported by users.
- `paperId` (ObjectId ref Paper, required)
- `reportedBy` (ObjectId ref User)
- `reason` (String, required)
- `status` (String, enum: `['pending', 'resolved']`, default: `'pending'`)

---

## Portals & Roles

### Student Portal (Public & Basic Users)
- **Home Navigation:** Select course blocks:
  - **Block-A** (Business, Science, Hospitality, Design, Sports, Liberal Arts)
  - **Block-B** (Engineering, Computational Sciences)
  - **Block-C** (Allied Health, Pharmacy)
- **Course Selection & Search:** Select an undergraduate program to filter question papers by semester and view both MSE and ESE exams.
- **Paper Downloading:** Instant download tracking (resolves to attachments through Cloudinary).

### Teacher Portal (/teacher)
Allows authenticated teachers/admins to upload and maintain academic resources:
- **Upload Form:** Upload PDF/images specifying metadata (Title, Department, Semester, Year, and Exam Type).
- **Manage Submissions:** Edit metadata, replace uploaded documents (safe-cleanup of Cloudinary resources), and permanently delete papers.
- **Audit Tool:** View download counts and check submission status (Active, Rejected, Removed).
- **Notifications:** Receive status tooltips for rejected uploads.

### Admin Portal (/admin)
Provides site-wide administration dashboard features:
- **Interactive Dashboard:** Site-wide statistics (Total/Active Papers, Total Downloads, User breakdown, and Department distributions).
- **Teacher Control:** Appoint new teachers using registered emails and toggle their active/inactive status.
- **Moderation:** Review all uploads, change paper statuses, and hard-delete files from databases and Cloudinary.
- **Reports Resolution:** Review flagged paper reports and resolve issues.
- **Audit Logs:** Full logging table showing upload details, timestamps, and download tracking.

---

## Feature & Implementation Checklist

Below is the implementation progress map across the codebase:

- [x] **Core Authentication:** Secure login, registration, JWT middleware validation, and account state checks.
- [x] **Paper Storage Integration:** Cloudinary configurations with Multer file streams and secure file deletions.
- [x] **Teacher & Admin Portals:** Dashboards, stats calculations, database aggregations, and CRUD controls.
- [ ] **Course Page Mapping (Block-A & Block-C):**
  - Block-B is fully completed.
  - **Block-A** has 15 out of 16 courses currently using dummy `#` links.
  - **Block-C** has all 7 courses pointing to `#`.
  - Additional course mappings must be configured inside `courseDataMapping` in [CoursePage.jsx](file:///Users/tejpalsingh01/Desktop/Projects/QuestionOra%20React/src/pages/CoursePage.jsx).
- [ ] **Flag/Report Button UI:**
  - Backend route (`/api/reports`) and Admin UI exist.
  - No frontend button exists on the public Course page for users to submit a report.
- [ ] **Feedback Persistence:**
  - Feedback page ([Feedback.jsx](file:///Users/tejpalsingh01/Desktop/Projects/QuestionOra%20React/src/pages/Feedback.jsx)) is a client-only mock. Must construct Mongoose schema and database submission routes.
- [ ] **Navbar User State:**
  - Login/SignUp buttons always show up in [Navbar.jsx](file:///Users/tejpalsingh01/Desktop/Projects/QuestionOra%20React/src/components/Navbar.jsx) regardless of authentication.
  - Sidebar logout link is currently a dummy `#` placeholder.
- [ ] **Download Protection Alignment:**
  - FAQ indicates downloading is restricted to registered users, but the API and frontend currently allow fully public anonymous downloads.

---

## How to Run

### Prerequisite Environment Variables (server/.env)
Create a `.env` file inside the `server/` directory:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/questionora
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Server and Client Commands
Install dependencies in both the root folder and the `server` folder, then use the root scripts:
```bash
# Run both client (Vite) and server concurrently
npm run dev:all

# Run only client
npm run dev

# Run only server
npm run dev --prefix server
```

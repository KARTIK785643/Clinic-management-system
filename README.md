# 🏥 CareSync - Clinic Appointment & Queue Management System

CareSync is a premium, full-stack, role-based clinic management and appointment system. It is designed to streamline healthcare scheduling by connecting patients, doctors, and administrators in a unified, beautiful, and highly intuitive digital ecosystem. 

Featuring a **live queue token system**, role-based authentication, and a responsive glassmorphism UI, CareSync completely replaces outdated booking workflows with a state-of-the-art clinic experience.

---

## ✨ Features

### 👤 Patient Portal
* **Secure Registration & Login**: Multi-step registration form with built-in validation.
* **Smart Appointment Booking**: Browse active doctors, select appointment times, and book visits.
* **Live Queue Tracking**: View active token queue numbers in real-time to minimize waiting times.
* **History Management**: Check upcoming and historical appointments.

### 🩺 Doctor Portal
* **Interactive Dashboard**: Track schedules, view detailed patient logs, and see your daily queue.
* **Consultation Controls**: Call the next patient in the queue or mark a patient's consultation status.
* **Profile Management**: Maintain clean professional descriptions, specialties, and consult fees.

### 👑 Admin Dashboard
* **Dynamic Clinic Overview**: Live stats dashboard showcasing total appointments, active doctors, registered patients, and today's queue size.
* **Doctor Management**: Add new doctors, edit existing profile details, change consultation statuses, and delete doctors.
* **Appointment Tracking**: Full monitoring of all appointments in the system.

---

## 🛠️ Technology Stack

### **Frontend**
* **Core**: React 19 (Hooks, Context)
* **Build Tool**: Vite (Ultra-fast Hot Module Replacement)
* **Routing**: React Router DOM (v7)
* **Styling**: Vanilla CSS (Harmonious custom-tailored dark modes, smooth gradients, and glassmorphic micro-interactions)

### **Backend**
* **Server**: Node.js, Express.js (v5)
* **Database**: MongoDB Atlas with Mongoose ODM
* **Security**: JSON Web Tokens (JWT) for secure authentication, BcryptJS for password hashing, and CORS middleware for secure API request routing.

---

## 📂 Repository Structure

```bash
Clinic-management-system/
├── backend/                  # Express.js REST API Server
│   ├── config/               # Database Connection & Config
│   ├── controllers/          # Business logic for Patients, Doctors, Admin, and Queues
│   ├── middleware/           # Authentication & security handlers
│   ├── models/               # MongoDB Mongoose Schemas (Patient, Doctor, Appointment)
│   ├── routes/               # Express API Route endpoints
│   ├── .env                  # Environment Variables (ignored by Git)
│   └── server.js             # Main server entrypoint
│
└── clinic-appointment/       # React 19 Frontend Web App
    ├── src/
    │   ├── components/       # Reusable React components (AddDoctor, etc.)
    │   ├── pages/            # Page layouts (Login, Register, Patient/Doctor/Admin Dashboards)
    │   ├── styles/           # Premium cohesive CSS styling modules
    │   ├── App.jsx           # Routing & application state controller
    │   └── main.jsx          # Mount point & global fetch API interceptor
    └── vite.config.js        # Vite build & proxy settings
```

---

## 🚀 Getting Started (Local Development)

### **1. Prerequisites**
* Node.js installed (v18+ recommended)
* MongoDB Atlas cluster or local MongoDB instance

### **2. Setup the Backend**
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `backend` folder and populate it:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ADMIN_EMAIL=admin@admin.com
   ADMIN_PASSWORD=admin123
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```

### **3. Setup the Frontend**
1. Navigate to the frontend directory:
   ```bash
   cd ../clinic-appointment
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## ☁️ Production Deployment

### **Backend (on Render)**
1. Host your `backend` directory as a **Web Service**.
2. Configure the build/start commands:
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
3. Add your environment variables (`MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`) securely in the Render dashboard.

### **Frontend (on Vercel)**
1. Host your `clinic-appointment` folder as a project.
2. Under **Environment Variables**, add:
   * `VITE_API_URL` = `https://your-backend-url.onrender.com` (Do not worry about trailing slashes, they are sanitized automatically).
3. Deploy!

---

## 🔒 Security Best Practices
* **Zero exposed credentials**: Your `.env` files are completely ignored using a global `.gitignore` layout.
* **Dynamic API Sanitization**: All endpoint calls dynamically sanitize trailing slashes to prevent server routing bypass or standard double-slash `404` errors in cloud hosting environments.

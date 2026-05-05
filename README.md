# 🏫 e-हाज़री | Smart Attendance Portal

![Smart Attendance Banner](./assets/banner.png)

A premium, full-stack attendance management system with a modern **Sage Green** aesthetic, designed for schools and educational institutions.

---

## ✨ Features

- **🔐 Secure Authentication**: Role-based access control with JWT-protected routes.
- **📊 Interactive Dashboard**: Real-time analytics with weekly and monthly attendance trends.
- **👨‍🎓 Student Management**: Comprehensive CRUD operations for student profiles.
- **📅 Smart Attendance**: Effortless daily attendance marking with bulk status updates.
- **📁 Data Export**: Export attendance records and student data for administrative use.
- **🎨 Premium UI/UX**: Sage Green theme with glassmorphism, smooth animations, and responsive layouts.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: Vanilla CSS (Custom Variable System)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: React Hooks (useState, useEffect, useContext)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via [Mongoose](https://mongoosejs.com/))
- **Auth**: [JSON Web Tokens (JWT)](https://jwt.io/) & [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)

---

## 📂 Project Structure

```text
SmartAttendance_portal/
├── frontend/               # React + Vite Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page layouts (Dashboard, Attendance, etc.)
│   │   ├── services/       # API integration layers
│   │   └── assets/         # Static images and styles
│   └── package.json
├── backend/                # Express + Node.js Backend
│   ├── models/             # Mongoose schemas (Student, Attendance, User)
│   ├── routes/             # API endpoints (Auth, Students, Attendance)
│   ├── config/             # DB connection and middleware
│   ├── seed.js             # Initial database seeding script
│   └── server.js           # Entry point
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/shreyashagrawal00/SmartAttendance_portal.git
cd SmartAttendance_portal
```

### 2. Environment Setup
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 3. Backend Installation
```bash
cd backend
npm install
# Seed the database (Optional)
node seed.js
# Start server
npm start
```

### 4. Frontend Installation
```bash
cd ../frontend
npm install
# Start development server
npm run dev
```

---

## 📸 Screenshots & UI

> [!TIP]
> **Sage Green Theme**: The application uses a custom-built Sage Green theme (`#5F7161`, `#6D8B74`, `#EFEAD8`) for a calm and professional educational environment.

- **Dashboard**: High-level metrics with interactive Recharts.
- **Attendance Board**: Easy "Mark All" functionality with real-time status updates.
- **Student Profile**: Detailed view of attendance history and performance.

---

## 🛡️ Authentication
Default Admin Credentials (if seeded):
- **Email**: `admin@school.com`
- **Password**: `password123`

---

## 🚀 Deployment

The project is configured for easy deployment on **Vercel**.

1.  **Backend**: Deploy your Node.js/Express server (ensure `MONGO_URI` is set in Vercel environment variables).
2.  **Frontend**: Deploy the `frontend/` directory (the provided `vercel.json` already handles the build process).
    - Build Command: `npm run build`
    - Output Directory: `dist`

---

## 🤝 Contributing
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
## Contribution
- Improved documentation clarity and formatting.

**Developed with ❤️ by Shreyash Agrawal**

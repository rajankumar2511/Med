# 🏥 Medislot – Doctor Appointment Booking Platform

Medislot is a full-stack MERN-based web application that enables patients to book doctor appointments by selecting real-time available slots. It also provides doctors with tools to manage availability, appointments, and profiles, along with secure authentication and payment support using Razorpay.

---

## 🚀 Key Features

### 👤 Patient Features
- Secure user authentication (JWT-based)
- Browse doctors by specialization
- View real-time availability slots
- Book appointments seamlessly
- Online payment integration using Razorpay
- View appointment history
- Responsive UI

### 👨‍⚕️ Doctor Features
- Doctor signup & login
- Role-based access control
- Slot and availability management
- View and manage booked appointments
- Profile management dashboard

---

## 🧠 Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS**
- **Axios** (API requests)
- **React Context API** (state management)
- **React Router DOM**

### Backend
- **Node.js**
- **Express.js**
- **JWT Authentication**
- **Bcrypt** (password hashing)
- **Middleware-based architecture**

### Database
- **MongoDB**
- **Mongoose ODM**

### Payments
- **Razorpay Payment Gateway**
  - Secure checkout
  - Order creation from backend
  - Payment verification using Razorpay signature

---

## 📁 Project Folder Structure

```
medislot/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── appointment.controller.js
│   │   │   ├── auth.controller.js
│   │   │   └── doctor.controller.js
│   │   │
│   │   ├── lib/
│   │   │   └── db.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── protect.js
│   │   │   └── role.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── appointment.model.js
│   │   │   ├── doctor.model.js
│   │   │   └── user.js
│   │   │
│   │   └── routes/
│   │       ├── appointment.routes.js
│   │       ├── auth.route.js
│   │       └── doctor.route.js
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── context/
│   │   │   └── DoctorContext.jsx
│   │   │
│   │   ├── lib/
│   │   │   ├── api.js
│   │   │   └── axios.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Doctors.jsx
│   │   │   ├── Doctorsdetail.jsx
│   │   │   ├── BookAppointment.jsx
│   │   │   ├── MyAppointments.jsx
│   │   │   ├── Myprofile.jsx
│   │   │   ├── Myprofdoc.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   └── Contact.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🔐 Authentication & Security
- JWT-based secure authentication
- Password hashing using bcrypt
- Protected routes with middleware
- Role-based access (Doctor / Patient)

---

## 💳 Razorpay Integration Flow

1. Backend creates Razorpay order
2. Frontend opens Razorpay checkout
3. User completes payment
4. Razorpay sends payment signature
5. Backend verifies payment authenticity
6. Appointment is confirmed

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB

### Clone Repository
```bash
git clone https://github.com/your-username/medislot.git
cd medislot
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

Create `.env`
```
PORT=4000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📈 Future Improvements
- Admin analytics dashboard
- Email/SMS appointment reminders
- Video consultation
- Prescription uploads
- Refund handling via Razorpay

---

## 📄 License

MIT License

Copyright (c) 2026 Medislot

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.

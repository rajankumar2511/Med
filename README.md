# 🏥 MediSlot

> A scalable healthcare appointment platform built with modern backend architecture, distributed systems principles, and asynchronous processing.

![Node.js](https://img.shields.io/badge/Node.js-22+-green)
![React](https://img.shields.io/badge/React-19-blue)
![Express](https://img.shields.io/badge/Express.js-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue)
![Redis](https://img.shields.io/badge/Redis-red)
![Prisma](https://img.shields.io/badge/Prisma-2D3748)
![License](https://img.shields.io/badge/License-MIT-green)

## Overview

MediSlot is a full-stack healthcare appointment booking platform designed with production-oriented backend architecture. It enables patients to discover doctors, book appointments, complete secure payments, and receive automated notifications while demonstrating scalable backend engineering concepts such as CQRS, Saga Pattern, Redis caching, BullMQ workers, and asynchronous workflows.

The project focuses on building reliable, maintainable, and scalable backend services rather than only implementing CRUD functionality.

---

## Features

### Patient Portal

- Secure user registration and authentication
- Browse doctors by specialization
- Book appointments
- Cancel appointments
- View appointment history
- Secure online payment
- AI-powered medical assistant
- Nearby medical store locator
- Responsive user interface

### Doctor Portal

- Secure doctor authentication
- Manage profile
- View appointments
- Update availability
- Appointment management

### Platform Features

- Appointment confirmation emails
- Reminder email scheduling
- Background job processing
- Redis-powered caching
- AI integration
- Payment gateway integration
- Secure authentication
- Image upload support

---

# Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router

## Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- Redis
- BullMQ
- JWT Authentication
- Nodemailer
- Cloudinary

---

# Architecture

```
                React Frontend
                      │
                      │ REST APIs
                      ▼
              Express.js Backend
          ┌───────────┼────────────┐
          │           │            │
          ▼           ▼            ▼
     PostgreSQL     Redis      BullMQ Queue
          │           │            │
          │           │            ▼
          │           │      Background Workers
          │           │
          ▼           ▼
      Prisma ORM   Cache Layer

```

---

# Backend Engineering Highlights

This project demonstrates scalable backend engineering, distributed systems, and reliability patterns commonly used in production-grade applications.

---

## 🏗️ Architecture

- CQRS (Command Query Responsibility Segregation)
- Transactional Outbox Pattern
- Event-Driven Architecture
- RESTful API Design
- Clean Architecture

---

## 🗄️ Database & Concurrency

- PostgreSQL
- Prisma ORM
- Serializable Database Transactions
- Connection Pooling
- Idempotent APIs
- Concurrency-safe Appointment Booking

> **Note:** Add **Distributed Locking** here only if your final implementation still uses Redis locks (`SET NX EX`).

---

## ⚡ Caching

- Redis Cache
- Cache-Aside Pattern
- Cache Warming
- Cache Invalidation
- TTL-based Cache Eviction

---

## 🔄 Asynchronous Processing

- BullMQ
- Redis Queue
- Producer–Consumer Pattern
- Queue Workers
- Background Jobs
- Delayed Jobs
- Job Scheduling

---

## 🛡️ Reliability & Fault Tolerance

- Retry Mechanism
- Exponential Backoff
- Circuit Breaker
- Dead Letter Queue (DLQ)

---

## 🔐 Security

- JWT Authentication
- Role-Based Access Control (RBAC)
- HMAC Payment Signature Verification
- Password Hashing
- Protected REST APIs

---

## 💳 Payments

- Secure Razorpay Integration
- HMAC Signature Verification
- Atomic Payment Confirmation
- Transactional Payment Workflow

---

## 🤖 AI Integration

- LLM-powered Symptom Analysis
- Intelligent Doctor Recommendation
- AI-assisted Doctor Discovery

---

## 📧 Email System

- Nodemailer
- HTML Email Templates
- Appointment Confirmation Emails
- Appointment Reminder Emails
- Asynchronous Email Delivery

---

## ☁️ Deployment

- Vercel
- Render
- Neon PostgreSQL
- Upstash Redis

---

## 📐 System Design Patterns

- CQRS
- Transactional Outbox Pattern
- Event-Driven Architecture
- Cache-Aside Pattern
- Producer–Consumer Pattern
- Idempotent APIs
- Retry with Exponential Backoff
- Circuit Breaker
- Dead Letter Queue (DLQ)
- Serializable Transactions

---

## 🚀 Features

- Secure Authentication & Authorization
- Doctor Appointment Booking
- AI-powered Doctor Recommendation
- Online Payment Integration
- Appointment Confirmation & Reminder Emails
- Doctor Availability Management
- Admin Dashboard
- Doctor Dashboard
- Patient Dashboard

---

# Project Structure

```
MediSlot
│
├── backend
│   ├── prisma
│   ├── src
│   │   ├── commands
│   │   ├── queries
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── workers
│   │   ├── jobs
│   │   ├── services
│   │   ├── routes
│   │   └── utils
│   └── server.js
│
└── frontend
    ├── src
    ├── assets
    └── public
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/rajankumar2511/Med.git
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file and configure:

```
DATABASE_URL=

REDIS_URL=

JWT_SECRET_KEY=

EMAIL=

EMAIL_PASSWORD=

COHERE_API_KEY=

CLOUDINARY_NAME=

CLOUDINARY_KEY=

CLOUDINARY_SECRET=

RAZORPAY_KEY_ID=

RAZORPAY_SECRET=
```

Run database migrations

```bash
npx prisma migrate deploy
```

Generate Prisma Client

```bash
npx prisma generate
```

Start backend

```bash
npm start
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# Environment Variables

The application requires:

| Variable | Description |
|-----------|-------------|
| DATABASE_URL | PostgreSQL Connection String |
| REDIS_URL | Redis Connection |
| JWT_SECRET_KEY | JWT Secret |
| EMAIL | SMTP Email |
| EMAIL_PASSWORD | SMTP Password |
| COHERE_API_KEY | AI API Key |
| CLOUDINARY_NAME | Cloudinary Cloud Name |
| CLOUDINARY_KEY | Cloudinary API Key |
| CLOUDINARY_SECRET | Cloudinary Secret |
| RAZORPAY_KEY_ID | Payment Key |
| RAZORPAY_SECRET | Payment Secret |

---

# Performance Features

- Redis Cache Layer
- Background Queue Processing
- Retry with Exponential Backoff
- Dead Letter Queue
- Connection Pooling
- Distributed Locking
- Rate Limiting
- Optimized Database Queries

---

# Security

- JWT Authentication
- Password Hashing
- Protected Routes
- CORS Configuration
- Environment Variables
- Rate Limiting
- Idempotent APIs

---

# Future Enhancements

- Video Consultation
- Real-time Notifications
- WebSocket Integration
- Appointment Analytics
- Admin Dashboard
- Docker Deployment
- Kubernetes
- CI/CD Pipeline
- Monitoring & Observability

---

# Screenshots

> Add screenshots of:
>
> - Home Page
> - Doctor Listing
> - Booking Page
> - Patient Dashboard
> - Doctor Dashboard
> - AI Assistant
> - Payment Page

---

# Live Demo

Frontend

```
Coming Soon
```

Backend API

```
Coming Soon
```

---

# Author

**Rajan Kumar**

- GitHub: https://github.com/rajankumar2511

---

# License

This project is licensed under the MIT License.

---

## If you found this project useful, consider giving it a ⭐ on GitHub.

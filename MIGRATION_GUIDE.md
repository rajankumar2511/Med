# MongoDB to PostgreSQL Migration Guide

## ✅ Completed Updates

All controllers, middleware, and services have been updated from MongoDB/Mongoose to PostgreSQL/Prisma:

### Files Updated:
1. **src/utils/password.js** (NEW) - Centralized password hashing
2. **src/controllers/auth.controller.js** - User signup/login with Prisma
3. **src/controllers/doctor.controller.js** - Doctor profile management
4. **src/controllers/apointment.controller.js** - Appointment booking
5. **src/controllers/medicalStore.controller.js** - Medical store operations
6. **src/controllers/map.controller.js** - Nearby doctors search
7. **src/middleware/protect.js** - JWT authentication with Prisma

---

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Database

Create `.env` file in the backend folder:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/doctor_db"

# JWT Secret
JWT_SECRET_KEY="your_jwt_secret_key_here"

# Server Port
PORT=5000

# API Keys (if using AI features)
COHERE_API_KEY="your_cohere_key"
GOOGLE_GENERATIVE_AI_KEY="your_google_ai_key"
```

### 3. Setup PostgreSQL Database

```bash
# If using PostgreSQL locally
createdb doctor_db

# Or using Docker:
docker run --name postgres_doctor -e POSTGRES_PASSWORD=password -e POSTGRES_DB=doctor_db -p 5432:5432 -d postgres:15
```

### 4. Run Prisma Migrations

```bash
# Apply all migrations
npx prisma migrate deploy

# Or if creating from scratch
npx prisma migrate dev --name init
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Start the Server

```bash
npm run dev
```

---

## 📊 Key Changes from MongoDB to PostgreSQL

### ID System
- **Before**: MongoDB ObjectId (`_id`)
- **After**: CUID (`id`)
- **Update in code**: `req.user._id` → `req.user.id`

### Working Hours
- **Before**: Object with start/end properties
- **After**: Separate `workingStart` and `workingEnd` fields (integers 0-24)

### Location Data
- **Before**: GeoJSON Point objects
- **After**: Separate `latitude` and `longitude` fields (floats)
- **Geospatial Queries**: Now use Haversine formula (implemented in medicalStore and map controllers)

### Appointment Status
- **Before**: `"no-show"`
- **After**: `"no_show"` (PostgreSQL enum)

### Field Naming
- **Before**: snake_case in some models (`owner_name`, `license_number`)
- **After**: camelCase throughout (`ownerName`, `licenseNumber`)

### API Request Adjustments
Update your frontend API calls to use new field names:

**Doctor Profile Creation:**
```javascript
// Before
{ hospital: "St. Mary", availableDays: ["Monday"] }

// After
{ 
  hospital: "St. Mary",
  workingDays: ["Monday"],
  location: { lat: 40.7128, lng: -74.0060, address: "..." }
}
```

**Medical Store:**
```javascript
// Before
{ owner_name: "John", license_number: "123" }

// After
{ ownerName: "John", licenseNumber: "123" }
```

---

## 🔍 Verification Checklist

- [ ] `.env` file created with DATABASE_URL
- [ ] PostgreSQL database running
- [ ] `npx prisma migrate deploy` completed successfully
- [ ] `npm install` dependencies installed
- [ ] Server starts with `npm run dev` without errors
- [ ] `/api/auth/me` endpoint accessible after login
- [ ] Doctor profile creation works
- [ ] Appointment booking functional

---

## 📝 Testing API Endpoints

### Authentication
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "patient"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Doctor Profile
```bash
# Create doctor profile (requires authentication)
curl -X POST http://localhost:5000/api/doctor/create \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=YOUR_JWT_TOKEN" \
  -d '{
    "specialization": "Cardiologist",
    "experience": 10,
    "phone": "9876543210",
    "consultationFee": 500,
    "workingDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "workingStart": 9,
    "workingEnd": 17,
    "appointmentsPerHour": 6,
    "location": {
      "lat": 40.7128,
      "lng": -74.0060,
      "address": "123 Medical Center, NYC",
      "city": "New York",
      "state": "NY"
    }
  }'

# Get all doctors
curl http://localhost:5000/api/doctor/getdocdata
```

### Appointments
```bash
# Book appointment
curl -X POST http://localhost:5000/api/appointments/book \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=YOUR_JWT_TOKEN" \
  -d '{
    "doctorId": "DOCTOR_ID",
    "date": "2026-07-14",
    "hour": 10,
    "reason": "General checkup"
  }'

# Get my appointments
curl http://localhost:5000/api/appointments/my \
  -H "Cookie: jwt=YOUR_JWT_TOKEN"
```

---

## ⚠️ Important Notes

1. **Password Hashing**: Now handled by centralized `src/utils/password.js`
2. **Geospatial Queries**: Replaced MongoDB's geo operators with manual Haversine formula
3. **Relationships**: Foreign keys properly configured in Prisma schema
4. **Enum Status**: Appointment status must use `no_show` (not `no-show`)
5. **Frontend Updates**: Update API calls if they reference old MongoDB field names

---

## 🐛 Troubleshooting

**Error: "DATABASE_URL not found"**
- Ensure `.env` file is created with proper DATABASE_URL

**Error: "relation does not exist"**
- Run: `npx prisma migrate deploy`

**Error: "Invalid enum value"**
- Check appointment status uses `no_show` not `no-show`

**Error: "Password comparison failed"**
- Ensure password utility is imported in auth controller

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [Haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula)

---

Generated: 2026-07-13 | Migration: MongoDB → PostgreSQL/Prisma

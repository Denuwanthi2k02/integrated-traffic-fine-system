# Integration Setup Guide - Driver Portal & Backend

## 🎯 What Has Been Done

Your **driver-portal** frontend has been fully integrated with the **backend** Java Spring Boot application with MySQL database support.

### Backend Updates
✅ **User Model** - Enhanced to support driver registration with email, phone, and license number  
✅ **Fine Model** - Updated with complete fields: reference number, category, amount, license plate, driver details, etc.  
✅ **DriverController** - New REST API endpoints for driver-specific operations  
✅ **Repositories** - Enhanced with driver search queries  
✅ **SecurityConfig** - Updated to allow driver routes (login, register, search)  
✅ **DatabaseSeeder** - Adds sample driver users and fine records on startup  

### Frontend Updates
✅ **.env Configuration** - Set up with backend API URL (localhost:8080)  
✅ **Login.jsx** - Updated to use `/api/driver/login` endpoint with email  
✅ **Register.jsx** - Enhanced with phone and license number fields  
✅ **Lookup.jsx** - Updated to use `/api/driver/fines/search` endpoint  
✅ **Payment.jsx** - Updated payment processing with correct endpoint  

### Database
✅ **Automatic Table Creation** - MySQL tables will be created automatically when backend starts (Hibernate with `ddl-auto=update`)

---

## 🚀 Getting Started

### 1. **Start the Backend**

Navigate to the backend folder and start the Spring Boot application:

```bash
cd backend
./mvnw spring-boot:run
# On Windows: mvnw.cmd spring-boot:run
```

**Backend will run on:** `http://localhost:8080`

The database tables will be automatically created with sample data:
- **users** table - Admin + 2 sample drivers
- **fines** table - 4 sample traffic fines
- Other admin tables (categories, districts, etc.)

### 2. **Start the Driver Portal Frontend**

In a new terminal:

```bash
cd driver-portal
npm install      # First time only
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

---

## 📱 Test Credentials

### Driver Login (already in database)
**Email:** `driver@example.com`  
**Password:** `password123`

**OR**

**Email:** `test@example.com`  
**Password:** `password123`

### Try Fine Search
Reference numbers to search:
- `SLP-882291` (Category: SPEED) - Pending fine
- `SLP-882290` (Category: DRUNK) - Pending fine  
- `SLP-882289` (Category: LICENSE) - Pending fine
- `SLP-882288` (Category: SPEED) - Already PAID

---

## 🔌 API Endpoints Available

### Driver Routes
- **POST** `/api/driver/login` - Driver login
- **POST** `/api/driver/register` - Driver registration
- **GET** `/api/driver/fines/search?ref={reference}&cat={category}` - Search fine
- **GET** `/api/driver/fines` - Get all driver's fines (by license number)
- **GET** `/api/driver/fines/{id}` - Get specific fine
- **POST** `/api/driver/fines/{id}/pay` - Process payment

### Admin Routes (already available)
- **POST** `/api/auth/login` - Admin login
- **GET** `/api/admin/**` - Dashboard data endpoints

---

## 📊 Database Details

### Connection Settings (in `backend/src/main/resources/application.properties`)
```
URL: jdbc:mysql://localhost:3307/traffic_db
Username: root
Password: Hasangi123@
```

### Tables Created Automatically
- `users` - Driver and admin accounts
- `fines` - Traffic fine records
- `category_stats`, `district_stats`, `monthly_trends`, `summary` - Analytics data

---

## 🔐 Authentication Flow

1. Driver enters **email** and **password** → `/api/driver/login`
2. Backend returns **JWT token** (currently fake, can be enhanced)
3. Token stored in `localStorage`
4. Token automatically included in API requests via interceptor
5. If token expires, user is redirected to login

---

## 🛠️ Key Configuration Files

### Backend
- `pom.xml` - Maven dependencies (Spring Boot 4.1.0, MySQL, JPA)
- `src/main/resources/application.properties` - Database connection
- `src/main/java/com/example/backend/controller/DriverController.java` - New driver APIs

### Frontend
- `.env` - API base URL
- `src/services/api.js` - Axios configuration with JWT interceptor
- `vite.config.js` - Vite development server config

---

## ✨ Features

### For Drivers
- ✅ Register new account
- ✅ Login with email
- ✅ Search fines by reference number and category
- ✅ View fine details (amount, violation, deadline)
- ✅ Pay fines online
- ✅ Payment confirmation

### For Admin (existing)
- Dashboard with statistics
- Fine management
- District and category analytics

---

## 🐛 Troubleshooting

### Backend won't start
- Ensure MySQL is running on port 3307
- Check `application.properties` for correct credentials
- View logs for specific errors

### Frontend can't connect to backend
- Ensure backend is running on port 8080
- Check `.env` file has correct `VITE_API_URL`
- Open browser DevTools → Network tab to see API calls

### "Fine not found" error
- Reference number must match exactly (case-sensitive for category)
- Try: `SLP-882291` with category `SPEED`

### CORS errors
- Backend SecurityConfig allows localhost on any port
- Ensure frontend and backend are both running

---

## 📝 Next Steps (Optional Enhancements)

1. **Real JWT tokens** - Implement JWT token generation/validation
2. **Password hashing** - Use bcrypt for password security
3. **Email verification** - Send verification links on registration
4. **Payment gateway** - Integrate Stripe/PayPal for real payments
5. **SMS notifications** - Send SMS to drivers after payment
6. **Error handling** - Enhanced error messages and logging
7. **Rate limiting** - Prevent brute force attacks

---

## 📧 Support

For issues or questions, check:
- Browser console for frontend errors
- Backend logs in terminal for API errors
- Database connection settings in application.properties

Enjoy your integrated traffic fine system! 🚗

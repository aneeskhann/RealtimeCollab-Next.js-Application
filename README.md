# RTC - Real-Time Collaboration Platform

A secure, role-based authentication system with real-time collaboration features.

## 🚀 Features

### Backend Authentication
- **User Model**: Username, email, password (hashed), role-based access
- **JWT Authentication**: Secure token-based authentication with 7-day expiry
- **Role-Based Access**: Admin and participant roles with middleware protection
- **Password Security**: BCrypt hashing with salt rounds
- **Input Validation**: Comprehensive validation on both client and server

### Frontend Authentication
- **Modern UI**: Clean, responsive design with glass morphism effects
- **Form Validation**: Real-time validation with error feedback
- **Route Protection**: Automatic redirection based on authentication status
- **Toast Notifications**: User-friendly feedback for all actions
- **Role-Based UI**: Different interfaces based on user roles

## 📁 Project Structure

```
RTC/
├── client/                 # Next.js Frontend
│   ├── app/
│   │   ├── auth/          # Authentication pages
│   │   │   ├── signin/
│   │   │   ├── signup/
│   │   │   └── forgot-password/
│   │   ├── dashboard/     # Protected dashboard
│   │   └── layout.tsx     # Root layout with providers
│   ├── components/
│   │   ├── auth-guard.tsx # Route protection
│   │   └── ui/           # UI components
│   ├── hooks/
│   │   └── use-auth.ts   # Authentication hook
│   └── services/
│       └── auth-service.ts # API service
└── Server/                # Express.js Backend
    ├── models/
    │   └── User.js       # User model
    ├── services/
    │   └── authService.js # Authentication logic
    ├── middleware/
    │   └── auth.js       # JWT verification
    ├── controllers/
    │   └── authController.js # Route handlers
    ├── routes/
    │   └── auth.js       # Authentication routes
    └── server.js         # Main server file
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or pnpm

### Backend Setup

1. **Navigate to Server directory:**
   ```bash
   cd Server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```


3. **Start MongoDB:**
   Make sure MongoDB is running on your system.

4. **Start the server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create `.env.local` file in the client directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🔐 Authentication Flow

### Registration
1. User fills out signup form (username, email, password)
2. Frontend validates input and sends to `/api/auth/register`
3. Backend validates, hashes password, creates user
4. JWT token generated and returned
5. User redirected to dashboard

### Login
1. User enters email and password
2. Frontend sends credentials to `/api/auth/login`
3. Backend validates credentials and returns JWT
4. Token stored in localStorage
5. User redirected to dashboard

### Route Protection
- **Public Routes**: Sign in, sign up, forgot password
- **Protected Routes**: Dashboard, settings, room pages
- **Role-Based Routes**: Admin-only features

## 🎨 UI Components

### Authentication Pages
- **Sign In**: Email/password with validation
- **Sign Up**: Username, email, password with confirmation
- **Forgot Password**: Email input with placeholder logic

### Features
- **Glass Morphism**: Modern translucent effects
- **Responsive Design**: Works on all screen sizes
- **Dark Mode**: Automatic theme switching
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "participant"
    },
    "token": "jwt_token_here"
  }
}
```

## 🛡️ Security Features

### Backend Security
- **Password Hashing**: BCrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Comprehensive validation
- **CORS Protection**: Configured for frontend
- **Helmet**: Security headers

### Frontend Security
- **Token Storage**: Secure localStorage management
- **Route Protection**: Automatic authentication checks
- **Input Sanitization**: Client-side validation
- **Error Handling**: Secure error messages

## 🚀 Usage

1. **Start both servers** (backend on port 5000, frontend on port 3000)
2. **Navigate to** `http://localhost:3000`
3. **Create an account** or sign in
4. **Access the dashboard** with full authentication

## 🔧 Customization

### Adding New Roles
1. Update User model enum in `Server/models/User.js`
2. Add role checks in middleware
3. Update frontend role-based components

### Styling
- Modify `client/app/globals.css` for theme changes
- Update component styles in `client/components/ui/`

### API Integration
- Add new endpoints in `Server/routes/`
- Create corresponding services in `Server/services/`
- Update frontend services in `client/services/`




## 🐛 Troubleshooting

### Common Issues
1. **MongoDB Connection**: Ensure MongoDB is running
2. **Port Conflicts**: Check if ports 3000/5000 are available
3. **CORS Errors**: Verify CLIENT_URL in backend .env
4. **JWT Issues**: Check JWT_SECRET configuration

### Development Tips
- Use `npm run dev` for both client and server
- Check browser console for frontend errors
- Monitor server logs for backend issues
- Use Postman/Insomnia for API testing

## 📄 License

This project is licensed under the MIT License. 

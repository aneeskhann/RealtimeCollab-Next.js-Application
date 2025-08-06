import express from 'express'
import {
  register,
  login,
  getCurrentUser,
  verifyCodeBeforeSignup,
  sendVerificationCode,
  logout
} from '../controllers/authController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)
router.post('/send-code', sendVerificationCode)
router.post('/verify-code', verifyCodeBeforeSignup)

// Protected routes
router.get('/me', verifyToken, getCurrentUser)
router.post('/logout', verifyToken, logout)

export default router

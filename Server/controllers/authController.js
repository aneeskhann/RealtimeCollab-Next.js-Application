import authService from '../services/authService.js'
import {
  storeVerificationCode,
  getVerificationCode,
  deleteVerificationCode,
} from '../services/verificationStore.js'
import {mailTransporter} from '../config/nodemailer.js'
import { generateVerificationEmail } from '../utils/verificationCodeTemplate.js'

// 🔐 Register
export const register = async (req, res) => {
  try {
    const { username, email, password, code } = req.body

    if (!username || !email || !password || !code) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password too short' })
    }

    const storedCode = getVerificationCode(email)
    if (!storedCode || storedCode !== code) {
      return res.status(400).json({ success: false, message: 'Invalid or expired code' })
    }

    const result = await authService.registerUser({ username, email, password })
    deleteVerificationCode(email)

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: result,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}


// ✅ Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' })
    }

    const result = await authService.loginUser({ email, password })

    // 💡 Convert _id → id
    const user = {
      ...result.user,
      id: result.user._id?.toString(),
    }

    // ✅ Terminal log (DEV ONLY)
    console.log(`🔐 [LOGIN SUCCESS]`)
    console.log(`👤 User Email: ${email}`)
    console.log(`🆔 User ID: ${user.id}`)
    console.log(`🔑 Token: ${result.token}`)

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: result.token,
      user,
    })
  } catch (error) {
    console.error(`❌ [LOGIN FAILED] Email: ${req.body?.email} | Reason: ${error.message}`)

    return res.status(401).json({ success: false, message: error.message })
  }
}




// ✅ Logout
export const logout = (_req, res) => {
  return res.status(200).json({ success: true, message: 'Logout successful' })
}

// ✅ Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req.user._id)
    return res.status(200).json({ success: true, data: user })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user' })
  }
}

// ✅ Send Verification Code
export const sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    storeVerificationCode(email, code)

    await mailTransporter.sendMail({
      from: `"Collab Space" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your Verification Code - Collab Space',
      html: generateVerificationEmail(code),
    })

    return res.status(200).json({ success: true, message: 'Verification code sent' })
  } catch (error) {
    console.error('Email error:', error)
    return res.status(500).json({ success: false, message: 'Failed to send email' })
  }
}

// ✅ Verify Code
export const verifyCodeBeforeSignup = async (req, res) => {
  try {
    const { email, code } = req.body
    const storedCode = getVerificationCode(email)

    if (!storedCode || storedCode !== code) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code' })
    }

    return res.status(200).json({ success: true, message: 'Code verified successfully' })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Verification error' })
  }
}

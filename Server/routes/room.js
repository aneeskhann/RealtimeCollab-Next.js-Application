import express from 'express'
import {
  createRoom,
  getRoomByCode,
  joinRoom,
  leaveRoom,
  endRoom,
} from '../controllers/roomController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()
router.post('/', verifyToken, createRoom)
router.get('/:roomCode', getRoomByCode)
router.post('/:roomCode/join', verifyToken, joinRoom)
router.patch('/leave', verifyToken, leaveRoom)
router.patch('/end', verifyToken, endRoom)

export default router

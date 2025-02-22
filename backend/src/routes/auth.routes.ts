import { Router } from 'express';
import { register, verifyEmail, login, logout, getCurrentUser } from '../controllers/auth.controller';
import { authenticateUser, validateCollegeEmail } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', validateCollegeEmail, register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticateUser, getCurrentUser);

export default router;
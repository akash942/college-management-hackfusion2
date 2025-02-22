import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.utils';
import { UserRole } from '../models/user.model';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  console.log("users token", token);
  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
    return
}

  req.user = decoded;
  next();
};

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return
    }

    if (!roles.includes(req.user.role as UserRole)) {
      res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to perform this action' 
      });
      return
    }
    
    next();
  };
};

export const validateCollegeEmail = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  
  if (!email) {
    res.status(400).json({ success: false, message: 'Email is required' });
    return
  }
  
  // Check if email domain matches allowed college domains
  const allowedDomains = process.env.ALLOWED_DOMAINS?.split(',') || ['college.edu'];
  const emailDomain = email.split('@')[1];
  
  if (!allowedDomains.includes(emailDomain)) {
     res.status(400).json({ 
      success: false, 
      message: 'Only college email addresses are allowed' 
    });
    return
  }
  
  next();
};
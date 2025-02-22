import { Request, Response } from 'express';
import User, { UserRole, IUser } from '../models/user.model';
import { generateToken, generateVerificationToken, setCookieOptions } from '../utils/auth.utils';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role, department, studentId, facultyId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
      return
    }

    // Create verification token
    const verificationToken = generateVerificationToken();

    // Create new user
    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
      role: role || UserRole.STUDENT,
      department,
      studentId: role === UserRole.STUDENT ? studentId : undefined,
      facultyId: role === UserRole.FACULTY ? facultyId : undefined,
      verificationToken
    });

    await newUser.save();

    // In a real app, you would send an email with the verification token
    // For now, just return it in the response
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your email.',
      verificationToken // In production, don't return this to client
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: error.message
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, token } = req.body;

    const user = await User.findOne({ email, verificationToken: token });
    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      });
      return
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. You can now login.'
    });
    
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error during email verification',
      error: error.message
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in'
      });
      return
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return
    }

    // Generate JWT token
    const token = generateToken(user);

    // Set JWT as HTTP-only cookie
    res.cookie('token', token, setCookieOptions());

    console.log("ther users token was set to: ", token);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department,
        token: token
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
      return 
    }

    const user = await User.findById(req.user.userId).select('-password -verificationToken');
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return 
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message
    });
  }
};
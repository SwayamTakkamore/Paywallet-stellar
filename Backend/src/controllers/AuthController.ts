/**
 * Authentication Controller
 * Handles user registration, login, and authentication
 */

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/schemas/User';
import { logger } from '../utils/logger';

export class AuthController {
  
  /**
   * User Registration (Signup)
   */
  async signup(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password, role } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !email || !password || !role) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Validate password length
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long'
        });
      }

      // Validate role
      if (!['employer', 'worker'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Role must be either "employer" or "worker"'
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Hash password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create new user
      const newUser = await User.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role,
        isActive: true,
        emailVerified: false, // Will be set to true when email is verified
        kycStatus: 'pending', // Start with pending, no immediate verification required
      });

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: newUser._id, 
          email: newUser.email, 
          role: newUser.role 
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      // Return user data (without password hash)
      const userResponse = {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
        emailVerified: newUser.emailVerified,
        kycStatus: newUser.kycStatus,
        createdAt: newUser.createdAt
      };

      logger.info(`New user registered: ${newUser.email} (${newUser.role})`);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: userResponse,
          token
        }
      });

    } catch (error) {
      logger.error('Signup error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * User Login
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated. Please contact support.'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      // Update last login time
      user.lastLoginAt = new Date();
      await user.save();

      // Return user data (without password hash)
      const userResponse = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        kycStatus: user.kycStatus,
        stellarPublicKey: user.stellarPublicKey,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt
      };

      logger.info(`User logged in: ${user.email}`);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: userResponse,
          token
        }
      });

    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get Current User Profile
   */
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const user = await User.findById(userId).select('-passwordHash');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            emailVerified: user.emailVerified,
            kycStatus: user.kycStatus,
            stellarPublicKey: user.stellarPublicKey,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        }
      });

    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update User Profile
   */
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { firstName, lastName, stellarPublicKey } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const updateData: any = {};
      if (firstName) updateData.firstName = firstName.trim();
      if (lastName) updateData.lastName = lastName.trim();
      if (stellarPublicKey) updateData.stellarPublicKey = stellarPublicKey.trim();

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-passwordHash');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      logger.info(`User profile updated: ${user.email}`);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user }
      });

    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Logout (client-side token invalidation)
   */
  async logout(req: Request, res: Response) {
    try {
      // In a JWT-based system, logout is typically handled client-side
      // by removing the token from storage
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

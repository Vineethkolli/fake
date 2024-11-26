import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { PERMISSIONS } from '../config/roles.js';

/**
 * Middleware to authenticate the user using JWT.
 */
export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Fetch the latest user role from the database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = { id: user.id, role: user.role }; // Update the user information in the request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

/**
 * Middleware to check if the user's role is allowed.
 */
export const checkRole = (allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

/**
 * Middleware to check if the user has the required permission.
 */
export const checkPermission = (permission) => (req, res, next) => {
  
  if (!PERMISSIONS[permission]?.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const userAuth = async (req, res, next) => {
  try {
    let token = null;
    
    // Method 1: Check Authorization header (Bearer token)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && typeof authHeader === 'string') {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
        token = parts[1];
      }
    }
    
    // Method 2: Check token header (direct token)
    if (!token && req.headers.token) {
      token = req.headers.token;
    }
    
    // Method 3: Check body for token
    if (!token && req.body && req.body.token) {
      token = req.body.token;
    }
    
    console.log('Auth Middleware - Token found:', token ? 'Yes' : 'No');
    console.log('Headers:', req.headers);
    
    if (!token) {
      return res.json({ success: false, message: 'No token provided. Access denied.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('Token decoded:', decoded);
    
    // Check if user exists
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Add user info to request object
    req.userId = decoded.id;
    req.user = user;
    
    next();
    
  } catch (error) {
    console.log('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.json({ success: false, message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.json({ success: false, message: 'Token expired' });
    }
    
    return res.json({ success: false, message: 'Token verification failed' });
  }
};

export default userAuth;
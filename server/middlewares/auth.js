import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const userAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;
    
    if (!token) {
      return res.json({ success: false, message: 'No token provided. Access denied.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
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
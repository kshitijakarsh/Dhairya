import jwt from 'jsonwebtoken';
import Users from "../models/UserSchema.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await Users.findById(decoded.id).select("-password"); // Fetch full user data
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;  // Attach full user object
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
};


// Role-based access control
export const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

export default {
  authenticateToken,
  checkRole
}
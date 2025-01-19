const jwt = require('jsonwebtoken');
const User = require('../models/User')

exports.authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  // console.log(token , "TOKEN ")
  if (!token) {
    console.log("token not found")
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    // console.log(user)

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};




exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    console.log(user)
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied. Admins only!" });
    }
    next();
  } catch (error) {
    console.log("Not admin")
    res.status(500).json({ message: "Unauthorized", error: error.message });
  }
};
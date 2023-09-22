const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to check if a user is authenticated
exports.isAuthenticated = (req, res, next) => {
  try {
    console.log("cookie : ",req.cookies.token);

    const token = req.body.token || req.cookies.token ;
    if (!token || token === undefined) {
      return res.status(401).json({
        success: false,
        message: 'token missing'
      })
    }

    // verify the token
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      //below line put payload into user obj so we can verify 
      req.user = payload;


    }
    catch (error) {
      return res.status(401).json({
        success: false,
        message: 'token is invalid'
      })
    }
    next();
  }
  catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message
    })
  }
}


// Middleware to check if a user has the required role (e.g., 'admin')
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
};

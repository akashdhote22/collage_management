const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    // 1. Get Authorization header
    const authHeader = req.headers.authorization;

    // 2. Check Bearer token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    // 3. Extract token
    const token = authHeader.split(" ")[1];

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach user information to request
    req.user = decoded;

    // 6. Continue to next middleware/controller
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, invalid or expired token",
    });
  }
};

module.exports = protect;
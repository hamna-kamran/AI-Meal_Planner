const jwt = require("jsonwebtoken");

function AuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No authorization header" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid token format" });
  }

  const token = parts[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || !decoded?.id) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
}

module.exports = AuthMiddleware; // ✅ export the function directly

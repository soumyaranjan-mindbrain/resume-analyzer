// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//   try {
//     const token = req.cookies.token;

//     if (!token) {
//       return res.status(401).json({ error: "No token, authorization denied" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.userId = decoded.id;   
//     req.user = decoded;

//     next();
//   } catch (err) {
//     res.status(401).json({ error: "Token is not valid" });
//   }
// };

// module.exports = { authMiddleware };  

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.warn("[Auth Message] No token found in request to:", req.originalUrl);
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    try {
      // DEBUG: Temporarily ignore expiration to rule out clock drift
      const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
      
      req.userId = decoded.id || decoded._id;
      req.user = decoded;

      console.log(`[Auth SUCCESS] User: ${req.userId} at ${req.originalUrl}`);
      next();
    } catch (err) {
      console.error("[Auth FAIL] JWT Verification failed:", err.message);
      return res.status(401).json({ 
        error: "Token is not valid", 
        details: err.message,
        hint: "Clear cookies and log in again."
      });
    }
  } catch (err) {
    console.error("[Auth ERROR] Middleware error:", err.message);
    return res.status(500).json({ error: "Internal server error during authentication" });
  }
};

module.exports = { authMiddleware };
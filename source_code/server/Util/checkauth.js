const jwt = require("jsonwebtoken");
require("dotenv").config();

const clientRoutes = [
  "/user",
  "/seller-dashboard",
  "/admin",
]

module.exports = (req, res, next) => {
  try {

    let reqRoute = req?.originalUrl?.split("?")?.[0];
    if (clientRoutes?.find(e => e == reqRoute)) {
      next();
      return;
    } 

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Authentication token missing or invalid");
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Assuming the token payload contains 'email' and 'username'
    const { email, username, role } = decodedToken;
    req.user = { email, username, role}; // Changed from req.UserData to req.user
   

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({ error: "Authentication Failure" });
  }
};

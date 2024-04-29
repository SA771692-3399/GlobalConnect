const multer = require('multer');
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = "./uploads/";
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  const upload = multer({ storage });
  
  const authenticateToken =  (req, res, next)=> {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  };

  module.exports={authenticateToken,upload};
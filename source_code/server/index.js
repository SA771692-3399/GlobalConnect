const express = require("express");
const cors = require("cors");
const apiRouter = require("./routers/API");
const mongoose = require("mongoose");
const { UserModel, ProductModel } = require("./Models/AppModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "mandy.macejkovic@ethereal.email",
    pass: "fYC7FUPhZ1P7G9Bubc",
  },
});

const uri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/GlobalConnectDB";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB Connected");
  checkAdminUser();
});

// Multer storage configuration
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

const authenticateToken = (req, res, next) => {
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

app.use("/api", apiRouter);

const checkAdminUser = async () => {
  try {
    const adminUser = await UserModel.findOne({ UserName: "admin" });
    if (!adminUser) {
      const newAdmin = new UserModel({
        UserName: "admin",
        Email: "admin@gmail.com",
        Password: "admin@123",
        Role: "Admin",
      });
      await newAdmin.save();
      console.log("Admin user created successfully");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error checking admin user:", error.message);
  }
};

app.post("/login", async (req, res) => {
  const { UserName, Password } = req.body;
  try {
    const user = await UserModel.findOne({ UserName });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isPasswordValid = await bcrypt.compare(Password, user.Password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid Password");
    }
    const token = jwt.sign(
      { username: user.UserName, email: user.Email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1hr" }
    );
    res.status(200).json({
      token,
      expiresIn: "1hr",
      UserID: user._id,
      Role: user.Role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/signup", async (req, res) => {
  let { UserName, Email, Password, Role } = req.body;
  try {
    const existingUser = await UserModel.findOne({ Email });
    if (existingUser) {
      return res.status(400).send("User Already Exists");
    }
    const newUser = new UserModel({ UserName, Email, Password, Role });
    await newUser.save();
    res.status(201).send("User Added");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ Email: email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const resetToken = jwt.sign(
      { email: user.Email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" }
    );

    // Send reset password email
    const mailOptions = {
      from: "admin@GlobalConnect.com", // Sender email address
      to: email, // Recipient email address
      subject: "Password Reset Request",
      html: `<p>To reset your password, click the following link: <a  target="_blank" href="http://localhost:3000/reset-password?param=${resetToken}">Reset Password</a></p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Failed to send reset password email");
      }
      console.log("Reset password email sent:", info.response);
      res.status(200).send("Password reset token sent to your email");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await UserModel.findOne({ Email: decodedToken.email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.Password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).send("Password updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to update a user's details
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, phoneNumber, address } = req.body;

  try {
    const user = await UserModel.findByIdAndUpdate(
      id,
      { username, email, phoneNumber, address },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post(
  "/api/products",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, price, description, quantity, category } = req.body;
      const seller = req.body.seller;

      if (
        !name ||
        !price ||
        !description ||
        !quantity ||
        !req.file ||
        !seller ||
        !category
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields or image",
        });
      }

      const product = new ProductModel({
        name,
        price,
        description,
        quantity,
        image: req.file.path,
        seller,
        category,
      });

      await product.save();
      res
        .status(201)
        .json({ success: true, message: "Product added successfully" });
    } catch (error) {
      console.error("Error adding product:", error.message);
      res
        .status(500)
        .json({ success: false, message: "Failed to add product" });
    }
  }
);

app.get("/api/products", async (req, res) => {
  try {
    const products = await ProductModel.find().populate("seller", "UserName");
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch products" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id).populate(
      "seller",
      "UserName"
    );
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch product" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const { name, price, description, quantity, image, category } = req.body;
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        description,
        quantity,
        image,
        category,
      },
      { new: true }
    );
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to update product" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete product" });
  }
});
app.use(express.static(__dirname));

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

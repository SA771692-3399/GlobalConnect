const express = require("express");
const cors = require("cors");
const apiRouter = require("./routers/API");
const mongoose = require("mongoose");
const { UserModel, ProductModel, FeedbackModel, FaqModel } = require("./Models/AppModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const adminRouter = require("./routers/AdminRoutes");
const adminSellerRouter = require("./routers/AdminSellerRoutes");
const userRouter = require("./routers/UserRoutes");
const sellerRouter = require("./routers/SellerRoutes");

const path = require("path");

const nodemailer = require("nodemailer");
require("dotenv").config();
const checkauth = require("./Util/checkauth");
const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
      user: process.env.NO_REPLY_EMAIL,
      pass: process.env.NO_REPLY_PASSWORD,
  },
});

// const uri = process.env.MONGODB_URI || "mongodb://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:27017/GlobalConnectDB";
const uri = process.env.MONGODB_URI || "mongodb://0.0.0.0:27017/GlobalConnectDB";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB Connected");
  checkAdminUser();
});

app.use("/api", apiRouter);

app.use("/check-auth", checkauth);

app.get("/check-auth", (req, res) => {
  res.send({ status: "ok", role: req.user.role });
});

const checkAdminUser = async () => {
  try {
    const adminUser = await UserModel.findOne({ UserName: "admin" });
    if (!adminUser) {
      let hashedPassword = await bcrypt.hash("admin@123", 10);
      const newAdmin = new UserModel({
        UserName: "admin",
        Email: "admin@gmail.com",
        Password: hashedPassword,
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
    console.log(user.Role);
    const token = jwt.sign(
      { username: user.UserName, email: user.Email, role: user.Role },
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
    const existingUser = await UserModel.findOne({ UserName });
    if (existingUser) {
      return res.status(400).send("User Already Exists");
    }
    let hashedPassword = await bcrypt.hash(Password, 10);
    const newUser = new UserModel({ UserName, Email, Password: hashedPassword, Role });
    await newUser.save();
    res.status(201).send("User Added");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/userfeedbacks", async (req, res) => {
  const { username, email, des } = req.body;

  try {
    const newUser = new FeedbackModel({ username, email, des });
    await newUser.save();
    res.status(201).send("User Added");
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Listfeedbacks", async (req, res) => {
  try {
    const feedbacks = await FeedbackModel.find(); // Retrieve all feedback entries

    res.status(200).json(feedbacks); // Send the feedbacks as JSON response
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
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

    const mailOptions = {
      from: process.env.NO_REPLY_EMAIL,
      to: email,
      subject: "Password Reset Request",
      html: `<p>To reset your password, click the following link: <a  target="_blank" href="http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/reset-password?param=${resetToken}">Reset Password</a></p>`,
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
    // user.Password = newPassword;
    user.Password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).send("Password updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/fqalist", async (req, res) => {
  try {
    // Fetch all FAQs from the database
    const faqs = await FaqModel.find();

    res.status(200).json({
      success: true,
      message: 'FAQs retrieved successfully',
      faqs,
    });
  } catch (error) {
    console.error('Error getting FAQs:', error.message);
    res.status(500).json({ success: false, message: 'Failed to get FAQs' });
  }
});


app.use(express.static(__dirname));
app.use("/admin", adminRouter);
app.use("/admin-seller", adminSellerRouter);
app.use("/user", userRouter);
app.use("/seller", sellerRouter);

app.use(express.static(path.join(__dirname, "build")));
// app.use("/images", express.static(path.join(__dirname,"uploads")))

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

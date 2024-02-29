const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

// Define User schema
const UserSchema = new Schema({
  UserName: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Role: {
    type: String,
    enum: ["User", "Seller", "Admin"],
  },
  PhoneNumber: {
    type: String,
  },
  Address: {
    type: String,
  },
});

// Pre-save hook to hash the password before saving to the database
UserSchema.pre("save", async function (next) {
  try {
    // Hash the password using bcrypt with a salt of 10 rounds
    this.Password = await bcrypt.hash(this.Password, 10);
    next();
  } catch (error) {
    // If an error occurs during password hashing, pass it to the next middleware
    next(error);
  }
});

// Define Product schema
const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'UserModel', 
  },
  category: {
    type: String,
    enum: ["Clothing", "Food", "Local business"],
  }
});

// Create and export User model
const UserModel = mongoose.model("UserModel", UserSchema);

// Create and export Product model
const ProductModel = mongoose.model("ProductModel", ProductSchema);

module.exports = { UserModel, ProductModel };

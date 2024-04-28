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
   required: true,
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
   ref: "UserModel",
 },
 category: {
   type: String,
   enum: ["Clothing", "Food", "Local business"],
 },
});
 
const cartSchema = new Schema({
 userID: {
   type: Schema.Types.ObjectId,
   required: true,
 },
 products: [
   {
     productID: {
       type: Schema.Types.ObjectId,
       required: true,
     },
     quantity: {
       type: Number,
       required: true,
     },
   },
 ],
});
 
const orderSchema = new Schema({
 userID: {
   type: Schema.Types.ObjectId,
   required: true,
 },
 sessionId: {
   type: String,
   required: true,
 },
 productsOrdered: [
   {
     productID: {
       type: Schema.Types.ObjectId,
       required: true,
     },
     orderedQuantity: {
       type: Number,
       required: true,
     },
     sellerId: {
       type: Schema.Types.ObjectId,
       required: true,
     },
   },
 ],
 amount_subtotal: {
   type: Number,
 },
 amount_total: {
   type: Number,
 },
 currency: {
   type: String,
 },
 payment_intent: {
   type: String,
 },
 
 payment_method_types: {
   type: [String],
 },
 payment_status: {
   type: String,
 },
 customer_details: {
   address: {
     city: {
       type: String,
     },
     country: {
       type: String,
     },
     line1: {
       type: String,
     },
     line2: {
       type: String,
     },
     postal_code: {
       type: String,
     },
     state: {
       type: String,
     },
   },
   email: {
     type: String,
   },
   name: {
     type: String,
   },
   phone: {
     type: String,
   },
 },
 shipping_details: {
   address: {
     city: {
       type: String,
     },
     country: {
       type: String,
     },
     line1: {
       type: String,
     },
     line2: {
       type: String,
     },
     postal_code: {
       type: String,
     },
     state: {
       type: String,
     },
   },
   name: {
     type: String,
   },
 },
 
 status: {
   type: String,
 },
 orderDate: {
   type: Date,
   default: Date.now,
 },
 deliveryDate: {
   type: Date,
   default: function () {
     let date = new Date(this.orderDate.getTime());
     return date.setDate(this.orderDate.getDate() + 7);
   },
 },
 deliveryStatus: {
   type: String,
   enum: ["Order placed", "Order confirmed", "Order processing", "Order Shipped", "Order Dispatched","In transit","Out for delivery","Delivered","Attempted delivery","Canceled","Held at customs","Awaiting pickup","Delayed","Lost","Refunded"],
   default: "Order placed"
 },
 comments: {
   type: String,
 },
});
 
// Create and export User model
const UserModel = mongoose.model("UserModel", UserSchema);
 
// Create and export Product model
const ProductModel = mongoose.model("ProductModel", ProductSchema);
 
const CartModel = mongoose.model("CartModel", cartSchema);
 
const OrderModel = mongoose.model("OrderModel", orderSchema);
 
module.exports = { UserModel, ProductModel, CartModel, OrderModel };
 
 
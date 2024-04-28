const router = require("express").Router();
const checkAuth = require("../Util/checkauth");
const { UserModel, ProductModel, OrderModel } = require("../Models/AppModel");
const bcrypt = require("bcryptjs");
const { authenticateToken, upload } = require("../Util/utils");
// Middleware to check authentication
router.use(checkAuth);
 
const checkSeller = (req, res, next) => {
 try {
   if (!(req.user.role === "Seller")) {
     throw new Error("User Not Authutenticated to access this route");
   }
   next();
 } catch (e) {
   res.status(403).send(e.message);
   console.error(e);
 }
};
 
router.get("/orders", checkSeller, async (req, res) => {
 try {
   const sellerId = (await UserModel.findOne({ Email: req.user.email }))._id;
   const orders = await OrderModel.find({
     "productsOrdered.sellerId": sellerId,
   });
 
   res.send({ status: "ok", orders });
 } catch (e) {
   console.log(e);
   res.send(e.message);
 }
});
 
router.patch("/orders/:id", checkSeller, async (req, res) => {
 try {
   const order = await OrderModel.findByIdAndUpdate(req.params.id, req.body, {
     new: true,
   });
   res.send({ status: "ok", changedOrder: order });
 } catch (e) {
   console.log(e);
   res.send(e.message);
 }
});
 
router.get("/products",checkSeller, async (req, res) => {
 try {
   const sellerId = (await UserModel.findOne({ Email: req.user.email }))._id;
   const products = await ProductModel.find({
     "seller": sellerId,
   });
   res.status(200).json({ status: "Success", products });
 } catch (error) {
   console.error("Error fetching products:", error);
   res.status(500).json({ status: "Error", message: "Internal server error" });
 }
});
 
module.exports = router;
 
 
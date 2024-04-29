const router = require("express").Router();
const checkAuth = require("../Util/checkauth");
const { UserModel, ProductModel, OrderModel, ProductfModel } = require("../Models/AppModel");
const bcrypt = require("bcryptjs");
const { authenticateToken, upload } = require("../Util/utils");
// Middleware to check authentication
router.use(checkAuth);
 
const checkSeller = (req, res, next) => {
 try {
   if (!(req.user.role === "Admin") && !(req.user.role === "Seller") && !(req.user.role === "LocalOwner")) {
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
module.exports = router;
 
router.get("/rat/:id", checkSeller, async (req, res) => {
 try {
   const productId = req.params.id;
   const ratings = await ProductfModel.findOne({ _id: productId }).select("ratings");
 
   res.send({ status: "ok", ratings });
 } catch (e) {
   console.log(e);
   res.status(500).send({ error: "Internal Server Error" });
 }
});
 
 
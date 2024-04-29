const router = require("express").Router();
const checkAuth = require("../Util/checkauth");
const { UserModel, ProductModel, OrderModel } = require("../Models/AppModel");
const bcrypt = require("bcryptjs");
const { authenticateToken, upload } = require("../Util/utils");
// Middleware to check authentication
router.use(checkAuth);

const checkAdmin = (req, res, next) => {
  try {
    if (!(req.user.role === "Admin")) {
      throw new Error("User Not Authenticated to access this route");
    }
    next();
  } catch (e) {
    res.status(403).send(e.message);
    console.error(e);
  }
};

router.get("/users", checkAdmin, async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/users/:id", checkAdmin, async (req, res) => {
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

router.delete("/users/:id", checkAdmin, async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).send({ error: "Order not found" });
    }
    res.send({ status: "ok" });
  } catch (e) {
    res.send(e.message);
  }
});

router.get("/orders", checkAdmin, async (req, res) => {
  try {
    let orders = OrderModel.find();
    if (req.query.userId) {
      orders = orders.find({ userID: req.query.userId });
    }
    if (req.query.sellerId) {
      orders = orders.find({ "productsOrdered.sellerId": req.query.sellerId });
    }

    res.send({ status: "ok", orders: await orders });
  } catch (e) {
    res.send(e.message);
  }
});

router.patch("/orders/:id", checkAdmin, async (req, res) => {
  try {
    let order = await OrderModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send({ status: "ok", order });
  } catch (e) {
    res.send(e.message);
  }
});

router.delete("/orders/:id", checkAdmin, async (req, res) => {
  try {
    await OrderModel.findByIdAndDelete(req.params.id);
    res.send({ status: "ok" });
  } catch (e) {
    res.send(e.message);
  }
});

module.exports = router;

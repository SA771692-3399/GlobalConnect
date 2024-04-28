const router = require("express").Router();
const checkAuth = require("../Util/checkauth");
const stripe = require("stripe")(
  "sk_test_51OEOecEmpCkUstvcPQN6Ac99kxpeelJoqhc9tbXLxOX1bjSaSs4CSmtg7f8ZvQVQh0gm4pBMrjp3zjcXCdwHB3NB004n5h91oQ"
);
const {
  UserModel,
  ProductModel,
  CartModel,
  OrderModel,
} = require("../Models/AppModel");
const bcrypt = require("bcryptjs");
const { authenticateToken, upload } = require("../Util/utils");
// Middleware to check authentication
router.use(checkAuth);
const updateCart = async (existingCart, data) => {
  existingCart.products = data.products;
  return await existingCart.save();
};

const checkUser = (req, res, next) => {
  try {
    if (!(req.user.role === "User")) {
      throw new Error("User Not Authutenticated to access this route");
    }
    next();
  } catch (e) {
    res.status(403).send(e.message);
    console.error(e);
  }
};

router.get("/cart", checkUser, async (req, res) => {
  try {
    const userID = (await UserModel.findOne({ Email: req.user.email }))._id;
    const userCart = await CartModel.findOne({ userID });
    if (!userCart) {
      res.send({ status: "ok", message: "Empty cart" });
    } else {
      res.send(userCart);
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/cart", checkUser, async (req, res) => {
  try {
    const userID = (await UserModel.findOne({ Email: req.user.email }))._id;
    const existingCart = await CartModel.findOne({ userID });
    let newCart;
    if (existingCart) {
      newCart = await updateCart(existingCart, req.body);
    } else {
      newCart = new CartModel({
        userID,
        products: req.body.products,
      });
      await newCart.save();
    }

    res.status(201).send({ status: "Ok", cart: newCart });
  } catch (e) {
    res.status(500).send(e);
  }
});
router.patch("/cart", checkUser, async (req, res) => {
  try {
    const userID = (await UserModel.findOne({ Email: req.user.email }))._id;
    const existingCart = await CartModel.findOne({ userID });
    const newCart = await updateCart(existingCart, req.body);
    res.status(200).send({ status: "Ok", cart: newCart });
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/cart", checkUser, async (req, res) => {
  try {
    const userID = (await UserModel.findOne({ Email: req.user.email }))._id;
    await CartModel.findOneAndDelete({ userID });
    res.status(200).send({ status: "Ok" });
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/orders", checkUser, async (req, res) => {
  try {
    const userID = (await UserModel.findOne({ Email: req.user.email }))._id;
    const userOrders = await OrderModel.find({ userID });
    if (userOrders.length === 0) {
      res.send({ status: "ok", message: "No Orders" });
    } else {
      res.send(userOrders);
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/orders", checkUser, async (req, res) => {
  try {
    const userID = (await UserModel.findOne({ Email: req.user.email }))._id;
    req.body.userID = userID;
    const newOrder = new OrderModel(req.body);
    await newOrder.save();
    res.status(201).send({ status: "Ok", order: newOrder });
  } catch (e) {
    res.status(500).send(e);
  }
});
router.patch("/orders/:id", checkUser, async (req, res) => {
  try {
    const userID = (await UserModel.findOne({ Email: req.user.email }))._id;
    req.body.userID = userID;
    console.log(req.params.id);
    const changedOrder = await OrderModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.status(200).send({ status: "Ok", order: changedOrder });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.delete("/orders/:id", checkUser, async (req, res) => {
  try {
    await OrderModel.findByIdAndDelete(req.params.id);
    res.status(200).send({ status: "Ok" });
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/create-checkout-session", checkUser, async (req, res) => {
  const { cart } = req.body;
  let productsOrdered = [];

  try {
    const lineItems = await Promise.all(
      Object.entries(cart).map(async ([productId, quantity]) => {
        const product = await ProductModel.findById(productId);
        if (!product) {
          throw new Error(`Product with ID ${productId} not found`);
        }
        productsOrdered.push({
          productID: productId,
          orderedQuantity: quantity,
          sellerId: product.seller,
        });

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
            },
            unit_amount: product.price * 100,
          },
          quantity: quantity,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url:
        "http://localhost:3000/user?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/checkout",
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
    });

    const userID = (await UserModel.findOne({ Email: req.user.email }))._id;
    try {
      const newOrder = new OrderModel({
        productsOrdered,
        userID,
        sessionId: session.id,
      });
      await newOrder.save();
    } catch (e) {
      console.log(e);
    }

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the checkout session" });
  }
});

router.get("/session-status", checkUser, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );

    try {
      let Order = await OrderModel.findOne({
        sessionId: req.query.session_id,
      });
      Order.amount_subtotal = session.amount_subtotal;
      Order.currency = session.currency;
      Order.payment_intent = session.payment_intent;
      Order.payment_method_types = session.payment_method_types;
      Order.payment_status = session.payment_status;
      Order.customer_details = session.customer_details;
      Order.shipping_details = session.shipping_details;
      Order.status = session.status;

      await Order.save();
    } catch (e) {
      console.log(e);
    }

    res.send({
      status: session.status,
      customer_email: session.customer_details.email,
    });
  } catch (error) {
    console.error("Error retrieving session status:", error);
    res.status(500).send({ error: "Error retrieving session status" });
  }
});

module.exports = router;

const router = require("express").Router();
const checkAuth = require("../Util/checkauth");
const { UserModel, ProductModel } = require("../Models/AppModel");
const bcrypt = require("bcryptjs");
const { authenticateToken, upload } = require("../Util/utils");
// Middleware to check authentication
router.use(checkAuth);

// Route to fetch user details
router.get("/userDetails", async (req, res) => {
  try {
    const userData = req.user;
    const user = await UserModel.findOne({ Email: userData.email });

    if (!user) {
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
    }

    // Send user details without the password
    const { _id, UserName, Email, Role, PhoneNumber, Address } = user;
    res.json({
      status: "Success",
      User: {
        _id,
        UserName,
        Email,
        Role,
        PhoneNumber,
        Address,
      },
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
});

router.put("/updateProfile/:userID", async (req, res) => {
  const userID = req.params.userID; // Fetch user ID from URL params
  console.log("User ID:", userID);

  try {
    const user = await UserModel.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { email, phoneNumber, address } = req.body;

    // Your update logic here
    // user.UserName = username || user.UserName;
    user.Email = email;
    user.PhoneNumber = phoneNumber ;
    user.Address = address;
    // user.Password = user.Password;

    await user.save();

    res.status(200).json({ userID: userID, message: "User details updated successfully" });
  } catch (error) {
    console.error("Error updating user details:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});




// router.put("/updateProfile/:id", async (req, res) => {
//   const { username, email, phoneNumber, address, password, newPassword } =
//     req.body;

//   try {
//     const userId = req.body.id;
//     const user = await UserModel.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     // const isPasswordValid = await bcrypt.compare(password, user.Password);
//     // if (!isPasswordValid) {
//     //   return res.status(401).send("Invalid Password");
//     // }

//     user.UserName = username || user.UserName;
//     user.Email = email || user.Email;
//     user.PhoneNumber = phoneNumber || user.PhoneNumber;
//     user.Address = address || user.Address;
//     user.Password = newPassword ? newPassword : user.Password;
//     console.log("here", user);

//     await user.save();

//     res.status(200).json({ message: "User details updated successfully" });
//   } catch (error) {
//     console.error("Error updating user details:", error.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

router.get("/products", async (req, res) => {
  try {
    const products = await ProductModel.find().populate("seller", "UserName");

    res.status(200).json({ status: "Success", products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
});


// router.get("/products", async (req, res) => {
//   try {
//     const products = await ProductModel.find().populate("seller", "UserName");
//     res.status(200).json({ success: true, products });
//     } catch (error) {
//     console.error("Error fetching products:", error.message);
//     res
//       .status(500)
//       .json({ success: false, message: "Failed to fetch products" });
//   }
// });

router.get("/products/:id", async (req, res) => {
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

module.exports = router;

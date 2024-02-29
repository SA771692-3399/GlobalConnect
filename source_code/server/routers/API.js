const router = require("express").Router();
const checkAuth = require("../Util/checkauth");
const { UserModel, ProductModel } = require("../Models/AppModel");

// Middleware to check authentication
router.use(checkAuth);

// Route to fetch user details
router.get("/userDetails", async (req, res) => {
  try {
    const userData = req.user;
    const user = await UserModel.findOne({ Email: userData.email });

    if (!user) {
      return res.status(404).json({ status: "Error", message: "User not found" });
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

router.put("/updateProfile", async (req, res) => {
  const { name, email, phoneNumber, address, password, newPassword } = req.body;
  
  try {
    // Get the user's ID from the request object
    const userId = req.body.id;
  
    // Check if the user exists
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the current password
    const isPasswordValid = password;

    // if (!isPasswordValid) {
    //   return res.status(401).json({ message: "Incorrect password" });
    // }

    // Update user details
    user.UserName = name || user.UserName;
    user.Email = email || user.Email;
    user.PhoneNumber = phoneNumber || user.PhoneNumber;
    user.Address = address || user.Address;
    user.Password = newPassword ? newPassword : user.Password;

    await user.save();

    res.status(200).json({ message: "User details updated successfully" });
  } catch (error) {
    console.error("Error updating user details:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Route to fetch products
router.get("/products", async (req, res) => {
  try {
    const products = await ProductModel.find().populate('seller', 'UserName');
    res.status(200).json({ status: "Success", products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
});

module.exports = router;

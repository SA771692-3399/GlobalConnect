const router = require("express").Router();
const checkAuth = require("../Util/checkauth");
const { UserModel, ProductModel, PicModel, FaqModel } = require("../Models/AppModel");
const bcrypt = require("bcryptjs");
const { authenticateToken, upload } = require("../Util/utils");

router.use(checkAuth);

const checkAdminSeller = (req, res, next) => {
  try {
    if (!(req.user.role === "Admin" || req.user.role === "Seller" || req.user.role === "LocalOwner")) {
      throw new Error("User Not Authutenticated to access this route");
    }
    next();
  } catch (e) {
    res.status(403).send(e.message);
    console.error(e);
  }
};



router.post(
  "/products",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, productPrices, description, quantity, category, sizeProduct, spice } = req.body;
      const seller = req.body.seller; 

      if (
        !name ||
        !productPrices ||
        !description ||
        !quantity ||
        !req.file ||
        !seller ||
        !category ||
        !sizeProduct 
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields or image",
        });
      }

      const product = new ProductModel({
        name,
        description,
        quantity,
        image: req.file.path,
        seller,
        category,
        productPrices,
        sizeProduct,
        spice,
      });

      await product.save();
      res.status(201).json({
        success: true,
        message: "Product added successfully",
        product,
      });
    } catch (error) {
      console.error("Error adding product:", error.message);
      res
        .status(500)
        .json({ success: false, message: "Failed to add product" });
    }
  }
);

router.patch(
  "/myproduct/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const { name, placename } = req.body;
      console.log("Received request body:", req.body); // Log the request body for debugging
      const product = await ProductModel.findById(req.params.id);
      const newProduct = await ProductModel.findByIdAndUpdate(
        req.params.id,
        {
      
          placename: placename || product.placename, // Update placename instead of category
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
        product: newProduct,
      });
    } catch (error) {
      console.error("Error updating product:", error.message);
      res
        .status(500)
        .json({ success: false, message: "Failed to update product" });
    }
  }
);

router.patch(
  "/products/:id",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, productPrices, description, quantity, image, category , sizeProduct, spice} = req.body;
      const product = await ProductModel.findById(req.params.id);
      const newProduct = await ProductModel.findByIdAndUpdate(
        req.params.id,
        {
          name: name || product.name,
          description: description || product.description,
          quantity: quantity || product.quantity,
          image: req?.file?.path,
          category: category || product.category,
          productPrices: productPrices || product.productPrices,
          sizeProduct: sizeProduct || product.sizeProduct,
          spice: spice || product.spice,
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
        product: newProduct,
      });
    } catch (error) {
      console.error("Error updating product:", error.message);
      res
        .status(500)
        .json({ success: false, message: "Failed to update product" });
    }
  }
);

router.delete("/products/:id", async (req, res) => {
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


router.post(
  '/productsImage/:id',
  authenticateToken,
  upload.single('image'),
  async (req, res) => {
    try {
      const { name, productID } = req.body;
      let errorMessage = '';

      if (!name) {
        errorMessage += 'Name is required. ';
      }

      if (!req.file) {
        errorMessage += 'Image is required.';
      }

      if (errorMessage) {
        return res.status(400).json({
          success: false,
          message: errorMessage,
        });
      }

      // Save product image path to database
      const pic = new PicModel({
        name,
        productID,
        image: req.file.path, // Assuming multer saves file path in req.file.path
      });

      // Save product image in MongoDB
      await pic.save();

      // Update product details in your product model using productID
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        productID,
        { $set: { image: req.file.path } },
        { new: true }
      );

      res.status(201).json({
        success: true,
        message: 'Product image added successfully',
        updatedProduct,
      });
    } catch (error) {
      console.error('Error adding product image:', error.message);
      res.status(500).json({ success: false, message: 'Failed to add product image' });
    }
  }
);

router.get('/getallproductimgs/:productID', async (req, res) => {
  try {
    const productID = req.params.productID;
    const productImages = await PicModel.find({ productID });

    res.status(200).json({
      success: true,
      message: 'Product images retrieved successfully',
      productImages,
    });
  } catch (error) {
    console.error('Error getting product images:', error.message);
    res.status(500).json({ success: false, message: 'Failed to get product images' });
  }
});


router.delete("/productsImg/:id", async (req, res) => {
  try {
    const product = await PicModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Product Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete product Image" });
  }
});

router.post(
  "/addFaq",
  authenticateToken,
  async (req, res) => {
    try {
      const { que, ans } = req.body;
      if (!que || !ans) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      const faq = new FaqModel({
        que,
        ans,
      });

      await faq.save();
      res.status(201).json({
        success: true,
        message: "FAQ added successfully",
        faq,
      });
    } catch (error) {
      console.error("Error adding FAQ:", error.message);
      res.status(500).json({ success: false, message: "Failed to add FAQ" });
    }
  }
);

router.get('/listFaq', async (req, res) => {
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

router.patch(
  "/faqEdit/:id",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const { que, ans} = req.body;
      const product = await FaqModel.findById(req.params.id);
      const newProduct = await FaqModel.findByIdAndUpdate(
        req.params.id,
        {
          que: que || product.que,
          ans: ans || product.ans,
   },
        { new: true }
      );
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "FAQs not found" });
      }
      res.status(200).json({
        success: true,
        message: "FaqS updated successfully",
        product: newProduct,
      });
    } catch (error) {
      console.error("Error updating product:", error.message);
      res
        .status(500)
        .json({ success: false, message: "Failed to update FAQs" });
    }
  }
);

router.delete("/faqDelete/:id", async (req, res) => {
  try {
    const product = await FaqModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Faq not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Faq deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete Faq" });
  }
});
module.exports = router;

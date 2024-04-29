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
    enum: ["User", "Seller", "Admin", "LocalOwner"],
  },
  PhoneNumber: {
    type: String,
  },
  Address: {
    type: String,
  },
});

// // Pre-save hook to hash the password before saving to the database
// UserSchema.pre("save", async function (next) {
//   try {
//     // Hash the password using bcrypt with a salt of 10 rounds
//     this.Password = await bcrypt.hash(this.Password, 10);
//     next();
//   } catch (error) {
//     // If an error occurs during password hashing, pass it to the next middleware
//     next(error);
//   }
// });

const FeedbackSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String, // Corrected type to String
    required: true,
  },
  des: {
    type: String,
    required: true,
  }, 
});

const FaqSchema = new Schema({
  que: {
    type: String,
    required: true,
  },
  ans: {
    type: String,
    required: true,
  }, 
});

const ProductfSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  des: {
    type: String,
    required: true,
  }, 
  rating: {
    type: Number,
    required: true,
  },
  productID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});





// Define Product schema
const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  // price: {
  //   type: Number,
  //   required: true,
  // },
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
  placename: {
    type: String,
  },
  spice: {
    type: String,
  },
  productPrices: {
    type: [Object], // Change type to an array of strings
  },  
  sizeProduct: {
    type: [String], // Change type to an array of strings
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

// Define Product schema
const WishlistSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  productID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
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
  placename: {
    type: String,
  },
  spice: {
    type: String,
  },
  productPrices: {
    type: [Object], // Change type to an array of strings
  },  
  sizeProduct: {
    type: [String], // Change type to an array of strings
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
const PicSchema = new Schema({
  name: {
    type: String,
  },
  image: {
    type: String,

  },
  productID: {
    type: String,
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
      size: {
        type: String,
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
  userEmail: {
    type: String,
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
      productName: {
        type: String,
        required: true,
      },
      image: {
        type: String,
      },
      orderedQuantity: {
        type: Number,
        required: true,
      },
      productPrice: {
        type: Number,
        required: true,
      },
      orderedSize: {
        type: String,
        required: true,
      },
      sellerId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      productDeliveryStatus: {
        type: String,
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
  productsPrice: {
    type: Number,
  },
  shippingCharges: {
    type: Number,
  },
  shippingDiscount: {
    type: Number,
  },
  taxCharges: {
    type: Number,
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
    enum: ["Order placed", "Order confirmed", "Order processing", "Order Shipped", "Order Dispatched","In transit","Out for delivery","Delivered","Attempted delivery","Canceled","Held at customs","Awaiting pickup","Delayed","Lost"],
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

const ProductfModel = mongoose.model("ProductfModel", ProductfSchema);
const PicModel = mongoose.model("PicModel", PicSchema);
const CartModel = mongoose.model("CartModel", cartSchema);
const WishlistModel = mongoose.model("WishlistModel", WishlistSchema);
const OrderModel = mongoose.model("OrderModel", orderSchema);
const FaqModel = mongoose.model("FaqModel", FaqSchema);
const FeedbackModel = mongoose.model("FeedbackModel", FeedbackSchema);
module.exports = { ProductfModel, UserModel, ProductModel, CartModel, OrderModel, PicModel, FeedbackModel, WishlistModel, FaqModel };

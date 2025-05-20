const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user_id: String,
    user_ip_address: String,
    products: [
      {
        product_id: String,
        quantity: Number,
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema, "carts");

module.exports = Cart;

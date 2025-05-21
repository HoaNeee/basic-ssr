const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");

const productHelper = require("../../helpers/product");

//[GET] /checkout
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({ _id: cartId });

  if (cart.products.length > 0) {
    for (let item of cart.products) {
      const product = await Product.findOne({
        _id: item.product_id,
        deleted: false,
      }).select("title thumbnail price discountPercentage slug");
      product.priceNew = productHelper.priceNew(product);
      item.product = product;
      item.totalPrice = item.product.priceNew * item.quantity;
    }
  }

  let totalPriceCart = 0;
  for (let item of cart.products) {
    totalPriceCart += item.totalPrice;
  }

  res.render("client/pages/checkout/index.pug", {
    titlePage: "Thanh toán",
    cart: cart,
    totalPriceCart: totalPriceCart,
  });
};

//[POST] /checkout/order
module.exports.checkoutPost = async (req, res) => {
  res.redirect("/checkout/order");
};

//[GET] /checkout/order
module.exports.checkout = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({ _id: cartId });
    if (cart.products.length <= 0) {
      req.flash("error", "Hãy thêm sản phẩm vào giỏ hàng");
      res.redirect(req.get("Referer"));
      return;
    }
    let products = [];

    for (let item of cart.products) {
      const product = await Product.findOne({ _id: item.product_id }).select(
        "price discountPercentage"
      );
      if (product) {
        products.push({
          product_id: item.product_id,
          price: product.price,
          discountPercentage: product.discountPercentage,
          quantity: item.quantity,
        });
      }
    }
    cart.products = [];
    await cart.save();

    const order = new Order({
      cart_id: cartId,
      user_info: req.body,
      products: products,
    });

    await order.save();

    let totalPrice = 0;
    for (let item of order.products) {
      const product = await Product.findOne({ _id: item.product_id }).select(
        "title thumbnail"
      );
      item.priceNew = productHelper.priceNew(item);
      item.totalPrice = item.priceNew * item.quantity;
      totalPrice += item.totalPrice;
      item.thumbnail = product.thumbnail;
      item.title = product.title;
    }

    res.render("client/pages/checkout/checkout-success.pug", {
      titlePage: "Đặt hành thành công",
      order: order,
      totalPrice: totalPrice,
    });
  } catch (error) {
    req.flash("error", `An error occurred! ${error}`);
    res.redirect(req.get("Referer"));
  }
};

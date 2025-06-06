const Cart = require("../../models/cart.model");
const User = require("../../models/user.model");

module.exports.cartId = async (req, res, next) => {
  //dong nay luon chay vao
  if (!req.cookies.cartId) {
    //get ip
    const response = await fetch("https://api.ipify.org?format=json");
    const result = await response.json();
    const ipAddress = result.ip;

    //cart
    const existsIp = await Cart.find({
      user_ip_address: ipAddress,
    });
    if (existsIp.length <= 10) {
      const cart = new Cart({
        user_ip_address: ipAddress,
      });
      await cart.save();

      //set cookie
      const maxAge = 1000 * 60 * 60 * 24 * 10;
      res.cookie("cartId", String(cart._id), {
        maxAge: maxAge,
      });
    } else {
      res.send("Bạn không có quyền truy cập!");
      return;
    }
  } else {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
      _id: cartId,
    });
    if (!cart) {
      res.clearCookie("cartId");
      res.redirect("/");
      return;
    } else {
      if (cart.user_id) {
        const userId = cart.user_id;
        const user = await User.findOne({ _id: userId, deleted: false });
        if (!user || user.status === "locked") {
          res.clearCookie("cartId");
          res.redirect("/");
          return;
        }
      }
      let totalQuantity = 0;
      for (let item of cart.products) {
        totalQuantity += item.quantity;
      }
      res.locals.cartId = cartId;
      res.locals.totalQuantity = totalQuantity;
    }
  }
  next();
};

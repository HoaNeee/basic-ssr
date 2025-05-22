const layoutCategoryMiddleware = require("../../middlewares/client/layoutCategory.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
const settingMiddleware = require("../../middlewares/client/setting.middleware");

const productRoute = require("./product.route");
const homeRoute = require("./home.route");
const searchRoute = require("./search.route");
const cartRoute = require("./cart.route");
const checkoutRoute = require("./checkout.route");
const userRoute = require("./user.route");

module.exports = (app) => {
  app.use(layoutCategoryMiddleware.category);
  app.use(userMiddleware.infoUser);
  app.use(settingMiddleware.settingGeneral);
  app.use(cartMiddleware.cartId);

  app.use("/", homeRoute);

  app.use("/products", productRoute);
  app.use("/cart", cartRoute);
  app.use("/search", searchRoute);
  app.use("/checkout", checkoutRoute);
  app.use("/user", userRoute);
};

const layoutCategoryMiddleware = require("../../middlewares/client/layoutCategory.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");

const productRoute = require("./product.route");
const homeRoute = require("./home.route");
const searchRoute = require("./search.route");
const cartRoute = require("./cart.route");

module.exports = (app) => {
  app.use(layoutCategoryMiddleware.category);
  app.use(cartMiddleware.cartId);

  app.use("/", homeRoute);

  app.use("/products", productRoute);

  app.use("/cart", cartRoute);
  app.use("/search", searchRoute);
};

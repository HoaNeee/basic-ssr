const productRoute = require("./product.route");
const homeRoute = require("./home.route");
const layoutCategoryMiddleware = require("../../middlewares/client/layoutCategory.middleware");

module.exports = (app) => {
  app.use(layoutCategoryMiddleware.category);

  app.use("/", homeRoute);

  app.use("/products", productRoute);
};

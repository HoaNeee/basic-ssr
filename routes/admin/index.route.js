const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");
const productCategoryRoute = require("./product-category.route");
const system = require("../../config/system");

module.exports = (app) => {
  const PATH_ADMIN = system.prefixAdmin;
  app.use(PATH_ADMIN + "/", dashboardRoute);

  app.use(PATH_ADMIN + "/products", productRoute);

  app.use(PATH_ADMIN + "/products-category", productCategoryRoute);
};

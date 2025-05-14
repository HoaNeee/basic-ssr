const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");
const system = require("../../config/system");

module.exports = (app) => {
  const PATH_ADMIN = system.prefixAdmin;
  app.use(PATH_ADMIN + "/", dashboardRoute);

  app.use(PATH_ADMIN + "/products", productRoute);
};

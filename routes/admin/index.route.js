const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");
const productCategoryRoute = require("./product-category.route");
const rolesRoute = require("./roles.route");
const accountRoute = require("./account.route");
const authRoute = require("./auth.route");

const authMiddleware = require("../../middlewares/admin/auth.middleware");
const system = require("../../config/system");

module.exports = (app) => {
  const PATH_ADMIN = system.prefixAdmin;

  app.use(
    PATH_ADMIN + "/dashboard",
    authMiddleware.requireAuth,
    dashboardRoute
  );

  app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productRoute);

  app.use(
    PATH_ADMIN + "/products-category",
    authMiddleware.requireAuth,
    productCategoryRoute
  );

  app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, rolesRoute);

  app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountRoute);

  app.use(PATH_ADMIN + "/auth", authRoute);

  //FIX THEN
  // app.use("/admin/", (req, res) => {
  //   res.redirect("/admin/dashboard");
  // });
};

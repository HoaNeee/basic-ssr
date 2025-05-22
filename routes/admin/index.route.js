const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");
const productCategoryRoute = require("./product-category.route");
const rolesRoute = require("./roles.route");
const accountRoute = require("./account.route");
const authRoute = require("./auth.route");
const myInfoRoute = require("./my-info.route");
const newsRoute = require("./news.route");
const settingRoute = require("./setting.route");
const userRoute = require("./user.route");
const orderRoute = require("./order.route");

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

  app.use(PATH_ADMIN + "/my-info", authMiddleware.requireAuth, myInfoRoute);

  app.use(PATH_ADMIN + "/news", authMiddleware.requireAuth, newsRoute);

  app.use(PATH_ADMIN + "/users", authMiddleware.requireAuth, userRoute);
  app.use(PATH_ADMIN + "/setting", authMiddleware.requireAuth, settingRoute);
  app.use(PATH_ADMIN + "/orders", authMiddleware.requireAuth, orderRoute);

  // FIX THEN
  // app.use("/admin/", (req, res) => {
  //   res.redirect("/admin/dashboard");
  // });
};

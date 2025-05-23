const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");
const Order = require("../../models/order.model");

//[GET] /admin/dashboard
module.exports.index = async (req, res) => {
  const analysis = {
    products: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    productCategory: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    accounts: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    users: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    orders: {
      total: 0,
      initial: 0,
      approved: 0,
      delivering: 0,
      completed: 0,
      cancel: 0,
    },
  };

  const countProduct = await Product.countDocuments({ deleted: false });
  const countProductActive = await Product.countDocuments({
    status: "active",
    deleted: false,
  });
  const countProductInactive = await Product.countDocuments({
    status: "inactive",
    deleted: false,
  });
  const countProductCategory = await ProductCategory.countDocuments({
    deleted: false,
  });
  const countProductCategoryActive = await ProductCategory.countDocuments({
    status: "active",
    deleted: false,
  });
  const countProductCategoryInactive = await ProductCategory.countDocuments({
    status: "inactive",
    deleted: false,
  });

  const countAccount = await Account.countDocuments({ deleted: false });
  const countAccountActive = await Account.countDocuments({
    status: "active",
    deleted: false,
  });

  const countAccountInactive = await Account.countDocuments({
    status: "inactive",
    deleted: false,
  });

  const countUser = await User.countDocuments({ deleted: false });
  const countUserActive = await User.countDocuments({
    status: "active",
    deleted: false,
  });
  const countUserInactive = await User.countDocuments({
    status: "inactive",
    deleted: false,
  });

  analysis.products.total = countProduct;
  analysis.productCategory.total = countProductCategory;
  analysis.accounts.total = countAccount;
  analysis.users.total = countUser;

  analysis.users.active = countUserActive;
  analysis.users.inactive = countUserInactive;

  analysis.products.active = countProductActive;
  analysis.products.inactive = countProductInactive;

  analysis.productCategory.active = countProductCategoryActive;
  analysis.productCategory.inactive = countProductCategoryInactive;

  analysis.accounts.active = countAccountActive;
  analysis.accounts.inactive = countAccountInactive;

  const countOrder = await Order.countDocuments({ deleted: false });
  const countOrderInittial = await Order.countDocuments({
    status: "initial",
    deleted: false,
  });
  const countOrderApproved = await Order.countDocuments({
    status: "approved",
    deleted: false,
  });
  const countOrderDelivering = await Order.countDocuments({
    status: "delivering",
    deleted: false,
  });
  const countOrderCompleted = await Order.countDocuments({
    status: "completed",
    deleted: false,
  });
  const countOrderCancel = await Order.countDocuments({
    status: "cancel",
    deleted: false,
  });

  analysis.orders.total = countOrder;
  analysis.orders.initial = countOrderInittial;
  analysis.orders.approved = countOrderApproved;
  analysis.orders.delivering = countOrderDelivering;
  analysis.orders.completed = countOrderCompleted;
  analysis.orders.cancel = countOrderCancel;

  res.render("admin/pages/dashboard/index", {
    titlePage: "Dashboard",
    analysis: analysis,
  });
};

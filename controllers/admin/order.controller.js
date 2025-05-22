const Order = require("../../models/order.model");
const Product = require("../../models/product.model");

const product = require("../../helpers/product");
const search = require("../../helpers/search");
const system = require("../../config/system");

//[GET] /admin/orders
module.exports.index = async (req, res) => {
  let filterBtn = [
    {
      title: "Tất cả",
      selected: false,
      status: "",
    },
    {
      title: "Chờ duyệt",
      selected: false,
      status: "initial",
    },
    {
      title: "Đã duyệt",
      selected: false,
      status: "approved",
    },
    {
      title: "Đã hủy",
      selected: false,
      status: "cancel",
    },
    {
      title: "Vận chuyển",
      selected: false,
      status: "delivering",
    },
    {
      title: "Hoàn thành",
      selected: false,
      status: "completed",
    },
  ];

  if (req.query.status) {
    const index = filterBtn.findIndex((btn) => btn.status === req.query.status);
    filterBtn[index].selected = true;
  } else {
    filterBtn[0].selected = true;
  }

  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = search(req.query);
  if (req.query.q) {
    find["user_info.fullname"] = objectSearch.regex;
  }

  const records = await Order.find(find).lean();

  for (let item of records) {
    let totalPrice = 0;
    for (let pro of item.products) {
      let totalPriceProduct = product.priceNew(pro);
      totalPrice += totalPriceProduct * pro.quantity;
    }
    item.totalPrice = Number(totalPrice);
  }

  if (req.query.sortKey && req.query.sortValue) {
    const key = req.query.sortKey;
    const value = req.query.sortValue;
    let sort = 1;
    if (value === "desc") {
      sort = -1;
    }
    records.sort((a, b) => {
      return a[key] < b[key] ? sort * -1 : sort;
    });
  }

  res.render("admin/pages/orders/index.pug", {
    titlePage: "Đơn hàng",
    records: records,
    filterStatus: filterBtn,
    query: objectSearch.q,
  });
};

//[PATCH] /admin/orders/change-status
module.exports.changeStatus = async (req, res) => {
  try {
    const [id, status] = req.body.status.split("-");
    await Order.updateOne({ _id: id }, { status: status });
    req.flash("success", "Successfully");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "An error occurred" + error);
    res.redirect(req.get("Referer"));
  }
};

//[PATCH] /admin/orders/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
      case "initial":
        await Order.updateMany({ _id: { $in: ids } }, { status: "initial" });
        break;
      case "approved":
        await Order.updateMany({ _id: { $in: ids } }, { status: "approved" });
        break;
      case "delivering":
        await Order.updateMany({ _id: { $in: ids } }, { status: "delivering" });
        break;
      case "cancel":
        await Order.updateMany({ _id: { $in: ids } }, { status: "cancel" });
        break;
      case "completed":
        await Order.updateMany({ _id: { $in: ids } }, { status: "completed" });
        break;
      case "delete-all":
        await Order.updateMany(
          { _id: { $in: ids } },
          { deleted: true, deletedAt: new Date() }
        );
        break;
      default:
        break;
    }
    req.flash("success", "Successfully");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "An error occurred" + error);
    res.redirect(req.get("Referer"));
  }
};

//[GET] /admin/orders/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findOne({ _id: id, deleted: false });
    let totalPrice = 0;
    for (const item of order.products) {
      const pro = await Product.findOne({ _id: item.product_id });
      item.title = pro.title;
      item.priceNew = product.priceNew(item);
      item.thumbnail = pro.thumbnail;
      item.totalPrice = item.priceNew * item.quantity;
      totalPrice += item.totalPrice;
    }

    res.render("admin/pages/orders/edit.pug", {
      titlePage: "Chỉnh sửa đơn hàng",
      order: order,
      totalPrice: totalPrice,
    });
  } catch (error) {
    req.flash("error", "An error occurred" + error);
    res.redirect(`${system.prefixAdmin}/orders`);
  }
};

//[PATCH] /admin/orders/edit/info/:id
module.exports.editInfo = async (req, res) => {
  try {
    const id = req.params.id;
    const user_info = {
      fullname: req.body.fullname,
      phone: req.body.phone,
      address: req.body.address,
    };
    await Order.updateOne(
      { _id: id },
      { user_info: user_info, status: req.body.status }
    );
    req.flash("success", "Successfully");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "An error occurred" + error);
    res.redirect(`${system.prefixAdmin}/orders`);
  }
};

//[PATCH] /admin/orders/edit/:id/products/:productId
module.exports.editProduct = async (req, res) => {
  try {
    const orderId = req.params.id;
    const productId = req.params.productId;
    const order = await Order.findOne({ _id: orderId });
    //status can be initial,approved shouldnt be completed, delivering

    const index = order.products.findIndex(
      (item) => item.product_id === productId
    );
    if (index !== -1) {
      const quantity = Number(req.body.quantity);
      order.products[index].quantity = quantity;
      await order.save();
    }

    req.flash("success", "Successfully");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "An error occurred" + error);
    res.redirect(`${system.prefixAdmin}/orders`);
  }
};

//[DELETE] /admin/orders/edit/:id/products/:productId
module.exports.deleteProduct = async (req, res) => {
  try {
    const orderId = req.params.id;
    const productId = req.params.productId;
    const order = await Order.findOne({ _id: orderId });
    //status can be initial,approved shouldnt be completed, delivering

    const index = order.products.findIndex(
      (item) => item.product_id === productId
    );
    if (index !== -1) {
      order.products.splice(index, 1);
      await order.save();
    }

    req.flash("success", "Successfully");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "An error occurred" + error);
    res.redirect(`${system.prefixAdmin}/orders`);
  }
};

//[GET] /admin/orders/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findOne({ _id: id, deleted: false });
    let totalPrice = 0;
    for (const item of order.products) {
      const pro = await Product.findOne({ _id: item.product_id });
      item.title = pro.title;
      item.priceNew = product.priceNew(item);
      item.thumbnail = pro.thumbnail;
      item.totalPrice = item.priceNew * item.quantity;
      totalPrice += item.totalPrice;
    }

    res.render("admin/pages/orders/detail.pug", {
      titlePage: "Thông tin đơn hàng",
      order: order,
      totalPrice: totalPrice,
    });
  } catch (error) {
    req.flash("error", "An error occurred" + error);
    res.redirect(`${system.prefixAdmin}/orders`);
  }
};

//[DELETE] /admin/orders/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await Order.updateOne(
      { _id: id },
      { deleted: true, deletedAt: new Date() }
    );
    req.flash("success", "Successfully");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "An error occurred" + error);
    res.redirect(`${system.prefixAdmin}/orders`);
  }
};

const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const system = require("../../config/system");

const createTree = require("../../helpers/createTree");
const filterStatus = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

//[GET] /admin/products/
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  //filter
  let filtersStatus = filterStatus(req.query);
  if (req.query.status) {
    find.status = req.query.status;
  }

  //sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort["position"] = "desc";
  }

  //search
  let objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  //pagination
  const totalProduct = await Product.countDocuments(find);

  const objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    totalProduct
  );

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
  res.render("admin/pages/products/index", {
    titlePage: "Products",
    products: products,
    filtersStatus: filtersStatus,
    query: objectSearch.q,
    totalPage: objectPagination.totalPage,
    objPagi: objectPagination,
  });
};

//[PATCH] /admin/products/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });

  //co 2 lua chon cho redirect
  //1. dung req.get("Referer")
  //2. gui redirect tu phia client thong qua query || params -> recomend
  const redirect = req.query.redirect;
  req.flash("success", "Cập nhật thành công!");

  res.redirect(req.get("Referer"));
};

//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  const redirect = req.query.redirect;

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: type });
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: type });
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        { deleted: true, deletedAt: new Date() }
      );
      break;
    case "change-position":
      for (let i = 0; i < ids.length; i++) {
        const [id, posValue] = ids[i].split("-");
        await Product.updateOne({ _id: id }, { position: posValue });
      }
      break;
    default:
      break;
  }
  req.flash("success", "Cập nhật thành công!");
  res.redirect(redirect);
};

//[DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  //recomend for deletedAt
  await Product.updateOne(
    { _id: id },
    { deleted: true, deletedAt: new Date() }
  );
  req.flash("success", "Xóa thành công!");
  const urlBack = req.get("Referer");
  res.redirect(urlBack);
};

//[GET] /admin/products/create
module.exports.create = async (req, res) => {
  let findCategory = {
    deleted: false,
  };
  const recordsCategory = await ProductCategory.find(findCategory);
  const newRecordsCategory = createTree.create(recordsCategory, "");

  res.render("admin/pages/products/create", {
    titlePage: "Create new product",
    records: newRecordsCategory,
  });
};

//[POST] /admin/products/create
module.exports.createProduct = async (req, res) => {
  req.body.price = Number(req.body.price);
  req.body.stock = Number(req.body.stock);
  req.body.discountPercentage = Number(req.body.discountPercentage);
  if (req.body.position) {
    req.body.position = Number(req.body.position);
  } else {
    const count = await Product.countDocuments();
    req.body.position = count + 1;
  }

  const product = new Product(req.body);
  await product.save();

  res.redirect("/admin/products");
};

//[GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      deleted: false,
      _id: id,
    };

    const product = await Product.findOne(find);
    const recordsCategory = await ProductCategory.find({ deleted: false });

    const newRecords = createTree.create(recordsCategory, "");

    res.render("admin/pages/products/edit", {
      titlePage: "Edit product",
      product: product,
      records: newRecords,
    });
  } catch (error) {
    req.flash("error", "Không tìm thấy sản phẩm");
    res.redirect(`${system.prefixAdmin}/products`);
  }
};

//[PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    req.body.price = Number(req.body.price);
    req.body.discountPercentage = Number(req.body.discountPercentage);
    req.body.stock = Number(req.body.stock);
    req.body.position = Number(req.body.position);

    // WHEN USER UPDATE WITH IMAGE HAVE PROBLEM, FIX THEN

    await Product.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật thành công");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "Không thành công!");
    res.redirect(req.get("Referer"));
  }
};

//[GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      deleted: false,
      _id: id,
    };

    const product = await Product.findOne(find);

    res.render("admin/pages/products/detail", {
      titlePage: product.title,
      product: product,
    });
  } catch (error) {
    req.flash("error", "Không tìm thấy sản phẩm");
    res.redirect(`${system.prefixAdmin}/products`);
  }
};

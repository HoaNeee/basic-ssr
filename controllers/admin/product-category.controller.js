const ProductCategory = require("../../models/product-category.model");
const system = require("../../config/system");
const createTree = require("../../helpers/createTree");

//[GET] /admin/products-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await ProductCategory.find(find);

  const newRecords = createTree.create(records, "");

  res.render("admin/pages/products-category/index", {
    titlePage: "Danh mục sản phẩm",
    records: newRecords,
  });
};

//[GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await ProductCategory.find(find);

  const newRecords = createTree.create(records, "");

  res.render("admin/pages/products-category/create", {
    titlePage: "Create new category",
    records: newRecords,
  });
};

//[POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if (!req.body.thumbnail) {
    req.body.thumbnail = "";
  }

  if (!req.body.position) {
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = Number(req.body.position);
  }

  const record = new ProductCategory(req.body);

  await record.save();

  res.redirect(`${system.prefixAdmin}/products-category`);
};

//[GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      deleted: false,
      _id: id,
    };
    const record = await ProductCategory.findOne(find);
    const allRecordsCategory = await ProductCategory.find({ deleted: false });

    const newRecordsCategory = createTree.create(allRecordsCategory, "");

    res.render("admin/pages/products-category/edit.pug", {
      titlePage: record.title,
      record: record,
      allRecordsCategory: newRecordsCategory,
    });
  } catch (error) {
    res.redirect(`${system.prefixAdmin}/products-category`);
  }
};

//[PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    if (req.body.position) {
      req.body.position = Number(req.body.position);
    } else {
      const count = await ProductCategory.countDocuments();
      req.body.position = count + 1;
    }
    await ProductCategory.updateOne({ _id: id }, req.body);
    res.redirect(req.get("Referer"));
  } catch (error) {
    res.redirect(`${system.prefixAdmin}/products-category`);
  }
};

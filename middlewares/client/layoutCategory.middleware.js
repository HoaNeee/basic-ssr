const ProductCategory = require("../../models/product-category.model");
const createTree = require("../../helpers/createTree.js");

module.exports.category = async (req, res, next) => {
  const productsCategory = await ProductCategory.find({
    deleted: false,
    status: "active",
  });
  const layoutCategory = createTree.create(productsCategory, "");
  res.locals.layoutCategory = layoutCategory;
  next();
};

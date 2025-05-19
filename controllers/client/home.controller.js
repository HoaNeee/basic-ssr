const ProductCategory = require("../../models/product-category.model.js");
const createTree = require("../../helpers/createTree.js");

//[GET] /
module.exports.index = async (req, res) => {
  const productsCategory = await ProductCategory.find({
    deleted: false,
    status: "active",
  });
  const newCategory = createTree.create(productsCategory, "");

  res.render("client/pages/home/index", {
    titlePage: "Home",
    productsCategory: newCategory,
  });
};

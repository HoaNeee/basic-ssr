const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");

//[GET] /
module.exports.index = async (req, res) => {
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).limit(4);

  const newProductsFeatured = productsFeatured.map((pro) => {
    pro.priceNew = productHelper.priceNew(pro);
    return pro;
  });

  const newProducts = await Product.find({
    deleted: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(8);

  const newProductsNew = newProducts.map((pro) => {
    pro.priceNew = productHelper.priceNew(pro);
    return pro;
  });

  res.render("client/pages/home/index", {
    titlePage: "Home",
    productsFeatured: newProductsFeatured,
    newProducts: newProductsNew,
  });
};

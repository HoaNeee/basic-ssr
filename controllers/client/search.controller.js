const Product = require("../../models/product.model");
const product = require("../../helpers/product");

//[GET] /search
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;

  const products = await Product.find({
    title: new RegExp(keyword, "i"),
    deleted: false,
    status: "active",
  });

  const newProducts = products.map((item) => {
    item.priceNew = product.priceNew(item);
    return item;
  });

  res.render("client/pages/search/index.pug", {
    titlePage: "Tìm kiếm",
    products: newProducts,
    query: keyword,
  });
};

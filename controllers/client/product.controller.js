const Product = require("../../models/product.model");

//[GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });
  const newProducts = products.map((pro) => {
    const newObj = { ...pro };

    return {
      ...newObj._doc,
      priceNew: Number(
        pro.price - (pro.price * pro.discountPercentage) / 100
      ).toFixed(1),
    };
  });
  // console.log(products);
  res.render("client/pages/products/index", {
    titlePage: "Products",
    products: newProducts,
  });
};

//[GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
  try {
    let find = {
      deleted: false,
      status: "active",
      slug: req.params.slug,
    };
    const product = await Product.findOne(find);

    res.render("client/pages/products/detail", {
      titlePage: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect("/products");
  }

  // console.log(products);
};

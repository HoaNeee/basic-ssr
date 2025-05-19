const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const productHelper = require("../../helpers/product");

//[GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });
  const newProducts = products.map((pro) => {
    pro.priceNew = productHelper.priceNew(pro);
    return pro;
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

    product.priceNew = productHelper.priceNew(product);

    res.render("client/pages/products/detail", {
      titlePage: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect("/products");
  }

  // console.log(products);
};

//[GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  try {
    const slugCategory = req.params.slugCategory;
    const category = await ProductCategory.findOne({
      slug: slugCategory,
      deleted: false,
      status: "active",
    });

    //tim tat ca danh muc con cua danh muc dang duoc chon -> vet can

    const findChild = async (id) => {
      const childs = await ProductCategory.find({
        parent_id: id,
        deleted: false,
        // status: 'active'
      });
      if (childs && childs.length > 0) {
        let arr = [...childs];
        for (const item of childs) {
          const arrChild = await findChild(item._id);
          arr = arr.concat(arrChild);
        }

        return arr;
      }
      return [];
    };

    const arr = await findChild(category._id);
    arr.push(category);

    const idsCategory = arr.map((i) => String(i._id));

    const productsCategory = await Product.find({
      product_category_id: { $in: idsCategory },
      deleted: false,
      status: "active",
    });

    const newProductsCategory = productsCategory.map((item) => {
      item.priceNew = productHelper.priceNew(item);
      return item;
    });

    res.render("client/pages/products/index.pug", {
      titlePage: category.title,
      products: newProductsCategory,
    });
  } catch (error) {
    res.redirect("/");
  }
};

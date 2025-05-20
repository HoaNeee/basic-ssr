const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");

//[GET] /cart
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({ _id: cartId });

  if (cart.products.length > 0) {
    for (let item of cart.products) {
      const product = await Product.findOne({
        _id: item.product_id,
        deleted: false,
      }).select("title thumbnail price discountPercentage slug");
      product.priceNew = productHelper.priceNew(product);
      item.product = product;
      item.totalPrice = item.product.priceNew * item.quantity;
    }
  }

  let totalPriceCart = 0;
  for (let item of cart.products) {
    totalPriceCart += item.totalPrice;
  }

  res.render("client/pages/cart/index.pug", {
    titlePage: "Giỏ hàng",
    cart: cart,
    totalPriceCart: totalPriceCart,
  });
};

//[POST] /cart/add/:productId
module.exports.add = async (req, res) => {
  try {
    const productId = req.params.productId;
    const quantity = Number(req.body.quantity);
    const cartId = res.locals.cartId;

    const cart = await Cart.findOne({
      _id: cartId,
    });

    const existProduct = cart.products.find(
      (item) => item.product_id === productId
    );

    if (existProduct) {
      const quantityNew = quantity + Number(existProduct.quantity);

      await Cart.updateOne(
        { _id: cartId, "products.product_id": productId },
        {
          $set: {
            "products.$.quantity": quantityNew,
          },
        }
      );
    } else {
      await Cart.updateOne(
        {
          _id: cartId,
        },
        {
          $push: {
            products: {
              product_id: productId,
              quantity: quantity,
            },
          },
        }
      );
    }
    req.flash("success", "Thêm vào giỏ hàng thành công!");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "An error occurred!");
    res.redirect(req.get("Referer"));
  }
};

//[PATCH] /cart/update/:productId
module.exports.updateCart = async (req, res) => {
  try {
    const productId = req.params.productId;
    const quantity = Number(req.body.quantity);
    const cartId = req.cookies.cartId;

    await Cart.updateOne(
      { _id: cartId, "products.product_id": productId },
      {
        "products.$.quantity": quantity,
      }
    );
    req.flash("success", "Cập nhật số lượng thành công!");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "An error occurred!");
    res.redirect(req.get("Referer"));
  }
};

//[DELETE] /cart/delete/:productId
module.exports.deleteCart = async (req, res) => {
  try {
    const productId = req.params.productId;
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({ _id: cartId });

    //or $delete in mongodb
    if (cart && cart.products.length > 0) {
      const index = cart.products.findIndex((c) => c.product_id === productId);
      if (index != -1) {
        cart.products.splice(index, 1);
        await cart.save();
      }
    }

    req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng!");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "An error occurred!");
    res.redirect(req.get("Referer"));
  }
};

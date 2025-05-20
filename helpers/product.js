module.exports.priceNew = (product) => {
  const priceNew = Number(
    product.price - (product.price * product.discountPercentage) / 100
  ).toFixed(0);

  return priceNew;
};

module.exports = (objectInitial, query, totalProduct) => {
  const objectPagination = {
    ...objectInitial,
  };

  objectPagination.totalPage = Math.ceil(
    totalProduct / objectPagination.limitItems
  );

  if (query.page) {
    let page = Number(query.page);
    objectPagination.currentPage = page;
    objectPagination.skip = (page - 1) * objectPagination.limitItems;
  }

  return objectPagination;
};

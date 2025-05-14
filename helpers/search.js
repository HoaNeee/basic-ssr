module.exports = (query) => {
  const objectSearch = {
    q: "",
    regex: "",
  };

  if (query.q) {
    objectSearch.q = query.q;
    objectSearch.regex = new RegExp(query.q, "i");
  }
  return objectSearch;
};

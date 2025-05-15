let count = 0;
const createTree = (arr, parent_id) => {
  let treeArray = [];
  for (let i = 0; i < arr.length; i++) {
    let object = arr[i];
    if (object.parent_id === parent_id) {
      ++count;
      object.index = count;
      const childArray = createTree(arr, object.id);
      object.childArray = childArray;

      treeArray.push(object);
    }
  }
  return treeArray;
};

module.exports.create = (arr, parent_id) => {
  count = 0;
  const newArray = createTree(arr, parent_id);
  return newArray;
};

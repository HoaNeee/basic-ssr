const ProductCategory = require("../../models/product-category.model");

const system = require("../../config/system");
const createTree = require("../../helpers/createTree");
const filterStatus = require("../../helpers/filterStatus");
const search = require("../../helpers/search");

//[GET] /admin/products-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const filtersStatus = filterStatus(req.query);
  if (req.query.status) {
    find.status = req.query.status;
  }
  const objectSearch = search(req.query);
  if (req.query.q) {
    find.title = objectSearch.regex;
  }

  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    if (req.query.sortKey !== "tree") {
      sort[req.query.sortKey] = req.query.sortValue;
    }
  }

  const records = await ProductCategory.find(find).sort(sort);
  const newRecords = createTree.create(records, "");

  res.render("admin/pages/products-category/index", {
    titlePage: "Danh mục sản phẩm",
    records: newRecords,
    recordsSort: records,
    filterStatus: filtersStatus,
    query: objectSearch.q,
  });
};

//[GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await ProductCategory.find(find);

  const newRecords = createTree.create(records, "");

  res.render("admin/pages/products-category/create", {
    titlePage: "Create new category",
    records: newRecords,
  });
};

//[POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if (!req.body.thumbnail) {
    req.body.thumbnail = "";
  }

  if (!req.body.position) {
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = Number(req.body.position);
  }

  const record = new ProductCategory(req.body);

  await record.save();

  res.redirect(`${system.prefixAdmin}/products-category`);
};

//[GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      deleted: false,
      _id: id,
    };
    const record = await ProductCategory.findOne(find);
    const allRecordsCategory = await ProductCategory.find({ deleted: false });

    const newRecordsCategory = createTree.create(allRecordsCategory, "");

    res.render("admin/pages/products-category/edit.pug", {
      titlePage: record.title,
      record: record,
      allRecordsCategory: newRecordsCategory,
    });
  } catch (error) {
    res.redirect(`${system.prefixAdmin}/products-category`);
  }
};

//[PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    if (req.body.position) {
      req.body.position = Number(req.body.position);
    } else {
      const count = await ProductCategory.countDocuments();
      req.body.position = count + 1;
    }
    await ProductCategory.updateOne({ _id: id }, req.body);
    res.redirect(req.get("Referer"));
  } catch (error) {
    res.redirect(`${system.prefixAdmin}/products-category`);
  }
};

//[PATCH] /admin/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const id = req.params.id;
    await ProductCategory.updateOne(
      { _id: id },
      {
        status: status,
      }
    );
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "Có lỗi xảy ra!");
    res.redirect(`${system.prefixAdmin}/products-category`);
  }
};

//[PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
      case "active":
        await ProductCategory.updateMany(
          {
            _id: { $in: ids },
          },
          {
            status: "active",
          }
        );
        break;
      case "inactive":
        await ProductCategory.updateMany(
          {
            _id: { $in: ids },
          },
          {
            status: "inactive",
          }
        );
        break;
      case "change-position":
        for (let i = 0; i < ids.length; i++) {
          const [id, posValue] = ids[i].split("-");
          await ProductCategory.updateOne(
            {
              _id: id,
            },
            {
              position: posValue,
            }
          );
        }

        break;
      case "delete-all":
        await ProductCategory.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted: true,
            deletedAt: new Date(),
          }
        );
        break;
      default:
        break;
    }
    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    req.flash("error", "Có lỗi xảy ra!");
    res.redirect(`${system.prefixAdmin}/products-category`);
  }
  res.redirect(req.get("Referer"));
};

//[DELETE] /admin/products-category/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await ProductCategory.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );
    req.flash("success", "Xóa thành công!");
  } catch (error) {
    req.flash("error", "Có lỗi xảy ra!");
  }
  res.redirect(req.get("Referer"));
};

//[GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const productCategory = await ProductCategory.findOne({
      _id: id,
      deleted: false,
    });
    if (productCategory.parent_id) {
      const parentCategory = await ProductCategory.findOne({
        _id: productCategory.parent_id,
        // deleted: false
      });
      productCategory.parentName = parentCategory.title;
    }
    res.render("admin/pages/products-category/detail.pug", {
      titlePage: productCategory.title,
      productCategory: productCategory,
    });
  } catch (error) {
    req.flash("error", "Có lỗi xảy ra!");
    res.redirect(req.get("Referer"));
  }
};

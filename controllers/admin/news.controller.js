const News = require("../../models/news.model");

const system = require("../../config/system");
const search = require("../../helpers/search");

//[GET] /admin/news
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const objectSearch = search(req.query);
  if (req.query.q) {
    find.title = objectSearch.regex;
  }
  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }

  const records = await News.find(find).sort(sort);

  res.render("admin/pages/news/index.pug", {
    titlePage: "News",
    records: records,
    query: objectSearch.q,
  });
};

//[GET] /admin/news/create
module.exports.create = (req, res) => {
  res.render("admin/pages/news/create.pug", {
    titlePage: "Create news",
  });
};

//[POST] /admin/news/create
module.exports.createPost = async (req, res) => {
  try {
    if (req.body.position) {
      req.body.position = Number(req.body.position);
    } else {
      const count = await News.countDocuments();
      req.body.position = count + 1;
    }
    const news = new News(req.body);
    await news.save();
    req.flash("successs", "Successfully!");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "An error occurred!");
    res.redirect(`${system.prefixAdmin}/news`);
  }
};

//[GET] /admin/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const record = await News.findOne({ _id: id, deleted: false });
    res.render("admin/pages/news/edit.pug", {
      titlePage: record.title,
      record: record,
    });
  } catch (error) {
    req.flash("error", "An error occurred!");
    res.redirect(`${system.prefixAdmin}/news`);
  }
};

//[PATCH] /admin/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    if (req.body.position) {
      req.body.position = Number(req.body.position);
    }
    await News.updateOne({ _id: id }, req.body);
    req.flash("success", "Successfully!");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "An error occurred!");
    res.redirect(`${system.prefixAdmin}/news`);
  }
};

//[GET] /admin/news/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const record = await News.findOne({ _id: id, deleted: false });
    res.render("admin/pages/news/detail.pug", {
      titlePage: record.title,
      record: record,
    });
  } catch (error) {
    req.flash("error", "An error occurred!");
    res.redirect(`${system.prefixAdmin}/news`);
  }
};

//[DELETE] /admin/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await News.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
    req.flash("success", "Successfully!");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "An error occurred!");
    res.redirect(`${system.prefixAdmin}/news`);
  }
};

//[PATCH] /admin/news/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    const redirect = req.query.redirect;

    switch (type) {
      case "delete-all":
        await News.updateMany(
          { _id: { $in: ids } },
          {
            deleted: true,
            deletedAt: new Date(),
          }
        );
        break;
      case "change-position":
        for (let i = 0; i < ids.length; i++) {
          const [id, posValue] = ids[i].split("-");
          await News.updateOne(
            { _id: id },
            {
              position: posValue,
            }
          );
        }
        break;
      default:
        break;
    }
    req.flash("success", "Cập nhật thành công!");
    res.redirect(redirect);
  } catch (error) {
    req.flash("error", "Đã có lỗi xảy ra!");

    res.redirect(redirect);
  }
};

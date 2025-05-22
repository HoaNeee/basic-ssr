const User = require("../../models/user.model");
const md5 = require("md5");

const search = require("../../helpers/search");
const system = require("../../config/system");

//[GET] /admin/user
module.exports.index = async (req, res) => {
  let filterBtn = [
    {
      title: "Tất cả",
      active: "",
      status: "",
    },
    {
      title: "Đang hoạt động",
      active: "",
      status: "active",
    },
    {
      title: "Đã khóa",
      active: "",
      status: "locked",
    },
  ];

  if (req.query.status) {
    const index = filterBtn.findIndex((btn) => btn.status === req.query.status);
    filterBtn[index].active = "active";
  } else {
    filterBtn[0].active = "active";
  }

  let find = {
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = search(req.query);

  if (req.query.q) {
    find.email = objectSearch.regex;
  }

  const records = await User.find(find);
  res.render("admin/pages/user/index.pug", {
    titlePage: "Người dùng",
    records: records,
    filterStatus: filterBtn,
    query: objectSearch.q,
  });
};

//[PATCH] /admin/users/:status/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;
    await User.updateOne({ _id: id }, { status: status });
    req.flash("success", "Successfully");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "An error occurred" + error);
    res.redirect(`${system.prefixAdmin}/users`);
  }
};

//[GET] /admin/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({
      _id: id,
      status: "active",
      deleted: false,
    });
    if (!user) {
      req.flash("error", "An error occurred");
      res.redirect(`${system.prefixAdmin}/users`);
    } else {
      res.render("admin/pages/user/edit.pug", {
        titlePage: "Chỉnh sửa thông tin",
        user: user,
      });
    }
  } catch (error) {
    req.flash("error", "An error occurred");
    res.redirect(`${system.prefixAdmin}/users`);
  }
};

//[PATCH] /admin/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const email = req.body.email;

    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }

    const existEmail = await User.findOne({
      _id: { $ne: id },
      email: email,
      deleted: false,
    });
    if (existEmail) {
      req.flash("error", "Email đã tồn tại");
      res.redirect(req.get("Referer"));
      return;
    }

    await User.updateOne({ _id: id }, req.body);

    req.flash("success", "Successfully");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "An error occurred" + error);
    res.redirect(`${system.prefixAdmin}/users`);
  }
};

//[DELETE] /admin/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await User.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
    req.flash("success", "Successfully");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "An error occurred" + error);
    res.redirect(`${system.prefixAdmin}/users`);
  }
};

//[PATCH] /admin/users/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
      case "active":
        await User.updateMany({ _id: { $in: ids } }, { status: "active" });
        break;
      case "locked":
        await User.updateMany({ _id: { $in: ids } }, { status: "locked" });
        break;
      case "delete-all":
        await User.updateMany(
          { _id: { $in: ids } },
          { deleted: true, deletedAt: new Date() }
        );
        break;
      default:
        break;
    }
    req.flash("success", "Successfully");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "An error occurred" + error);
    res.redirect(`${system.prefixAdmin}/users`);
  }
};

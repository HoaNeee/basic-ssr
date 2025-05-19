const md5 = require("md5");
const Role = require("../../models/role.model");
const Account = require("../../models/account.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const system = require("../../config/system");

//[GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const filterStatus = filterStatusHelper(req.query);

  if (req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = searchHelper(req.query);
  if (req.query.q) {
    find.email = objectSearch.regex;
  }

  //lean or toObject in bellow
  const records = await Account.find(find).select("-password -token").lean();

  for (let item of records) {
    const role = await Role.findOne({
      _id: item.role_id,
      deleted: false,
    });
    if (role) {
      item.roleName = role.title;
    }
  }

  res.render("admin/pages/accounts/index.pug", {
    titlePage: "Accounts",
    records: records,
    filterStatus: filterStatus,
    query: objectSearch.q,
  });
};

//[GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/accounts/create.pug", {
    titlePage: "Create new accounts",
    rolesAccount: roles,
  });
};

//[POST] /admin/accounts/creat
module.exports.createPost = async (req, res) => {
  const existEmail = await Account.findOne({
    deleted: false,
    email: req.body.email,
  });
  if (existEmail) {
    req.flash("error", "Email đã tồn tại trong hệ thống!");
    res.redirect(req.get("Referer"));
    return;
  }
  req.body.password = md5(req.body.password);

  const account = new Account(req.body);
  await account.save();
  res.redirect(`${system.prefixAdmin}/accounts`);
};

//[GET] /admin/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const account = await Account.findOne({
      _id: id,
      deleted: false,
    }).select("-password -token");
    const roles = await Role.find({
      deleted: false,
    });

    res.render("admin/pages/accounts/edit.pug", {
      titlePage: "Edit account",
      account: account,
      recordsRole: roles,
    });
  } catch (error) {
    res.redirect(`${system.prefixAdmin}/accounts`);
  }
};

//[PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    const existEmail = await Account.findOne({
      _id: { $ne: id },
      email: req.body.email,
      deleted: false,
    });

    if (existEmail) {
      req.flash("error", "Email đã tồn tại trong hệ thống!");
      res.redirect(req.get("Referer"));
      return;
    }
    await Account.updateOne(
      {
        _id: id,
      },
      req.body
    );
    req.flash("success", "Cập nhật thành công!");
    res.redirect(req.get("Referer"));
  } catch (error) {
    res.redirect(`${system.prefixAdmin}/accounts`);
  }
};

//[PATCH] /admin/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;
    await Account.updateOne({ _id: id }, { status: status });
    req.flash("success", "Cập nhật thành công!");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "An error occurred!");
    res.redirect(`${system.prefixAdmin}/accounts`);
  }
};

//[DELETE] /admin/accounts/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await Account.updateOne(
      { _id: id },
      { deleted: true, deletedAt: new Date() }
    );
    req.flash("success", "Xóa thành công!");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "An error occurred!");
    res.redirect(`${system.prefixAdmin}/accounts`);
  }
};

//[GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const account = await Account.findOne({ _id: id, deleted: false });
    const roleAccount = await Role.findOne({ _id: account.role_id });
    res.render("admin/pages/accounts/detail.pug", {
      titlePage: account.fullname,
      account: account,
      roleAccount: roleAccount,
    });
  } catch (error) {
    req.flash("error", "An error occurred!");
    res.redirect(`${system.prefixAdmin}/accounts`);
  }
};

//[PATCH] /admin/accounts/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
      case "active":
        await Account.updateMany({ _id: { $in: ids } }, { status: "active" });
        break;
      case "inactive":
        await Account.updateMany({ _id: { $in: ids } }, { status: "inactive" });

        break;
      case "delete-all":
        await Account.updateMany(
          { _id: { $in: ids } },
          { deleted: true, deletedAt: new Date() }
        );

        break;
      default:
        break;
    }
    req.flash("success", "Successfully!");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "An error occurred!");
    res.redirect(`${system.prefixAdmin}/accounts`);
  }
};

const md5 = require("md5");
const Role = require("../../models/role.model");
const Account = require("../../models/account.model");
const system = require("../../config/system");

//[GET] /admin/accounts
module.exports.index = async (req, res) => {
  //lean or toObject in bellow
  const records = await Account.find({
    deleted: false,
  })
    .select("-password -token")
    .lean();

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
  });
};

//[GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/accounts/create.pug", {
    titlePage: "Create new accounts",
    roles: roles,
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

//[PATCH] /admin/account/edit/:id
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

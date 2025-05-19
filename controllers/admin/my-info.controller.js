const Account = require("../../models/account.model");

//[GET] /admin/my-info
module.exports.index = (req, res) => {
  res.render("admin/pages/my-info/index.pug", {
    titlePage: "Cá nhân",
  });
};

//[GET] /admin/my-info/edit
module.exports.edit = (req, res) => {
  res.render("admin/pages/my-info/edit", {
    titlePage: "Chỉnh sửa thông tin",
  });
};

//[PATCH] /admin/my-info/edit
module.exports.editPatch = async (req, res) => {
  const user = res.locals.user;
  const existEmail = await Account.findOne({
    _id: { $ne: user._id },
    email: req.body.email,
    deleted: false,
  });

  if (existEmail) {
    req.flash("error", "Email đã tồn tại trong hệ thống!");
  } else {
    await Account.updateOne(
      {
        _id: user._id,
      },
      req.body
    );
    req.flash("success", "Cập nhật thành công!");
  }

  res.redirect(req.get("Referer"));
};

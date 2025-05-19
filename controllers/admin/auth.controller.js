const Account = require("../../models/account.model");
const md5 = require("md5");

const system = require("../../config/system");
const generate = require("../../helpers/generateString");

//[GET] /admin/auth/login
module.exports.login = async (req, res) => {
  if (req.cookies.token) {
    const token = req.cookies.token;
    const user = await Account.findOne({
      token: token,
      status: "active",
      deleted: false,
    });
    if (!user) {
      res.render("admin/pages/auth/login.pug", {
        titlePage: "Đăng nhập",
      });
    } else {
      res.redirect(`${system.prefixAdmin}/dashboard`);
    }
  } else {
    res.render("admin/pages/auth/login.pug", {
      titlePage: "Đăng nhập",
    });
  }
};

//[POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = md5(req.body.password);
  const user = await Account.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect(`${system.prefixAdmin}/auth/login`);
    return;
  }

  if (user.status === "inactive") {
    req.flash("error", "Tài khoản đã bị vô hiệu hóa!");
    res.redirect(`${system.prefixAdmin}/auth/login`);
    return;
  }

  if (user.password !== password) {
    req.flash("error", "Mật khẩu không chính xác!");
    res.redirect(`${system.prefixAdmin}/auth/login`);
    return;
  }

  const token = generate(25);
  await Account.updateOne({ email: email }, { token: token });

  res.cookie("token", token);

  res.redirect(`${system.prefixAdmin}/dashboard`);
};

//[GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.redirect(`${system.prefixAdmin}/auth/login`);
};

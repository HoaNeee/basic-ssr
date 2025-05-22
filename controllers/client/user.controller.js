const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");
const md5 = require("md5");

const sendMail = require("../../helpers/sendMail");
const generate = require("../../helpers/generateString");

//[GET] /user/register
module.exports.register = (req, res) => {
  res.render("client/pages/user/register.pug", {
    titlePage: "Đăng ký",
  });
};

//[POST] /user/register
module.exports.registerPost = async (req, res) => {
  const email = req.body.email;
  const fullname = req.body.fullname;
  const password = req.body.password;
  const existEmail = await User.findOne({ email: email, deleted: false });
  if (existEmail) {
    req.flash("error", "Email đã tồn tại trong hệ thống!");
    res.redirect(req.get("Referer"));
    return;
  }
  const token = generate.string(20);
  const user = new User({
    email: email,
    fullname: fullname,
    password: md5(password),
    token: token,
    status: "active",
  });

  res.cookie("tokenUser", token);

  await user.save();
  res.redirect("/");
};

//[GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login.pug", {
    titlePage: "Đăng nhập",
  });
};

//[POST] /user/login
module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect(req.get("Referer"));
    return;
  }

  if (user.status === "locked") {
    req.flash("error", "Tài khoản đã bị khóa");
    res.redirect(req.get("Referer"));
    return;
  }

  if (user.password !== md5(password)) {
    req.flash("error", "Sai mật khẩu");
    res.redirect(req.get("Referer"));
    return;
  }
  const token = generate.string(20);
  user.token = token;

  await user.save();

  const cartUser = await Cart.findOne({ user_id: user._id });
  if (cartUser) {
    // const maxAge = 1000 * 60 * 60 * 24 * 10; -> khong the dung
    //khi tokenUser het thi cartId die

    res.cookie("cartId", String(cartUser._id));
  } else {
    if (res.locals.cartId) {
      const cartId = res.locals.cartId;
      const cart = await Cart.findOne({ _id: cartId });
      cart.user_id = user._id;
      cart.user_ip_address = "";
      await cart.save();
    }
  }

  res.cookie("tokenUser", token);
  req.flash("success", "Đăng nhập thành công");
  res.redirect("/");
};

//[GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.clearCookie("cartId");
  req.flash("success", "Đã đăng xuất");
  res.redirect(req.get("Referer"));
};

//[GET] /user/password/fogot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password.pug", {
    titlePage: "Quên mật khẩu",
  });
};

//[POST] /user/password/fogot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email, deleted: false });
  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect(req.get("Referer"));
    return;
  }
  //neu chon khong del khi nhap dung otp
  //yeu cau qua nhieu khi trong collection forgot co email user da ton tai

  const otp = generate.number(6);

  const forgotPasswordObject = new ForgotPassword({
    email: email,
    otp: otp,
    expiresAt: new Date(Date.now() + 1000 * 60 * 3),
  });

  const subject = "Xác nhận quên mật khẩu";
  const html = `Đây là mã OTP của bạn cho việc xác nhận đổi mật khẩu mới: <b>${otp}</b>. Mã xác nhận sẽ có hiệu lực trong vòng 3 phút`;

  sendMail.sendMail(email, subject, html);

  await forgotPasswordObject.save();

  res.redirect(`/user/password/otp?email=${email}`);
};

//[GET] /user/password/otp
module.exports.otp = async (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password.pug", {
    titlePage: "Xác thực OTP",
    email: email,
  });
};

//[POST] /user/password/otp
module.exports.otpPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const existEmail = await ForgotPassword.findOne({ email: email });
  if (!existEmail) {
    req.flash("error", "Đã hết thời hạn, hãy gửi lại yêu cầu");
    res.redirect("/user/password/forgot");
    return;
  }
  if (otp === existEmail.otp) {
    //co the del khi nhap dung
    //coi nhu user da dang nhap

    const user = await User.findOne({ email: email });

    res.cookie("tokenUser", user.token);

    res.redirect("/user/password/reset-password");
  } else {
    req.flash("error", "Mã OTP không chính xác");
    res.redirect(req.get("Referer"));
  }
};

//[GET] /user/password/reset-password
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password.pug", {
    titlePage: "Đổi mật khẩu",
  });
};

//[POST] /user/password/reset-password
module.exports.resetPasswordPost = async (req, res) => {
  const password = md5(req.body.password);
  const token = req.cookies.tokenUser;
  await User.updateOne({ token: token }, { password: password });
  req.flash("success", "Thay đổi mật khẩu thành công!");
  res.redirect("/");
};

//[GET] /user/info
module.exports.info = async (req, res) => {
  res.render("client/pages/user/info.pug", {
    titlePage: "Thông tin",
  });
};

//[GET] /user/edit
module.exports.edit = async (req, res) => {
  res.render("client/pages/user/edit.pug", {
    titlePage: "Chỉnh sửa thông tin",
  });
};

//[PATCH] /user/edit
module.exports.editPatch = async (req, res) => {
  try {
    const user = res.locals.user;
    const id = user._id;
    const email = req.body.email;
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

    req.flash("success", "Cập nhật thành công");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "Đã có lỗi xả ra" + error);
    res.redirect("/user/info");
  }
};

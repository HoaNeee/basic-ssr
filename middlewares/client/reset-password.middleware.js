module.exports.password = (req, res, next) => {
  const pass = req.body.password;
  const confirmPass = req.body.confirmPassword;
  if (pass !== confirmPass) {
    req.flash("error", "Mật khẩu nhập lại không khớp!");
    res.redirect(req.get("Referer"));
    return;
  }
  next();
};

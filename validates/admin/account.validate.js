module.exports.create = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Email đang bị trống!");
    res.redirect(req.get("Referer"));
    return;
  }
  if (!req.body.password) {
    req.flash("error", "Mật khẩu đang bị trống!");
    res.redirect(req.get("Referer"));
    return;
  }
  next();
};

module.exports.edit = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Email đang bị trống!");
    res.redirect(req.get("Referer"));
    return;
  }

  next();
};

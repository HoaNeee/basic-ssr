const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.tokenUser;
  if (token) {
    const user = await User.findOne({ token: token, deleted: false });
    if (!user) {
      res.clearCookie("tokenUser");
      res.redirect("/user/login");
      return;
    }
    next();
  } else {
    res.redirect("/user/login");
    return;
  }
};

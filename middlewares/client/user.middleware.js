const User = require("../../models/user.model");

module.exports.infoUser = async (req, res, next) => {
  if (req.cookies.tokenUser) {
    const user = await User.findOne({
      token: req.cookies.tokenUser,
      deleted: false,
      status: "active",
    }).select("-password");
    if (user) {
      res.locals.user = user;
    } else {
      res.clearCookie("tokenUser");
    }
  }
  next();
};

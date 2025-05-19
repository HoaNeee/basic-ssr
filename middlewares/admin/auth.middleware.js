const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const system = require("../../config/system");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
    res.redirect(`${system.prefixAdmin}/auth/login`);
  } else {
    const user = await Account.findOne({
      token: req.cookies.token,
      status: "active",
      deleted: false,
    }).select("-password");
    if (!user) {
      res.redirect(`${system.prefixAdmin}/auth/login`);
    } else {
      const roles = await Role.findOne({
        _id: user.role_id,
      }).select("title permissions");
      res.locals.user = user;
      res.locals.roles = roles;
      next();
    }
  }
};

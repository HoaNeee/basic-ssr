const SettingGeneral = require("../../models/setting-general.model");

//[GET] /admin/setting/general
module.exports.general = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});

  res.render("admin/pages/setting/setting-general.pug", {
    titlePage: "Cài đặt chung",
    settingGeneral: settingGeneral,
  });
};

//[PATCH] /admin/setting/general
module.exports.generalPatch = async (req, res) => {
  try {
    const settingGeneral = await SettingGeneral.findOne({});
    if (settingGeneral) {
      await SettingGeneral.updateOne({ _id: settingGeneral._id }, req.body);
    } else {
      const record = new SettingGeneral(req.body);
      await record.save();
    }

    req.flash("success", "Successfully");
  } catch (error) {
    req.flash("error", "An error occurred" + error);
  }
  res.redirect(req.get("Referer"));
};

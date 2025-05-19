const Role = require("../../models/role.model");
const system = require("../../config/system");

//[GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Role.find(find);
  res.render("admin/pages/roles/index", {
    titlePage: "Nhóm quyền",
    records: records,
  });
};

//[GET] /admin/roles/crate
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create.pug", {
    titlePage: "Create new role",
  });
};

//[POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();
  } catch (error) {
    console.log(error);
  }
  res.redirect(`${system.prefixAdmin}/roles`);
};

//[GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const record = await Role.findOne({ _id: id });
    res.render("admin/pages/roles/edit.pug", {
      titlePage: record.title,
      record: record,
    });
  } catch (error) {
    res.redirect(`${system.prefixAdmin}/roles`);
  }
};

//[PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    await Role.updateOne({ _id: id }, req.body);
    res.redirect(req.get("Referer"));
  } catch (error) {
    res.redirect(`${system.prefixAdmin}/roles`);
  }
};

//[GET] /admin/roles/permission
module.exports.permission = async (req, res) => {
  const records = await Role.find({
    deleted: false,
  });

  res.render("admin/pages/roles/permission.pug", {
    titlePage: "Phân quyền",
    records: records,
  });
};

//[PATCH] /admin/roles/permission
module.exports.permissionPatch = async (req, res) => {
  try {
    const body = JSON.parse(req.body.permissions);
    for (let item of body) {
      const id = item.id;
      const permissions = item.permissions;
      await Role.updateOne({ _id: id }, { permissions: permissions });
    }
    req.flash("success", "Cập nhật thành công!");
    res.redirect(req.get("Referer"));
  } catch (error) {
    res.redirect(`${system.prefixAdmin}/`);
  }
};

//[DELETE] /admin/roles/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await Role.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
    req.flash("success", "Xóa thành công!");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "Có lỗi xảy ra!");
    res.redirect(`${system.prefixAdmin}/roles`);
  }
};

//[GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const role = await Role.findOne({ _id: id, deleted: false });

    res.render("admin/pages/roles/detail.pug", {
      titlePage: role.title,
      role: role,
    });
  } catch (error) {
    req.flash("error", "Có lỗi xảy ra!");
    res.redirect(`${system.prefixAdmin}/roles`);
  }
};

//[PATCH] /admin/roles/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    const redirect = req.query.redirect;

    switch (type) {
      case "delete-all":
        await Role.updateMany(
          { _id: { $in: ids } },
          {
            deleted: true,
            deletedAt: new Date(),
          }
        );
        break;
      default:
        break;
    }
    req.flash("success", "Cập nhật thành công!");
    res.redirect(redirect);
  } catch (error) {
    req.flash("error", "Đã có lỗi xảy ra!");

    res.redirect(redirect);
  }
};

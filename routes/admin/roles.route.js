const express = require("express");
const controller = require("../../controllers/admin/role.controller");
const validates = require("../../validates/admin/role.validate");
const router = express.Router();

router.get("/", controller.index);

router.get("/create", controller.create);
router.post("/create", validates.createPost, controller.createPost);

router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", validates.createPost, controller.editPatch);

router.get("/permission", controller.permission);
router.patch("/permission", controller.permissionPatch);

module.exports = router;

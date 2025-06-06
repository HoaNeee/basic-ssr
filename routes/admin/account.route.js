const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const validates = require("../../validates/admin/account.validate");

const controller = require("../../controllers/admin/accounts.controller");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  validates.create,
  controller.createPost
);

router.get("/edit/:id", controller.edit);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloud.upload,
  validates.edit,
  controller.editPatch
);

router.delete("/delete/:id", controller.deleteItem);

router.get("/detail/:id", controller.detail);

router.patch("/change-multi", controller.changeMulti);

module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const validates = require("../../validates/admin/product-category.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const controller = require("../../controllers/admin/product-category.controller");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validates.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validates.createPost,
  controller.editPatch
);

router.delete("/delete/:id", controller.delete);

router.get("/detail/:id", controller.detail);

module.exports = router;

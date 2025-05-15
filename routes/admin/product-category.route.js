const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const validates = require("../../validates/admin/product.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewere");
const controller = require("../../controllers/admin/product-category.controller");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validates.createProduct,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validates.createProduct,
  controller.editPatch
);

module.exports = router;

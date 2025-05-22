const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/order.controller");

router.get("/", controller.index);
router.get("/edit/:id", controller.edit);
router.get("/detail/:id", controller.detail);

router.patch("/edit/info/:id", controller.editInfo);
router.patch("/change-status", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.patch("/edit/:id/products/:productId", controller.editProduct);

router.delete("/edit/:id/products/:productId", controller.deleteProduct);
router.delete("/delete/:id", controller.deleteItem);

module.exports = router;

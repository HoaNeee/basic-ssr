const express = require("express");
const controller = require("../../controllers/client/cart.controller");
const router = express.Router();

router.get("/", controller.index);
router.post("/add/:productId", controller.add);
router.patch("/update/:productId", controller.updateCart);
router.delete("/delete/:productId", controller.deleteCart);

module.exports = router;

const express = require('express');
const router = express.Router();

const validateToken = require('../Middlewares/validateToken');
const {
    getAllOrders,
    getAllMyOrders,
    getSingleOrder,
    addToOrders,
    delOrder,
    updateOrder
} = require('../Controllers/orderControllers');


router.route("/").get( validateToken, getAllOrders);
router.route("/").post( validateToken, addToOrders);
router.route("/user").get( validateToken, getAllMyOrders);
router.route("/:id").get( validateToken, getSingleOrder);
router.route("/:id").put( validateToken, updateOrder);
router.route("/:id").delete( validateToken, delOrder);

module.exports = router;
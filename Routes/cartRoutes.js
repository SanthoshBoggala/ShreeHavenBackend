const express = require('express');
const router = express.Router();
const validateToken = require('../Middlewares/validateToken');

const {
    getCartItems, addToCartItems, removeFromCartItems, getMyCartItems
} = require('../Controllers/cartControllers');


router.route("/").get( validateToken,  getCartItems);
router.route("/").post( validateToken, addToCartItems);
router.route("/user").get( validateToken, getMyCartItems)
router.route("/").put( validateToken, removeFromCartItems);

module.exports = router;
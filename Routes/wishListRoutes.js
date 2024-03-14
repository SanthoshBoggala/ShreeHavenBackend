const express = require('express')
const router = express.Router()
const validateToken = require('../Middlewares/validateToken')

const {
    getWishListItems,
    addToWishList,
    removeFromWishList,
    getMyWishListItems
} = require('../Controllers/wishListControllers')

router.route("/user").get( validateToken,  getMyWishListItems)
router.route("/").get( validateToken,  getWishListItems)
router.route("/").post( validateToken, addToWishList)
router.route("/").delete( validateToken, removeFromWishList)

module.exports = router
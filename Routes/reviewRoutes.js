const express = require('express');
const router = express.Router();

const validateToken = require('../Middlewares/validateToken');
const {
    getAllReviews,
    getAllMyReviews,
    getSingleReview,
    postSingleReview,
    putSingleReview,
    deleteSingleReview
}   = require('../Controllers/reviewControllers');


router.route("/").get( validateToken, getAllReviews);
router.route("/user").get( validateToken, getAllMyReviews);
router.route("/:id").get( validateToken, getSingleReview);
router.route("/").post( validateToken, postSingleReview);
router.route("/:id").put( validateToken, putSingleReview);
router.route("/:id").delete( validateToken, deleteSingleReview);

module.exports = router;
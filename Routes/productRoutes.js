const express = require('express');
const router = express.Router();

const validateToken = require('../Middlewares/validateToken');
const upload = require('../Middlewares/uploadFiles')
const {
    getAllProducts,
    getAllStyleProducts,
    getAllHotProducts,
    getAllTrendingProducts,
    getAllTopRatedProducts,
    getAllSimilarProducts,
    getSingleProduct,
    postSingleProduct,
    putSingleProduct,
    deleteSingleProduct
}   = require('../Controllers/productsControllers');


router.route("/").get( getAllProducts);

router.route("/styles/:category").get( getAllStyleProducts);
router.route("/hot_deals").get( getAllHotProducts);
router.route("/trending_deals").get( getAllTrendingProducts);
router.route("/top_rated").get( getAllTopRatedProducts);
router.route("/similar_products").get( getAllSimilarProducts);


router.route("/:id").get( getSingleProduct);
router.route("/").post( validateToken, upload.array('images[]'),  postSingleProduct);
router.route("/:id").put( validateToken,  putSingleProduct);
router.route("/:id").delete( validateToken, deleteSingleProduct);

module.exports = router;
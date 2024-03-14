const express = require('express');
const router = express.Router();
const validateToken = require('../Middlewares/validateToken');

const {
    getAllTypesCategories,
    addTypesCategories,
    removeTypesCategories
} = require('../Controllers/typesCategoriesControllers');


router.route("/").get( getAllTypesCategories);
router.route("/").post(validateToken, addTypesCategories);
router.route("/").put(validateToken, removeTypesCategories);

module.exports = router;
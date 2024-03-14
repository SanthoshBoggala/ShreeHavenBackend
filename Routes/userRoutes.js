const express = require('express');
const router = express.Router();

const validateToken = require('../Middlewares/validateToken');
const {
    register,
    login,
    user,
    updateUser
}   = require('../Controllers/userControllers');


router.route("/register").post(register)
router.route("/login").post(login)

router.route("/user").get(validateToken, user)
router.route("/user").put(validateToken, updateUser);

module.exports = router;
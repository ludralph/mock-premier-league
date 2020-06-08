const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.route('/auth/signup').post(authController.signup);
router.route('/auth/login').post(authController.login);
router.route('/auth/signout').get(authController.signout);

module.exports = router;

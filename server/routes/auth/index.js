const express = require('express');
const auth_controller = require('./controller');
const { verifyToken } = require('../../middlewares');

const router = express.Router();

router.post('/login', auth_controller.login_post);
router.post('/signup', auth_controller.signup_post);
router.get('/verify', verifyToken, auth_controller.verify_get);

module.exports = router;

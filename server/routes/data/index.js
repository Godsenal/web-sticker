const express = require('express');
const data_controller = require('./controller');
const { verifyToken } = require('../../middlewares');

const router = express.Router();

router.post('/update', verifyToken, data_controller.update_post);

module.exports = router;

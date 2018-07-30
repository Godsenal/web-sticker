const express = require('express');
const auth = require('./auth');
const data = require('./data');
const router = express.Router();

router.use('/auth', auth);
router.use('/data', data);

module.exports = router;
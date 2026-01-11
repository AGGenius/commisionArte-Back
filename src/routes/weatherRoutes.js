const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController.js');
const { asyncErrorHandler } = require('../middlewares/errors.js');

router.get('/', asyncErrorHandler(weatherController.getWeatherReportForCurrentDay));

module.exports = router;
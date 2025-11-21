const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController.js');
const { asyncErrorHandler } = require('../middlewares/errors.js');
const { uploadImageTotalChek, uploadImageSizeAndTypeCheck } = require('../middlewares/uploadImagesLimit.js');

router.get('/', asyncErrorHandler(portfolioController.getPortfolio));
router.get('/:id', asyncErrorHandler( portfolioController.getPortfolioByID));
router.get('/artist/:artist_id', asyncErrorHandler( portfolioController.getPortfolioByArtistID));
router.put('/:id', asyncErrorHandler(portfolioController.editPortfolio));
router.delete('/:id', asyncErrorHandler(portfolioController.deletePortfolio));
router.post('/upload', uploadImageTotalChek, uploadImageSizeAndTypeCheck, asyncErrorHandler(portfolioController.uploadPortfolio));

module.exports = router;
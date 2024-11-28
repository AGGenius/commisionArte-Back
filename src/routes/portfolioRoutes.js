const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController.js');
const { asyncErrorHandler } = require('../middlewares/errors.js');
const { upload } = require('../middlewares/fileManager.js');

router.get('/', asyncErrorHandler(portfolioController.getPortfolio));
router.get('/:id', asyncErrorHandler( portfolioController.getPortfolioByID));
router.put('/:id', asyncErrorHandler(portfolioController.editPortfolio));
router.delete('/:id', asyncErrorHandler(portfolioController.deletePortfolio));
router.post('/upload', upload.any(), asyncErrorHandler(portfolioController.uploadPortfolio));

module.exports = router;
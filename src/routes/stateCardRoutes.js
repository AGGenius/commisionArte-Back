const express = require('express');
const router = express.Router();
const stateCardsController = require('../controllers/stateCardsController.js');
const { asyncErrorHandler } = require('../middlewares/errors.js');

router.get('/', asyncErrorHandler(stateCardsController.getStateCards));
router.get('/:id', asyncErrorHandler( stateCardsController.getStateCardsByID));
router.put('/:id', asyncErrorHandler(stateCardsController.editStateCard));
router.delete('/:id', asyncErrorHandler(stateCardsController.deleteStateCard));
router.post('/upload', asyncErrorHandler(stateCardsController.uploadStateCard));

module.exports = router;
const express = require('express');
const router = express.Router();
const openWorksController = require('../controllers/openWorkController.js');
const { asyncErrorHandler } = require('../middlewares/errors.js');

router.get('/', asyncErrorHandler(openWorksController.getOpenWork));
router.get('/:id', asyncErrorHandler( openWorksController.getOpenWorkByID));
router.put('/:id', asyncErrorHandler(openWorksController.editOpenWork));
router.delete('/:id', asyncErrorHandler(openWorksController.deleteOpenWork));
router.post('/upload', asyncErrorHandler(openWorksController.uploadOpenWork));

module.exports = router;
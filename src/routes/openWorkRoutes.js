const express = require('express');
const router = express.Router();
const openWorksController = require('../controllers/openWorkController.js');
const { openWorksLimit } = require('../middlewares/openWork.js')
const { asyncErrorHandler } = require('../middlewares/errors.js');

router.get('/', asyncErrorHandler(openWorksController.getOpenWork));
router.get('/:id', asyncErrorHandler( openWorksController.getOpenWorkByID));
router.get('/client/:client_id', asyncErrorHandler( openWorksController.getOpenWorkByClientID));
router.put('/:id', asyncErrorHandler(openWorksController.editOpenWork));
router.put('/take/:id', asyncErrorHandler( openWorksController.takeOpenWork));
router.put('/decline/:id', asyncErrorHandler( openWorksController.declineOpenWork));
router.put('/confirm/:id', asyncErrorHandler( openWorksController.confirmOpenWork));
router.delete('/:id', asyncErrorHandler(openWorksController.deleteOpenWork));
router.post('/upload', openWorksLimit, asyncErrorHandler(openWorksController.uploadOpenWork));

module.exports = router;
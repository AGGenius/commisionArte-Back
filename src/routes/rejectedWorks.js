const express = require('express');
const router = express.Router();
const rejectedWorks = require('../controllers/rejectedWorksController.js')
const { asyncErrorHandler } = require('../middlewares/errors.js');

router.get('/', asyncErrorHandler(rejectedWorks.getRejectedWorks));
router.get('/:id', asyncErrorHandler( rejectedWorks.getRejectedWorksByID));
router.put('/:id', asyncErrorHandler(rejectedWorks.editRejectedWorks));
router.delete('/:id', asyncErrorHandler(rejectedWorks.deleteRejectedWorks));
router.post('/upload', asyncErrorHandler(rejectedWorks.uploadRejectedWorks));

module.exports = router;
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController.js');
const { asyncErrorHandler } = require('../middlewares/errors.js');

router.get('/', asyncErrorHandler(messageController.getMessages));
router.get('/:id', asyncErrorHandler( messageController.getMessagskByID));
router.put('/:id', asyncErrorHandler(messageController.editMessages));
router.delete('/:id', asyncErrorHandler(messageController.deleteMessages));
router.post('/upload', asyncErrorHandler(messageController.uploadMessages));

module.exports = router;
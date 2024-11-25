const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clientsController.js');
const { validLoginData, validUserData } = require('../middlewares/loginClient.js');
const { asyncErrorHandler } = require('../middlewares/errors.js');

router.get('/', asyncErrorHandler(clientsController.getClients));
router.get('/:id', asyncErrorHandler( clientsController.getClientByID));
router.post('/login', validLoginData, asyncErrorHandler(clientsController.loginClient));
router.put('/:id',  asyncErrorHandler(clientsController.editClient));
router.put('/editInfo/:id', validUserData, asyncErrorHandler(clientsController.editClientByClient));
router.put('/editInfoPass/:id', validUserData, asyncErrorHandler(clientsController.editClientByClient));
router.delete('/:id', asyncErrorHandler(clientsController.deletClientByClient));
router.post('/register', asyncErrorHandler(clientsController.registerClient));

module.exports = router;
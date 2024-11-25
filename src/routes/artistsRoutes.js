const express = require('express');
const router = express.Router();
const artistsController = require('../controllers/artistsController.js');
const { validLoginData, validUserData } = require('../middlewares/loginArtist.js');
const { asyncErrorHandler } = require('../middlewares/errors.js');

router.get('/', asyncErrorHandler(artistsController.getArtists));
router.get('/:id', asyncErrorHandler( artistsController.getArtistByID));
router.post('/login', validLoginData, asyncErrorHandler(artistsController.loginArtist));
router.put('/:id',  asyncErrorHandler(artistsController.editArtist));
router.put('/editInfo/:id',  asyncErrorHandler(artistsController.editArtist));
router.put('/editInfoPass/:id', asyncErrorHandler(artistsController.editArtistByArtist));
router.delete('/:id', asyncErrorHandler(artistsController.deletArtistByArtist));
router.post('/register', asyncErrorHandler(artistsController.registerArtist));

module.exports = router;
const express = require('express');
const router = express.Router();
const artistsRoutes = require('./artistsRoutes.js');
const clientsRoutes = require('./clientsRoutes.js');

router.use('/api/artists', artistsRoutes);
router.use('/api/clients', clientsRoutes);

module.exports = router
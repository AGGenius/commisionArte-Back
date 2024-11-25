const express = require('express');
const router = express.Router();
const artistsRoutes = require('./artistsRoutes.js');

router.use('/api/artists', artistsRoutes);

module.exports = router
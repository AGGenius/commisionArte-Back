const express = require('express');
const router = express.Router();
const artistsRoutes = require('./artistsRoutes.js');
const clientsRoutes = require('./clientsRoutes.js');
const portfolioRoutes = require('./portfolioRoutes.js');
const stateCardsRoutes = require('./stateCardRoutes.js');
const openWorkRoutes = require('./openWorkRoutes.js');

router.use('/api/artists', artistsRoutes);
router.use('/api/clients', clientsRoutes);
router.use('/api/portfolio', portfolioRoutes);
router.use('/api/stateCards', stateCardsRoutes);
router.use('/api/openWorks', openWorkRoutes);

module.exports = router
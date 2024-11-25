//Coded by Adrian Giner Gimenez. FullStackWebpage. 25-11-2024. By humans for humans.

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const indexRoutes = require('./routes//index.js');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/', indexRoutes);

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
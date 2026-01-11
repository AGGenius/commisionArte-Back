//Coded by Adrian Giner Gimenez. FullStackWebpage. 25-11-2024. By humans for humans.

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const indexRoutes = require('./routes//index.js');

const app = express();
const port = 3000;

//Static files
app.use(express.static('uploads'))

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: true,
    limit: 10000,
    parameterLimit: 10,
}));

app.use(morgan('dev'));

app.use('/', indexRoutes);

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
;
const client = require('../db.js');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp/my-uploads') // your path
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const getPortfolio = async (req, res) => {
    const result = await client.query('SELECT * FROM portfolio ORDER BY id');
    let portfolio = result.rows;

    res.json(portfolio);
}

const getPortfolioByID = async (req, res) => {
    const { id } = req.params;
    const result = await client.query('SELECT * FROM portfolio WHERE id= $1', [id]);

    if (result.rows.length > 0) {
        let portfolio = result.rows[0];
        res.json(portfolio);
    } else {
        res.json({ estado: "Cliente no encontrado" })
    }
}

const editPortfolio = async (req, res) => {
    const { id } = req.params;
    const { name, sfw_status, styles } = req.body;

    await client.query('UPDATE portfolio SET name = $2, sfw_status = $3, styles = $4 WHERE id = $1', [id, name, sfw_status, styles]);
    res.json({ estado: "Imagen actualizada correctamente" });
}

const deletePortfolio = async (req, res) => {
    const { id } = req.params;

    await client.query('DELETE FROM portfolio WHERE id = $1', [id]);
    res.json({ estado: "Imagen borrada correctamente" });
};

const uploadPortfolio = async (req, res) => {
    //Postman doest work on this, I have to wait to have the frontend.
    const { name, artist_id, styles, sfw_status } = req.body;

    const location = ('http://localhost:3000/' + res.locals.fileName);

    await client.query(`INSERT INTO portfolio (name, artist_id, location, styles, sfw_status) VALUES ($1, $2, $3, $4, $5)`, [name, artist_id, location, styles, sfw_status]);
    res.json({ estado: "Imagen guardada correctamente" });
}

module.exports = { getPortfolio, getPortfolioByID, editPortfolio, deletePortfolio, uploadPortfolio }
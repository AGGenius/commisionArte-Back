const client = require('../db.js');
const multer = require('multer');
const path = require("path");
const sharp = require("sharp");
require('dotenv').config();
const fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp/my-uploads') // your path
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const getPortfolio = async (req, res) => {
    const logedStatus = req.query.logedStatus === 'true';

    if (logedStatus) {
        const result = await client.query('SELECT * FROM portfolio ORDER BY id');
        let portfolio = result.rows;

        res.json(portfolio);
    } else {
        const result = await client.query('SELECT * FROM portfolio WHERE sfw_status = true ORDER BY id');
        let portfolio = result.rows;

        res.json(portfolio);
    }
}

const getPortfolioByID = async (req, res) => {
    const { id } = req.params;
    const result = await client.query('SELECT * FROM portfolio WHERE id= $1', [id]);

    if (result.rows.length > 0) {
        let portfolio = result.rows[0];
        res.json(portfolio);
    } else {
        res.json({ estado: "Imagen no encontrada" })
    }
}

const getPortfolioByArtistID = async (req, res) => {
    const { artist_id } = req.params;
    const result = await client.query('SELECT * FROM portfolio WHERE artist_id= $1 ORDER BY id', [artist_id]);

    if (result.rows.length > 0) {
        let portfolio = result.rows;
        res.json(portfolio);
    } else {
        //res.json({ estado: "Imagenes no encontradas" })
    }
}

const editPortfolio = async (req, res) => {
    const { id } = req.params;
    const { name, sfw_status, styles } = req.body;

    await client.query('UPDATE portfolio SET name = $2, sfw_status = $3, styles = $4 WHERE id = $1', [id, name, sfw_status, styles]);
    res.json({ estado: "Imagen actualizada correctamente" });
}

const getFilePath = (fileUrl) => {
    const UPLOADS_FOLDER = path.join(__dirname, '..', '..', 'uploads');
    const fileName = path.basename(fileUrl); // Extrae solo el nombre del archivo
    return path.join(UPLOADS_FOLDER, fileName); // Ajusta 'uploads' si es otro directorio
};

const deletePortfolio = async (req, res) => {
    const { id } = req.params;

    const result = await client.query('SELECT * FROM portfolio WHERE id= $1', [id]);

    if (result.rows.length > 0) {
        let portfolio = result.rows[0];

        let portfolioBaseLocation = portfolio.location;
        let portfolioBlurredLocation = portfolio.blurred_location

        if (portfolioBaseLocation.startsWith('http')) {
            portfolioBaseLocation = getFilePath(portfolioBaseLocation);
        }
        if (portfolioBlurredLocation && portfolioBlurredLocation.startsWith('http')) {
            portfolioBlurredLocation = getFilePath(portfolioBlurredLocation);
        }

        fs.promises.unlink(portfolioBaseLocation, (error) => {
            if (error) {
                console.log("Error al eliminar la imagen");
                return res.status(500).json({ error: "No se pudo eliminar la imagen" });
            }
        });

        if (portfolioBlurredLocation !== "") {
            fs.promises.unlink(portfolioBlurredLocation, (error) => {
                if (error) {
                    console.log("Error al eliminar la imagen");
                    return res.status(500).json({ error: "No se pudo eliminar la imagen" });
                }
            });
        }

    } else {
        return res.status(404).json({ error: "Imagen no encontrada" });
    }

    await client.query('DELETE FROM portfolio WHERE id = $1', [id]);
    res.json({ estado: "Imagen borrada correctamente" });
};

const uploadPortfolio = async (req, res) => {
    const { title, artist_id, styles, sfw_status } = req.body;
    const creationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No se subió ninguna imagen" });
    };

    const result = await client.query('SELECT * FROM portfolio WHERE artist_id = $1', [artist_id]);

    if (result.rows.length >= 3) {
        return res.status(401).json({ error: 'Ya alcanzaste el límite de 3 imágenes' });
    };

    const file = req.files[0];
    const filename = `image_${crypto.randomUUID()}.png`;

    let location = path.join(`${process.env.BACK_UPLOAD_DIR}`, filename);
    fs.writeFileSync(location, file.buffer);

    let blurredLocation = ("");

    //Maybe add compresion a resize.
    if (sfw_status === "false") {
        const blurredFilename = `blurred_${filename}`;
        blurredLocation = path.join(`${process.env.BACK_UPLOAD_DIR}`, blurredFilename);

        await sharp(location).blur(200).toFile(blurredLocation);
        blurredLocation = ('http://localhost:3000/' + blurredFilename);
    }

    location = ('http://localhost:3000/' + filename);

    await client.query(`INSERT INTO portfolio (name, artist_id, location, styles, sfw_status, blurred_location, upload_date) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [title, artist_id, location, styles, sfw_status, blurredLocation, creationDate]);
    res.json({ estado: "Imagen guardada correctamente" });
}

module.exports = { getPortfolio, getPortfolioByID, getPortfolioByArtistID, editPortfolio, deletePortfolio, uploadPortfolio }
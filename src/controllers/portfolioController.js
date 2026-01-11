const client = require('../db.js');
const multer = require('multer');
const path = require("path");
const sharp = require("sharp");
const cloudinary = require("../cloudinary.js");
require('dotenv').config();
const fs = require('fs');

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
    };
};

const editPortfolio = async (req, res) => {
    const { id } = req.params;
    const { name, sfw_status, styles } = req.body;

    await client.query('UPDATE portfolio SET name = $2, sfw_status = $3, styles = $4 WHERE id = $1', [id, name, sfw_status, styles]);
    res.json({ estado: "Imagen actualizada correctamente" });
};

const deletePortfolio = async (req, res) => {
    const { id } = req.params;

    const result = await client.query('SELECT * FROM portfolio WHERE id= $1', [id]);

    if (result.rows.length > 0) {
        const portfolio = result.rows[0];

        if (portfolio.location && portfolio.location.startsWith("http")) {
            const publicId = getPublicIdFromUrl(portfolio.location);
            try {
                await cloudinary.uploader.destroy(publicId);
                console.log(`Borrada imagen principal de Cloudinary: ${publicId}`);
            } catch (err) {
                console.error("Error borrando imagen principal de Cloudinary:", err.message);
            };
        };

        if (portfolio.blurred_location && portfolio.blurred_location.startsWith("http")) {
            const publicIdBlurred = getPublicIdFromUrl(portfolio.blurred_location);
            try {
                await cloudinary.uploader.destroy(publicIdBlurred);
                console.log(`Borrada imagen difuminada de Cloudinary: ${publicIdBlurred}`);
            } catch (err) {
                console.error("Error borrando imagen difuminada de Cloudinary:", err.message);
            };
        };

    } else {
        return res.status(404).json({ error: "Imagen no encontrada" });
    }

    await client.query('DELETE FROM portfolio WHERE id = $1', [id]);
    res.json({ estado: "Imagen borrada correctamente" });
};

const getPublicIdFromUrl = (url) => {
    const parts = url.split("/");
    const folderAndFile = parts.slice(-2).join("/");
    return folderAndFile.replace(/\.[^/.]+$/, "");
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

    const uploadToCloudinary = (buffer, folderName) =>
        new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: folderName, public_id: filename.replace(".png", ""), overwrite: true },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result.secure_url);
                }
            );
            stream.end(buffer);
        });

    const mainUrl = await uploadToCloudinary(file.buffer, "portfolio_images");

    let blurredLocation = ("");

    if (sfw_status === "false") {
        const blurredBuffer = await sharp(file.buffer).blur(200).png().toBuffer();
        blurredLocation = await uploadToCloudinary(blurredBuffer, "portfolio_images/blurred");
    };

    await client.query(`INSERT INTO portfolio (name, artist_id, location, styles, sfw_status, blurred_location, upload_date) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [title, artist_id, mainUrl, styles, sfw_status, blurredLocation, creationDate]);
    res.json({ estado: "Imagen guardada correctamente" });
}

module.exports = { getPortfolio, getPortfolioByID, getPortfolioByArtistID, editPortfolio, deletePortfolio, uploadPortfolio }
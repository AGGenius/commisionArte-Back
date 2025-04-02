const client = require('../db.js');
const multer = require('multer');

// Configuración de Multer para manejar solo los campos del formulario (sin archivos)
const upload = multer().none();  // `.none()` no procesará archivos, solo campos del formulario

const readBodyBeforeUpload = (req, res, next) => {

    console.log(req.doby)

    upload(req, res, (err) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ errors: 'Error al procesar los campos del formulario' });
        }

        // Comprobamos si el artist_id fue enviado
        const { artist_id } = req.body;
        if (!artist_id) {
            return res.status(400).json({ errors: 'artist_id es requerido' });
        }

        next();
    });
};

// Middleware para validar el número de imágenes subidas
const uploadImageChek = async (req, res, next) => {
    const { artist_id } = req.body;

    console.log(req.body);
    const result = await client.query('SELECT * FROM portfolio WHERE artist_id = $1', [artist_id]);

    console.log("Número de imágenes existentes: ", result.rows.length);

    // Verifica si el límite de imágenes se ha alcanzado
    if (result.rows.length >= 3) {
        return res.status(401).json({ errors: 'Ya alcanzaste el límite de 3 imágenes' });
    }

    // Si pasa la validación, continua con Multer
    next();
};

module.exports = { readBodyBeforeUpload, uploadImageChek }
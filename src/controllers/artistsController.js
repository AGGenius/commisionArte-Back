const client = require('../db.js');
const bcryp = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require("path");

const getArtists = async (req, res) => {
    const result = await client.query('SELECT * FROM artist ORDER BY id');
    let artists = result.rows;
    artists.forEach(user => delete user.password)

    res.json(artists);
}

const getArtistByID = async (req, res) => {
    const { id } = req.params;
    const result = await client.query('SELECT * FROM artist WHERE id= $1', [id]);

    if (result.rows.length > 0) {
        let artist = result.rows[0];
        delete artist.password;
        res.json(artist);
    } else {
        res.json({ estado: "Artista no encontrado" })
    }
}

const editArtist = async (req, res) => {
    const { id } = req.params;
    const { name, nick, email, sfw_status, comm_status, account_status, styles, reputation } = req.body;

    await client.query('UPDATE artist SET name = $2, nick = $3, email = $4, sfw_status = $5, comm_status = $6, account_status = $7, styles = $8, reputation = $9 WHERE id = $1', [id, name, nick, email, sfw_status, comm_status, account_status, styles, reputation]);
    res.json({ estado: "Artista actualizado correctamente" });
}

const editArtistByArtist = async (req, res) => {
    const { id } = req.params;
    const { name, nick, email, contactEmail, sfw_status, comm_status, styles, telephone, newPassword } = req.body;

    if (res.locals.verifiedUser) {

        if (newPassword) {
            const newSecurePassword = await bcryp.hash(newPassword, 10);
            await client.query('UPDATE artist SET name = $2, nick = $3, email = $4, contact_email = $5, sfw_status = $6, comm_status = $7, styles = $8, telephone = $9, password = $10 WHERE id = $1',
                [id, name, nick, email, contactEmail, sfw_status, comm_status, styles, telephone, newSecurePassword]);

            const result = await client.query('SELECT * FROM artist WHERE id= $1', [id]);
            let editedArtist = result.rows[0];
            delete editedArtist.password;

            res.json({ editedArtist, estado: "Usuario actualizado correctamente" });
        } else {
            await client.query('UPDATE artist SET name = $2, nick = $3, email = $4, contact_email = $5, sfw_status = $6, comm_status = $7, styles = $8, telephone = $9 WHERE id = $1',
                [id, name, nick, email, contactEmail, sfw_status, comm_status, styles, telephone]);

            const result = await client.query('SELECT * FROM artist WHERE id= $1', [id]);
            let editedArtist = result.rows[0];
            delete editedArtist.password;

            res.json({ editedArtist, estado: "Usuario actualizado correctamente" });
        }
    } else {
        res.json({ estado: "Contraseña incorrecta" });
    }
}

const rateUserArtist = async (req, res) => {
    const { rateValue, artistId, clientId, workcardId } = req.body;

    await client.query('UPDATE workcard SET artist_rated = $2 WHERE id = $1', [workcardId, true]);

    await client.query('UPDATE artist SET reputation = reputation + $2 WHERE id = $1',
        [artistId, rateValue]);

    await client.query('UPDATE client SET reputation = reputation + 1 WHERE id = $1',
        [clientId]);

    res.json({ estado: "Usuario valorado correctamente" });
};

const getFilePath = (fileUrl) => {
    const UPLOADS_FOLDER = path.join(__dirname, '..', '..', 'uploads');
    const fileName = path.basename(fileUrl); // Extrae solo el nombre del archivo
    return path.join(UPLOADS_FOLDER, fileName); // Ajusta 'uploads' si es otro directorio
};

const deletArtistByArtist = async (req, res) => {
    const { id } = req.params;

    const artist_id = id;

    const results = await client.query('SELECT * FROM portfolio where artist_id = $1', [artist_id]);

    if (results.rows.length > 0) {
        results.rows.forEach((result) => {
            const portfolio = result;

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
                };
            });

            if (portfolioBlurredLocation !== "") {
                fs.promises.unlink(portfolioBlurredLocation, (error) => {
                    if (error) {
                        console.log("Error al eliminar la imagen");
                        return res.status(500).json({ error: "No se pudo eliminar la imagen" });
                    };
                });
            };

        });
    } else {
        return res.status(404).json({ error: "Imagen no encontrada" });
    };

    await client.query('DELETE FROM portfolio WHERE artist_id = $1', [artist_id]);
    await client.query('DELETE FROM artist WHERE id = $1', [artist_id]);
    
    res.json({ estate: "Artista y galeria asociada borrados correctamente." });
};

const registerArtist = async (req, res) => {
    const { name, nick, email, contactEmail, telephone, password, accountType } = req.body;
    const securePassword = await bcryp.hash(password, 10);
    const registerDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await client.query(`INSERT INTO artist (name, nick, email, contact_email, telephone, password, sfw_status, comm_status, account_status, register, account_type, styles, reputation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [name, nick, email, contactEmail, telephone, securePassword, true, false, true, registerDate, accountType, "empty", 0]);
    res.json({ estado: "Usuario creado correctamente" });
}

const loginArtist = async (req, res) => {
    const artist = res.locals.verifiedUser;

    const token = jwt.sign({ id: artist.id, email: artist.email, type: artist.account_type, active: artist.account_status }, "secreto", { expiresIn: '1h' });
    res.json({ token, userId: artist.id });
}


module.exports = { getArtists, getArtistByID, loginArtist, editArtist, editArtistByArtist, rateUserArtist, deletArtistByArtist, registerArtist }
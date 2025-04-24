const client = require('../db.js');
const bcryp = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    const { name, nick, email, sfw_status, comm_status, acount_status, styles, reputation } = req.body;

    await client.query('UPDATE artist SET name = $2, nick = $3, email = $4, sfw_status = $5, comm_status = $6, acount_status = $7, styles = $8, reputation = $9 WHERE id = $1', [id, name, nick, email, sfw_status, comm_status, acount_status, styles, reputation]);
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

const deletArtistByArtist = async (req, res) => {
    const { id } = req.params;

    await client.query('DELETE FROM artist WHERE id = $1', [id]);
    res.json({ estado: "Usuario borrado correctamente" });
};

const registerArtist = async (req, res) => {
    const { name, nick, email, contactEmail, telephone, password, acountType } = req.body;
    const securePassword = await bcryp.hash(password, 10);
    const registerDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await client.query(`INSERT INTO artist (name, nick, email, contact_email, telephone, password, sfw_status, comm_status, acount_status, register, acount_type, styles, reputation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [name, nick, email, contactEmail, telephone, securePassword, true, false, true, registerDate, acountType, "empty", 0]);
    res.json({ estado: "Usuario creado correctamente" });
}

const loginArtist = async (req, res) => {
    const artist = res.locals.verifiedUser;

    const token = jwt.sign({ id: artist.id, email: artist.email, type: artist.acount_type, active: artist.acount_status }, "secreto", { expiresIn: '1h' });
    res.json({ token, userId: artist.id });
}


module.exports = { getArtists, getArtistByID, loginArtist, editArtist, editArtistByArtist, deletArtistByArtist, registerArtist }
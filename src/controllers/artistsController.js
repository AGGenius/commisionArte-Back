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
    const { name, nick, email, sfw_status, comm_status, acount_status, styles, reputation} = req.body;

    await client.query('UPDATE artist SET name = $2, nick = $3, email = $4, sfw_status = $5, comm_status = $6, acount_status = $7, styles = $8, reputation = $9 WHERE id = $1', [id, name, nick, email, sfw_status, comm_status, acount_status, styles, reputation]);
    res.json({ estado: "Artista actualizado correctamente" });
}

const editArtistByArtist = async (req, res) => {
    const { id } = req.params;
    const { name, nick, email, sfw_status, comm_status, acount_status, styles} = req.body;

    if(res.locals.verifiedUser) {

        if(res.locals.newPasword) {
            const newSecurePassword = await bcryp.hash(res.locals.newPasword, 10);
            await client.query('UPDATE artist SET name = $2, nick = $3, email = $4, sfw_status = $5, comm_status = $6, acount_status = $7, styles = $8, password = $9 WHERE id = $1', [id, name, nick, email, sfw_status, comm_status, acount_status, styles, newSecurePassword]);
            res.json({ estado: "Usuario actualizado correctamente" });
        } else {
            await client.query('UPDATE artist SET name = $2, nick = $3, email = $4, sfw_status = $5, comm_status = $6, acount_status = $7, styles = $8 WHERE id = $1', [id, name, nick, email, sfw_status, comm_status, acount_status, styles]);
            res.json({ estado: "Usuario actualizado correctamente" });
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
    const { name, nick, email, password, sfw_status, comm_status, acount_status, styles, reputation} = req.body;
    const securePassword = await bcryp.hash(password, 10);

    await client.query(`INSERT INTO artist (name, nick, email, password, sfw_status, comm_status, acount_status, styles, reputation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [name, nick, email, securePassword, sfw_status, comm_status, acount_status, styles, reputation]);
    res.json({ estado: "Usuario creado correctamente" });
}

const loginArtist = async (req, res) => {
    const artist = res.locals.verifiedUser;

    const token = jwt.sign({ id: artist.id, email: artist.email, type: artist.type, active: artist.active }, "secreto", { expiresIn: '1h' });
    res.json({ token, userId: artist.id });
}


module.exports = { getArtists, getArtistByID, loginArtist, editArtist, editArtistByArtist, deletArtistByArtist, registerArtist }
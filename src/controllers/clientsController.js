const client = require('../db.js');
const bcryp = require('bcrypt');
const jwt = require('jsonwebtoken');

const getClients = async (req, res) => {
    const result = await client.query('SELECT * FROM client ORDER BY id');
    let artists = result.rows;
    artists.forEach(user => delete user.password)

    res.json(artists);
}

const getClientByID = async (req, res) => {
    const { id } = req.params;
    const result = await client.query('SELECT * FROM client WHERE id= $1', [id]);

    if (result.rows.length > 0) {
        let artist = result.rows[0];
        delete artist.password;
        res.json(artist);
    } else {
        res.json({ estado: "Cliente no encontrado" })
    }
}

const editClient = async (req, res) => {
    const { id } = req.params;
    const { name, nick, email, sfw_status, acount_status, reputation} = req.body;

    await client.query('UPDATE client SET name = $2, nick = $3, email = $4, sfw_status = $5, acount_status = $6, reputation = $7 WHERE id = $1', [id, name, nick, email, sfw_status, acount_status, reputation]);
    res.json({ estado: "Cliente actualizado correctamente" });
}

const editClientByClient = async (req, res) => {
    const { id } = req.params;
    const { name, nick, email, sfw_status, acount_status} = req.body;

    if(res.locals.verifiedUser) {

        if(res.locals.newPasword) {
            const newSecurePassword = await bcryp.hash(res.locals.newPasword, 10);
            await client.query('UPDATE client SET name = $2, nick = $3, email = $4, sfw_status = $5, acount_status = $6, password = $7 WHERE id = $1', [id, name, nick, email, sfw_status, acount_status, newSecurePassword]);
            res.json({ estado: "Cliente actualizado correctamente" });
        } else {
            await client.query('UPDATE client SET name = $2, nick = $3, email = $4, sfw_status = $5, acount_status = $6 WHERE id = $1', [id, name, nick, email, sfw_status, acount_status]);
            res.json({ estado: "Cliente actualizado correctamente" });
        }
    } else {
        res.json({ estado: "Contraseña incorrecta" });
    }
}

const deletClientByClient = async (req, res) => {
    const { id } = req.params;

    await client.query('DELETE FROM client WHERE id = $1', [id]);
    res.json({ estado: "Usuario borrado correctamente" });
};

const registerClient = async (req, res) => {
    const { name, nick, email, password} = req.body;
    const securePassword = await bcryp.hash(password, 10);

    await client.query(`INSERT INTO client (name, nick, email, password, sfw_status, acount_status, reputation) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [name, nick, email, securePassword, true, true, 0]);
    res.json({ estado: "Cliente creado correctamente" });
}

const loginClient = async (req, res) => {
    const artist = res.locals.verifiedUser;

    const token = jwt.sign({ id: artist.id, email: artist.email, type: artist.acount_type, active: artist.acount_status }, "secreto", { expiresIn: '1h' });
    res.json({ token, userId: artist.id });
}


module.exports = { getClients, getClientByID, editClient, editClientByClient, deletClientByClient, registerClient, loginClient }
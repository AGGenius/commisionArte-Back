const client = require('../db.js');

const getStateCards = async (req, res) => {
    const result = await client.query('SELECT * FROM workCard ORDER BY id');
    let workCard = result.rows;

    res.json(workCard);
}

const getStateCardsByID = async (req, res) => {
    const { id } = req.params;
    const result = await client.query('SELECT * FROM workCard WHERE id= $1', [id]);

    if (result.rows.length > 0) {
        let workCard = result.rows[0];
        res.json(workCard);
    } else {
        res.json({ estado: "Tarjeta de trabajo no encontrada" })
    }
}

const editStateCard = async (req, res) => {
    const { id } = req.params;
    const { name, nick, email, sfw_status, acount_status, reputation} = req.body;

    await client.query('UPDATE client SET name = $2, nick = $3, email = $4, sfw_status = $5, acount_status = $6, reputation = $7 WHERE id = $1', [id, name, nick, email, sfw_status, acount_status, reputation]);
    res.json({ estado: "Cliente actualizado correctamente" });
}

const deleteStateCard = async (req, res) => {
    const { id } = req.params;

    await client.query('DELETE FROM workCard WHERE id = $1', [id]);
    res.json({ estado: "Tarjeta de trabajo borrada correctamente" });
};

const uploadStateCard = async (req, res) => {
    const { artist_id, client_id, status, commentary } = req.body;

    await client.query(`INSERT INTO workCard (artist_id, client_id, status, commentary) VALUES ($1, $2, $3, $4)`, [artist_id, client_id, status, commentary]);
    res.json({ estado: "Tarjeta de trabajo creada correctamente" });
}

module.exports = { getStateCards, getStateCardsByID, editStateCard, deleteStateCard, uploadStateCard}
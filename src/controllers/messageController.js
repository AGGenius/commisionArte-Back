const client = require('../db.js');

const getMessages = async (req, res) => {
    const result = await client.query('SELECT * FROM messages ORDER BY id');
    let openWork = result.rows;

    res.json(openWork);
}

const getMessagskByID = async (req, res) => {
    const { id } = req.params;
    const result = await client.query('SELECT * FROM messages WHERE id= $1', [id]);

    if (result.rows.length > 0) {
        let openWork = result.rows[0];
        res.json(openWork);
    } else {
        res.json({ estado: "Mensaje no encontrado." })
    }
}

const editMessages = async (req, res) => {
    const { id } = req.params;
    const { artist_id, client_id, subject, content } = req.body;

    await client.query('UPDATE messages SET artist_id = $2, client_id = $3, subject = $4, content = $5 WHERE id = $1', [id, artist_id, client_id, subject, content]);
    res.json({ estado: "Mensaje actualizado correctamente." });
}

const deleteMessages = async (req, res) => {
    const { id } = req.params;

    await client.query('DELETE FROM messages WHERE id = $1', [id]);
    res.json({ estado: "Mensaje borrado correctamente." });
};

const uploadMessages = async (req, res) => {
    const { artist_id, client_id, subject, content } = req.body;

    await client.query(`INSERT INTO messages (artist_id, client_id, subject, content) VALUES ($1, $2, $3, $4)`, [artist_id, client_id, subject, content]);
    res.json({ estado: "Mensaje creado correctamente." });
}

module.exports = { getMessages, getMessagskByID, editMessages, deleteMessages, uploadMessages}
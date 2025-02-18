const client = require('../db.js');

const getRejectedWorks = async (req, res) => {
    const result = await client.query('SELECT * FROM workCard ORDER BY id');
    let workCard = result.rows;

    res.json(workCard);
}

const getRejectedWorksByID = async (req, res) => {
    const { id } = req.params;
    const result = await client.query('SELECT * FROM workCard WHERE id= $1', [id]);

    if (result.rows.length > 0) {
        let workCard = result.rows[0];
        res.json(workCard);
    } else {
        res.json({ estado: "Tarjeta de trabajo no encontrada" })
    }
}

const editRejectedWorks = async (req, res) => {
    const { id } = req.params;
    const { artist_id, client_id, status, commentary } = req.body;

    await client.query('UPDATE workCard SET artist_id = $2, client_id = $3, status = $4, commentary = $5 WHERE id = $1', [id, artist_id, client_id, status, commentary]);
    res.json({ estado: "Tarjeta de trabajo actualizada correctamente" });
}

const deleteRejectedWorks= async (req, res) => {
    const { id } = req.params;

    await client.query('DELETE FROM workCard WHERE id = $1', [id]);
    res.json({ estado: "Tarjeta de trabajo borrada correctamente" });
};

const uploadRejectedWorks = async (req, res) => {
    const { artist_id, client_id, openWork_id } = req.body;
    const creationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await client.query(`INSERT INTO rejected_work (artist_id, client_id, openWork_id, rejection_date) VALUES ($1, $2, $3, $4)`, [artist_id, client_id, openWork_id, creationDate]);
    res.json({ estado: "Entrada de rechazo de trabajo creada correctamente" });
}

module.exports = { getRejectedWorks, getRejectedWorksByID, editRejectedWorks, deleteRejectedWorks, uploadRejectedWorks}
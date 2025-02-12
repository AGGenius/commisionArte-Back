const client = require('../db.js');

const getOpenWork = async (req, res) => {
    const result = await client.query('SELECT * FROM openWork ORDER BY id');
    let openWork = result.rows;

    res.json(openWork);
}

const getOpenWorkByID = async (req, res) => {
    const { id } = req.params;
    const result = await client.query('SELECT * FROM openWork WHERE id= $1', [id]);

    if (result.rows.length > 0) {
        let openWork = result.rows[0];
        res.json(openWork);
    } else {
        res.json({ estado: "Solicitud de trabajo de trabajo no encontrada" })
    }
}

const getOpenWorkByClientID = async (req, res) => {
    const { client_id } = req.params;
    const result = await client.query('SELECT * FROM openWork WHERE client_id= $1 ORDER BY id', [client_id]);

    let openWork = result.rows;
    res.json(openWork);
}

const editOpenWork = async (req, res) => {
    const { id } = req.params;
    const { artist_id, client_id, tittle, content, sfw_status } = req.body;

    await client.query('UPDATE openWork SET artist_id = $2, client_id = $3, tittle = $4, content = $5, sfw_status = $6 WHERE id = $1', [id, artist_id, client_id, tittle, content, sfw_status]);
    res.json({ estado: "Solicitud de trabajo actualizada correctamente" });
}

const deleteOpenWork = async (req, res) => {
    const { id } = req.params;

    await client.query('DELETE FROM openWork WHERE id = $1', [id]);
    res.json({ estado: "Solicitud de trabajo borrada correctamente" });
};

const uploadOpenWork = async (req, res) => {
    const { artist_id, client_id, tittle, content, sfw_status } = req.body;
    const creationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await client.query(`INSERT INTO openWork (artist_id, client_id, status, tittle, content, sfw_status, creation_date) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [artist_id, client_id, "open", tittle, content, sfw_status, creationDate]);
    res.json({ estado: "Solicitud de trabajo creada correctamente" });
}

module.exports = { getOpenWork, getOpenWorkByID, getOpenWorkByClientID, editOpenWork, deleteOpenWork, uploadOpenWork}
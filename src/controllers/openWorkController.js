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

const getOpenWorkAvailable = async (req, res) => {
    const { artist_id } = req.params;
    const result = await client.query('SELECT * FROM openWork ow WHERE status = \'open\' AND NOT EXISTS (SELECT 1 FROM rejected_work rw WHERE rw.openWork_id = ow.id AND rw.artist_id = $1) ORDER BY id', [artist_id]);

    let openWork = result.rows;
    res.json(openWork);
}


const getOpenWorTakenkByArtistID = async (req, res) => {
    const { artist_id } = req.params;
    const result = await client.query('SELECT * FROM openWork WHERE artist_id = $1 AND status IN (\'taken\', \'confirmed\') ORDER BY id', [artist_id]);

    let openWork = result.rows;
    res.json(openWork);
}

const getOpenWorkByClientID = async (req, res) => {
    const { client_id } = req.params;
    const result = await client.query('SELECT * FROM openWork WHERE client_id= $1 ORDER BY id', [client_id]);

    let openWork = result.rows;
    res.json(openWork);
}

//This is not updtaded.
const editOpenWork = async (req, res) => {
    const { id } = req.params;
    const { artist_id, client_id, tittle, content, sfw_status } = req.body;

    await client.query('UPDATE openWork SET artist_id = $2, client_id = $3, tittle = $4, content = $5, sfw_status = $6 WHERE id = $1', [id, artist_id, client_id, tittle, content, sfw_status]);
    res.json({ estado: "Solicitud de trabajo actualizada correctamente" });
}

const takeOpenWork = async (req, res) => {
    const { id } = req.params;
    const { artist_id } = req.body;

    let actualState = "";
    const result = await client.query('SELECT * FROM openWork WHERE id= $1', [id]);

    if (result.rows.length > 0) {
        let openWork = result.rows[0];

        if(openWork.status === "taken" && openWork.artist_id != artist_id) { 
            res.json({ estado: "Solicitud de trabajo ya no disponible." });
            return;
        }

        actualState = openWork.status;

        if (actualState === "open") {
            await client.query('UPDATE openWork SET status = $2, artist_id = $3 WHERE id = $1', [id, "taken", artist_id]);

            res.json({ estado: "Solicitud de trabajo tomada correctamente" });
        } else {
            await client.query('UPDATE openWork SET status = $2, artist_id = $3 WHERE id = $1', [id, "open", 0]);

            res.json({ estado: "Solicitud de trabajo anulada correctamente" });
        }

    } else {
        res.json({ estado: "Solicitud de trabajo de trabajo no encontrada" })
    }
}

const declineOpenWork = async (req, res) => {
    const { id } = req.params;

    const result = await client.query('SELECT * FROM openWork WHERE id= $1', [id]);

    if (result.rows.length > 0) {
        let openWork = result.rows[0];

        if(openWork.status !== "taken" || openWork.artist_id === 0) { 
            res.json({ estado: "Solicitud de trabajo no aceptada actualmente." });
            return;
        }

        await client.query('UPDATE openWork SET status = $2, artist_id = $3 WHERE id = $1', [id, "open", 0]);

        res.json({ estado: "Solicitud de trabajo declinada correctamente" });

    } else {
        res.json({ estado: "Solicitud de trabajo de trabajo no encontrada" })
    }
}

const confirmOpenWork = async (req, res) => {
    const { id } = req.params;

    const result = await client.query('SELECT * FROM openWork WHERE id= $1', [id]);

    if (result.rows.length > 0) {
        let openWork = result.rows[0];

        if(openWork.status !== "taken" || openWork.artist_id === 0) { 
            res.json({ estado: "Solicitud de trabajo no aceptada actualmente." });
            return;
        }

        await client.query('UPDATE openWork SET status = $2 WHERE id = $1', [id, "confirmed"]);

        res.json({ estado: "Solicitud de trabajo confirmada correctamente"});

    } else {
        res.json({ estado: "Solicitud de trabajo de trabajo no encontrada"})
    }
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

module.exports = { getOpenWork, getOpenWorkByID, getOpenWorkAvailable, getOpenWorTakenkByArtistID, getOpenWorkByClientID, editOpenWork, takeOpenWork, declineOpenWork, confirmOpenWork, deleteOpenWork, uploadOpenWork }
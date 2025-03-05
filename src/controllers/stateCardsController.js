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


//Tal vez modificar esto para solo usar un endpoint.
const getStateCardsByArtistID = async (req, res) => {
    const { artist_id } = req.params;

    const result = await client.query(`
        SELECT 
          workCard.*, 
          client.name AS client_name, 
          artist.name AS artist_name, 
          openWork.title AS work_title
        FROM workCard
        JOIN client ON workCard.client_id = client.id
        JOIN artist ON workCard.artist_id = artist.id
        JOIN openWork ON workCard.openwork_id = openWork.id
        WHERE workCard.artist_id = $1
        ORDER BY workCard.id
      `, [artist_id]);

    let workCard = result.rows;
    res.json(workCard);
}

//Tal vez modificar esto para solo usar un endpoint.
const getStateCardsClientID = async (req, res) => {
    const { client_id } = req.params;

    const result = await client.query(`
        SELECT 
          workCard.*, 
          client.name AS client_name, 
          artist.name AS artist_name, 
          openWork.title AS work_title
        FROM workCard
        JOIN client ON workCard.client_id = client.id
        JOIN artist ON workCard.artist_id = artist.id
        JOIN openWork ON workCard.openwork_id = openWork.id
        WHERE workCard.client_id = $1
        ORDER BY workCard.id
      `, [client_id]);

    let workCard = result.rows;
    res.json(workCard);
}

const editStateCard = async (req, res) => {
    const { id } = req.params;
    const { artist_id, client_id, status, commentary } = req.body;

    await client.query('UPDATE workCard SET artist_id = $2, client_id = $3, status = $4, commentary = $5 WHERE id = $1', [id, artist_id, client_id, status, commentary]);
    res.json({ estado: "Tarjeta de trabajo modificada correctamente" });
}

const updateStateCard = async (req, res) => {
    const { id } = req.params;
    const { status, commentary } = req.body;
    const lastModificationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await client.query('UPDATE workCard SET status = $2, commentary = $3, last_modification_date = $4 WHERE id = $1', [id, status, commentary, lastModificationDate]);
    res.json({ estado: "Tarjeta de trabajo actualizada correctamente" });
}

const deleteStateCard = async (req, res) => {
    const { id } = req.params;

    await client.query('DELETE FROM workCard WHERE id = $1', [id]);
    res.json({ estado: "Tarjeta de trabajo borrada correctamente" });
};

const uploadStateCard = async (req, res) => {
    const { artist_id, client_id, openWork_id } = req.body;
    
    const creationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const lastModificationDate = creationDate;
    const status = "Recien creada";
    const commentary = "Primera puesta en contacto"

    await client.query(`INSERT INTO workCard (artist_id, client_id, openwork_id, status, commentary, creation_date, last_modification_date) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [artist_id, client_id, openWork_id, status, commentary, creationDate, lastModificationDate]);
    res.json({ estado: "Trabajo aceptado y tarjeta de trabajo creada correctamente" });
}

module.exports = { getStateCards, getStateCardsByID, getStateCardsClientID, getStateCardsByArtistID, editStateCard, updateStateCard, deleteStateCard, uploadStateCard}
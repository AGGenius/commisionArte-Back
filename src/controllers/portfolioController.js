const client = require('../db.js');

const getPortfolio = async (req, res) => {
    const result = await client.query('SELECT * FROM portfolio ORDER BY id');
    let portfolio = result.rows;

    res.json(portfolio);
}

const getPortfolioByID = async (req, res) => {
    const { id } = req.params;
    const result = await client.query('SELECT * FROM portfolio WHERE id= $1', [id]);

    if (result.rows.length > 0) {
        let portfolio = result.rows[0];
        res.sendFile(portfolio.location);
    } else {
        res.json({ estado: "Cliente no encontrado" })
    }
}

const editPortfolio = async (req, res) => {
    const { id } = req.params;
    const { name, sfw_status, styles } = req.body;

    await client.query('UPDATE portfolio SET name = $2, sfw_status = $3, styles = $4 WHERE id = $1', [id, name, sfw_status, styles ]);
    res.json({ estado: "Imagen actualizada correctamente" });
}

const deletePortfolio = async (req, res) => {
    const { id } = req.params;

    await client.query('DELETE FROM portfolio WHERE id = $1', [id]);
    res.json({ estado: "Imagen borrada correctamente" });
};

const uploadPortfolio = async (req, res) => {

    //Postman doest work on this, I have to wait to have the frontend.
    const { name, artist_id, styles, password, sfw_status } = req.body;

    console.log(req.body)
    if (!req.file) {
        console.log("No file received");
        return res.send({
            success: false
        });

    } else {
        console.log('file received');
        return res.send({
            success: true
        })
    }
    

    //await client.query(`INSERT INTO client (name, nick, email, password, sfw_status, acount_status, reputation) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [name, nick, email, securePassword, sfw_status, acount_status, reputation]);
    //res.json({ estado: "Cliente creado correctamente" });


    //To store the new file. I need to make it to save in the DDBB the location as the "location"
    
}

module.exports = { getPortfolio, getPortfolioByID, editPortfolio, deletePortfolio, uploadPortfolio}
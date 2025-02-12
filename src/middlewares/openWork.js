const client = require('../db.js');

const openWorksLimit = async (req, res, next) => {
    const { client_id } = req.body;
    
    const result = await client.query('SELECT * FROM openwork WHERE client_id = $1', [client_id]);

    console.log(result.rows.length)

    if (result.rows.length >= 5) {
        return res.status(401).json({ estado: 'No es posible realizar mas de cinco solicitudes.' });
    }

	next();
}



module.exports = { openWorksLimit }
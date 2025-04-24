const client = require('../db.js');
const bcryp = require('bcrypt');

const validLoginData = async (req, res, next) => {
    const { email, password } = req.body;
    
    const result = await client.query('SELECT * FROM client WHERE email = $1', [email]);

    if (result.rows.length === 0) {
        return res.status(401).json({ errors: 'Credenciales incorrectas' });
    }

    const clientData = result.rows[0];

    if (!clientData.acount_status) {
        return res.status(401).json({ errors: 'Usuario inactivo' });
    };

    const verifiedUser = await bcryp.compare(password, clientData.password);

    if (!verifiedUser) {
        return res.status(401).json({ errors: 'Credenciales incorrectas' });
    };

    res.locals.verifiedUser = clientData;
	next();
}

const validUserData = async (req, res, next) => {
    const { id } = req.params;
    const { password} = req.body;
    
    const result = await client.query('SELECT * FROM client WHERE id = $1', [id]);

    if (result.rows.length === 0) {
        return res.json({ estado: 'Usuario no encontrado' });
    }

    const clientData = result.rows[0];

    if (!clientData.acount_status) {
        return res.json({ estado: 'Usuario inactivo' });
    };

    const verifiedUser = await bcryp.compare(password, clientData.password);
    res.locals.verifiedUser = verifiedUser;

    if (!verifiedUser) {
        return res.json({ estado: 'Credenciales incorrectas' });      
    };

	next();
}



module.exports = { validLoginData, validUserData }
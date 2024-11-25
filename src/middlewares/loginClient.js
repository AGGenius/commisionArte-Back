const client = require('../db.js');
const bcryp = require('bcrypt');

const validLoginData = async (req, res, next) => {
    const { email, password } = req.body;
    
    const result = await client.query('SELECT * FROM client WHERE email = $1', [email]);

    if (result.rows.length === 0) {
        return res.status(401).json({ estado: 'Credenciales incorrectas' });
    }

    const clientData = result.rows[0];

    if (!clientData.acount_status) {
        return res.status(401).json({ estado: 'Usuario inactivo' });
    };

    const verifiedUser = await bcryp.compare(password, clientData.password);

    if (!verifiedUser) {
        return res.status(401).json({ estado: 'Credenciales incorrectas' });
    };

    res.locals.verifiedUser = clientData;
	next();
}

const validUserData = async (req, res, next) => {
    const { id } = req.params;
    const { password, pass1, pass2 } = req.body;
    
    const result = await client.query('SELECT * FROM client WHERE id = $1', [id]);

    if(pass1 && pass2) {
        if(pass1 === pass2) {
            res.locals.newPasword = pass1;
        } else {      
            return res.status(401).json({ estado: 'Las contraseñas no coinciden' });
        }
    }

    if (result.rows.length === 0) {
        return res.status(401).json({ estado: 'Credenciales incorrectas' });
    }

    const clientData = result.rows[0];

    if (!clientData.acount_status) {
        return res.status(401).json({ estado: 'Usuario inactivo' });
    };

    const verifiedUser = await bcryp.compare(password, clientData.password);

    if (!verifiedUser) {
        return res.status(401).json({ estado: 'Credenciales incorrectas' });
    };

    res.locals.verifiedUser = clientData;
	next();
}



module.exports = { validLoginData, validUserData }
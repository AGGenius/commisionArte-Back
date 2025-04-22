const client = require('../db.js');
const bcryp = require('bcrypt');

const validLoginData = async (req, res, next) => {
    const { email, password } = req.body;
    
    const result = await client.query('SELECT * FROM artist WHERE email = $1', [email]);

    if (result.rows.length === 0) {
        return res.status(401).json({ errors: 'Credenciales incorrectas' });
    }

    const artist = result.rows[0];

    if (!artist.acount_status) {
        return res.status(401).json({ errors: 'Usuario inactivo' });
    };

    const verifiedUser = await bcryp.compare(password, artist.password);

    if (!verifiedUser) {
        return res.status(401).json({ errors: 'Credenciales incorrectas' });
    };

    res.locals.verifiedUser = artist;
	next();
}

const validUserData = async (req, res, next) => {
    const { id } = req.params;
    const { password } = req.body;
    
    const result = await client.query('SELECT * FROM artist WHERE id = $1', [id]);

    if (result.rows.length === 0) {
        return res.status(401).json({ errors: 'Usuario no encontrado' });
    }

    const artist = result.rows[0];

    if (!artist.acount_status) {
        return res.status(401).json({ errors: 'Usuario inactivo' });
    };

    const verifiedUser = await bcryp.compare(password, artist.password);

    if (!verifiedUser) {
        return res.status(401).json({ errors: 'Credenciales incorrectas' });
    };
    
	next();
}



module.exports = { validLoginData, validUserData }
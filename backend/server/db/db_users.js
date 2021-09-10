const {pool} = require('./db');

const getUsersSQL = `
    SELECT * FROM users;
`;

const getUsers = async() => {
    
    try {
        const result = await pool.query(getUsersSQL);
        //Comprobamos que haya usuarios
        if(result.rowCount < 1) {
           return { ok: true, found: false }; //No se han encontrado usuarios
        }
        return { ok:true, found: true, data: result.rows}; //Se han encontrado usuarios
    }catch(e) {
           return { ok: false, data: e.toString() };
       }
}

const getOneUserSQL = `
    SELECT * FROM users WHERE USE_id = $1;
`;

const getOneUser = async(USE_id) => {
    try {
        const result = await pool.query(getOneUserSQL, [USE_id]);
        //Comprobamos que el cliente exista
        if(result.rowCount < 1) {
           return { ok: true, found: false }; //No se ha encontrado el usuario
        }
        return { ok:true, found: true, data: result.rows}; //Se ha encontrado el usuario
    }catch(e) {
           return { ok: false, data: e.toString() };
       }
}

const getUserByEmailSQL = `
    SELECT USE_password FROM users WHERE USE_email = $1;
`;

const getUserByEmail = async(USE_email) => {
    try {
        console.log(`USE_email_DB_users ${USE_email}`)
        const result = await pool.query(getUserByEmailSQL, [USE_email]);
        
        //Comprobamos que el cliente exista
        if(result.rowCount < 1) {
           return { ok: true, found: false }; //No se ha encontrado el usuario
        }
        return { ok:true, found: true, data: result.rows[0]}; //Se ha encontrado el usuario
    }catch(e) {
           return { ok: false, data: e.toString() };
       }
}

const newUserSQL = `
    INSERT INTO users (USE_email, USE_password) VALUES ($1,$2) RETURNING *;
`;

const newUser = async (USE_email, hashedPassword) => {
    const result = await pool.query(newUserSQL, [USE_email, hashedPassword]);
    return result.rows;
}

const updateUserSQL = `
    UPDATE users SET  USE_email = $2,
                      USE_password = $3
    WHERE USE_id = $1 RETURNING *;  
`;

const updateUser = async (USE_id,USE_email, USE_password) => {
    try {    
        const result = await pool.query(updateUserSQL, [USE_id,USE_email, USE_password]);
        if(result.rowCount < 1) {
            return { ok: true, found: false };
        }
    return { ok:true, found: true, data: result.rows};
    } catch(e) {
        return { ok: false, data: e.toString() };
    }
}


const deleteUserSQL = `
DELETE FROM users WHERE USE_id = $1 RETURNING *; 
`;

const deleteUser = async (USE_id) => {
    try {
        const result = await pool.query(deleteUserSQL, [USE_id]);
        //Comprobamos que se haya eliminado algun usuario
        if(result.rowCount < 1) {
           return { ok: true, found: false }; //No se ha eliminado ningun usuario
        }
        return { ok:true, found: true, data: result.rows}; //Se ha eliminado el usuario
       }catch(e) {
           return { ok: false, data: e.toString() };
       }
};


module.exports = {
    getUsers,
    getOneUser,
    newUser,
    updateUser,
    deleteUser,
    getUserByEmail,
};


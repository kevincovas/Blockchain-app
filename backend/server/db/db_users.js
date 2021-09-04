const {pool} = require('./db');

/*  user_id SERIAL PRIMARY KEY,
    email VARCHAR(25),
    user_password VARCHAR(12),
    created TIMESTAMP DEFAULT NOW(),
    updated TIMESTAMP */

const getUsersSQL = `
    SELECT * FROM users;
`;

const getUsers = async() => {
    const result = await pool.query(getUsersSQL);
    return result.rows;
}

const getOneUserSQL = `
    SELECT * FROM users WHERE user_id = $1;
`;

const getOneUser = async(user_id) => {
    const result = await pool.query(getOneUserSQL, [user_id]);
    return result.rows;
}

const newUsersQL = `
    INSERT INTO users (email, user_password) VALUES ($1,$2) RETURNING *;
`;

const newUser = async (email, user_password) => {
    const result = await pool.query(newUsersQL, [email, user_password]);
    return result.rows;
}

const updateUserSQL = `
    UPDATE users SET  email = $2,
                      user_password = $3
    WHERE user_id = $1 RETURNING *;  
`;

const updateUser = async (user_id,email, user_password) => {
    try {    
        const result = await pool.query(updateUserSQL, [user_id,email, user_password]);
        if(result.rowCount < 1) {
            return { ok: true, found: false };
        }
    return { ok:true, found: true, data: result.rows};
    } catch(e) {
        return { ok: false, data: e.toString() };
    }
}


const deleteUserSQL = `
DELETE FROM users WHERE user_id = $1 RETURNING *; 
`;

const deleteUser = async (user_id) => {
    try {
        const result = await pool.query(deleteUserSQL, [user_id]);
        if(result.rowCount < 1) {
           return { ok: true, found: false };
        }
        return { ok:true, found: true, data: result.rows};
       } catch(e) {
           return { ok: false, data: e.toString() };
       }
};


module.exports = {
    getUsers,
    getOneUser,
    newUser,
    updateUser,
    deleteUser,
};


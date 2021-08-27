const { Pool } = require('pg');


const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'admin',
    password: 'mysecretpassword',
    database: 'clientsite',
});

const getClientsSQL = `
    SELECT * FROM clients;
`;

const getClients = async() => {
    const result = await pool.query(getClientsSQL);
    return result.rows;
}

const newClientSQL = `
    INSERT INTO clients (client_name) VALUES ($1) RETURNING *;
`;

const newClient = async (name) => {
    const result = await pool.query(newClientSQL, [name]);
    return result.rows[0];
}

module.exports = {
    getClients,
    newClient,
};


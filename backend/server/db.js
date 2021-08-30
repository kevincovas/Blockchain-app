const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool({
    host: config.DB_HOST,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
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


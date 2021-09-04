const {pool} = require('./db');

const getClientsSQL = `
    SELECT * FROM clients;
`;

const getClients = async() => {
    const result = await pool.query(getClientsSQL);
    return result.rows;
}

const getOneClientSQL = `
    SELECT * FROM clients WHERE client_name = $1;
`;

const getOneClient = async(client_name) => {
    const result = await pool.query(getOneClientSQL, [client_name]);
    return result.rows;
}

const newClientSQL = `
    INSERT INTO clients (client_name, client_surname, gender, birth_date, phone, cell_phone, details) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *;
`;

const newClient = async (client_name, client_surname, gender, birth_date, phone, cell_phone, details) => {
    const result = await pool.query(newClientSQL, [client_name, client_surname, gender, birth_date, phone, cell_phone, details]);
    return result.rows;
}

const updateClientSQL = `
    UPDATE clients SET  birth_date = $2,
                        phone = $3,
                        cell_phone = $4,
                        details = $5
    WHERE client_id = $1 RETURNING *;  
`;

const updateClient = async (client_id, birth_date, phone, cell_phone, details) => {
    try {    
        const result = await pool.query(updateClientSQL, [client_id, birth_date, phone, cell_phone, details]);
        /* Result.rowCount refleja cuantas filas modificó el servidor para procesar el comando*/
        if(result.rowCount < 1) {
            return { ok: true, found: false };
        }
    return { ok:true, found: true, data: result.rows};
    } catch(e) {
        return { ok: false, data: e.toString() };
    }
}


const deleteClientSQL = `
DELETE FROM clients WHERE client_id = $1 RETURNING *; 
`;

const deleteClient = async (client_id) => {
    try {
        const result = await pool.query(deleteClientSQL, [client_id]);
        if(result.rowCount < 1) {
           return { ok: true, found: false };
        }
        return { ok:true, found: true, data: result.rows};
       } catch(e) {
           return { ok: false, data: e.toString() };
       }
};


module.exports = {
    getClients,
    getOneClient,
    newClient,
    updateClient,
    deleteClient,
};


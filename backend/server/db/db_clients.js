const {pool} = require('./db');

const getClientsSQL = `
    SELECT * FROM people;
`;

const getClients = async() => {
    
    try {
        const result = await pool.query(getClientsSQL);
        //Comprobamos que haya clientes
        if(result.rowCount < 1) {
           return { ok: true, found: false }; //No se han encontrado clientes
        }
        return { ok:true, found: true, data: result.rows}; //Se han encontrado clientes
    }catch(e) {
           return { ok: false, data: e.toString() };
       }
}

const getOneClientSQL = `
    SELECT * FROM people WHERE PEO_id = $1;
`;

const getOneClient = async(PEO_id) => {

    try {
        const result = await pool.query(getOneClientSQL, [PEO_id]);
        //Comprobamos que el cliente exista
        if(result.rowCount < 1) {
           return { ok: true, found: false }; //No se ha encontrado el cliente
        }
        return { ok:true, found: true, data: result.rows}; //Se ha encontrado el cliente
    }catch(e) {
           return { ok: false, data: e.toString() };
       }
}

const newClientSQL = `
    INSERT INTO people (PEO_name, PEO_surname_1, PEO_surname_2, PEO_gender, PEO_birth_date, PEO_phone, PEO_observations) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *;
`;

const newClient = async (PEO_name, PEO_surname_1, PEO_surname_2, PEO_gender, PEO_birth_date, PEO_phone, PEO_observations) => {
    const result = await pool.query(newClientSQL, [PEO_name, PEO_surname_1, PEO_surname_2, PEO_gender, PEO_birth_date, PEO_phone, PEO_observations]);
    return result.rows;
}

const updateClientSQL = `
    UPDATE people SET   PEO_name = $2,
                        PEO_surname_1 = $3,
                        PEO_surname_2 = $4,
                        PEO_gender = $5,
                        PEO_birth_date = $6,
                        PEO_phone = $7,
                        PEO_observations = $8
    WHERE PEO_id = $1 RETURNING *;  
`;

const updateClient = async (PEO_id, PEO_name, PEO_surname_1, PEO_surname_2, PEO_gender, PEO_birth_date, PEO_phone, PEO_observations) => {
    try {    
        const result = await pool.query(updateClientSQL, [PEO_id, PEO_name, PEO_surname_1, PEO_surname_2, PEO_gender, PEO_birth_date, PEO_phone, PEO_observations]);
        //Comprovamos que se ha actualizado el cliente
        if(result.rowCount < 1) {
            return { ok: true, found: false };
        }
        return { ok:true, found: true, data: result.rows};
    }catch(e) {
        return { ok: false, data: e.toString() };
    }
}


const deleteClientSQL = `
DELETE FROM people WHERE PEO_id = $1 RETURNING *; 
`;

const deleteClient = async (PEO_id) => {
    try {
        const result = await pool.query(deleteClientSQL, [PEO_id]);
        //Comprobamos que se haya eliminado algun cliente
        if(result.rowCount < 1) {
           return { ok: true, found: false }; //No se ha eliminado ningun cliente
        }
        return { ok:true, found: true, data: result.rows}; //Se ha eliminado el cliente
       }catch(e) {
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


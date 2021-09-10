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
    SELECT * FROM people WHERE id = $1;
`;

const getOneClient = async(id) => {

    try {
        const result = await pool.query(getOneClientSQL, [id]);
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
    INSERT INTO people (name, surname_1, surname_2, gender, birth_date, phone, observations) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *;
`;

const newClient = async (name, surname_1, surname_2, gender, birth_date, phone, observations) => {
    const result = await pool.query(newClientSQL, [name, surname_1, surname_2, gender, birth_date, phone, observations]);
    return result.rows;
}

const updateClientSQL = `
    UPDATE people SET   name = $2,
                        surname_1 = $3,
                        surname_2 = $4,
                        gender = $5,
                        birth_date = $6,
                        phone = $7,
                        observations = $8
    WHERE id = $1 RETURNING *;  
`;

const updateClient = async (id, name, surname_1, surname_2, gender, birth_date, phone, observations) => {
    try {    
        const result = await pool.query(updateClientSQL, [id, name, surname_1, surname_2, gender, birth_date, phone, observations]);
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
DELETE FROM people WHERE id = $1 RETURNING *; 
`;

const deleteClient = async (id) => {
    try {
        const result = await pool.query(deleteClientSQL, [id]);
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


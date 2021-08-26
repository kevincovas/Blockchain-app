
const express = require("express");
const cors = require("cors");
const { Pool } = require('pg');


const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'admin',
    password: 'mysecretpassword',
    database: 'clientsite',
});

const app = express();

//Middlewares
app.use(express.json()); 
app.use(cors()); 

const getClientsSQL = `
    SELECT * FROM clients;
`

app.get('/login', async (req,res) =>{
    const result = await pool.query(getClientsSQL);
    const clients = result.rows;
    res.json(clients);
    //res.send('hola2');
});

app.listen(8080, () => {
    console.log("peluqueria_app server on port 8080");
});
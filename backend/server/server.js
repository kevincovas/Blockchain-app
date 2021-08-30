require('dotenv').config(); //Pone las variables del fichero .env en el entorno.

const express = require("express");
const cors = require("cors");
const db = require('./db');
const config = require('./config');

const app = express();

const okResult = (results) => ({ status: "OK", results});
const errorResult = (details) => ({ status: "Error", details});

//Middlewares
app.use(express.json());  //Convierte el body(JSON) en un objeto Javascript
app.use(cors()); 


app.get('/clients', async (req,res) =>{
    try{
        const clients = await db.getClients();
        res.json(okResult(clients));
    } catch (e){
        res.status(500).json(errorResult(e.toString()));
    } 
});

app.get('/clients/:client_name', async (req,res) => {
    try{
        const client = await db.getOneClient(req.params.client_name);
        res.json(okResult(client));
    } catch (e){
        res.status(500).json(errorResult(e.toString()));
    } 
});

app.post("/clients", async (req,res) => {
    const {client_name, client_surname, gender, birth_date, phone, cell_phone, details} = req.body;
    //Validamos que lo que envian esta bien
    if(!client_name){
        return res.status(400).json(errorResult("Missing 'name' field"));
    }
    try{
        const newClient = await db.newClient(client_name, client_surname, gender, birth_date, phone, cell_phone, details);
        res.json(okResult(newClient));
    }catch (e){
        res.status(500).json(errorResult(e.toString()));
    } 
});

app.put("/clients/:client_id" , async(req, res) => {
    const {client_id} = req.params;
    const {birth_date, phone, cell_phone, details} = req.body;
    try {
        const updateClient = await db.updateClient(client_id, birth_date, phone, cell_phone, details);
        res.json(okResult(updateClient));
    } catch(e) {
        res.status(500).json(errorResult(e.toString()));
    }    
});

app.delete("/clients/:client_id" , async(req, res) => {
    const {client_id} = req.params;
    try {
        const deleteClient = await db.deleteClient(client_id);
        res.json(okResult(deleteClient));
    }catch (e){
        res.status(500).json(errorResult(e.toString()));
    }
})


app.listen(config.SERVER_PORT, () => {
    console.log("peluqueria_app server on port 8080");
});
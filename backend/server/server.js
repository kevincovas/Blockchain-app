const express = require("express");
const cors = require("cors");
const db = require('./db');

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

app.post("/clients", async (req,res) => {
    const {name} = req.body;
    //Validamos que lo que envian esta bien
    if(!name){
        return res.status(400).json(errorResult("Missing'name' field"));
    }
    try{
        const newClient = await db.newClient(name);
        res.json(okResult(newClient));
    }catch (e){
        res.status(500).json(errorResult(e.toString()));
    } 
});

app.listen(8080, () => {
    console.log("peluqueria_app server on port 8080");
});
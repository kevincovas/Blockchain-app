const db = require ('./db/db_clients');
const { Router } = require('express');

const router = new Router();


const okResult = (results) => ({ status: "OK", results })
const errorResult = (details) => ({ status: "ERROR", details })

router.get('/', async (req,res) =>{
    try{
        const clients = await db.getClients();
        res.json(okResult(clients));
    } catch (e){
        res.status(500).json(errorResult(e.toString()));
    } 
});

router.get('/:client_name', async (req,res) => {
    try{
        const client = await db.getOneClient(req.params.client_name);
        res.json(okResult(client));
    } catch (e){
        res.status(500).json(errorResult(e.toString()));
    } 
});

router.post("/", async (req,res) => {
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

router.put("/:client_id" , async(req, res) => {
    const {client_id} = req.params;
    const {birth_date, phone, cell_phone, details} = req.body;
    try {
        const updateClient = await db.updateClient(client_id, birth_date, phone, cell_phone, details);
        res.json(okResult(updateClient));
    } catch(e) {
        res.status(500).json(errorResult(e.toString()));
    }    
});

router.delete("/:client_id" , async(req, res) => {
    const {client_id} = req.params;
    try {
        const deleteClient = await db.deleteClient(client_id);
        res.json(okResult(deleteClient));
    }catch (e){
        res.status(500).json(errorResult(e.toString()));
    }
})

module.exports = router;
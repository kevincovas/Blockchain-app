const db = require ('./db/db_clients');
const { Router } = require('express');

const router = new Router();

const okResult = (results) => ({ status: "OK", results })
const errorResult = (details) => ({ status: "ERROR", details })

//Get de todos los clientes
router.get('/', async (req,res) =>{
    const { ok, found, data } = await db.getClients();
    if(!ok){ //Si ha habido un error en el servidor
        return res.status(500).json(errorResult(data));
    } else if(!found){ //Si no se encuentran clientes
        return res
            .status(400)
            .json(errorResult(`Clients doesn't exist`));
    } else{ //Si hay clientes
        return res.json(okResult(data));
    } 
});

//Get de un solo cliente
router.get('/:PEO_id', async (req,res) => {
    
    const { ok, found, data } = await db.getOneClient(req.params.PEO_id);
    if(!ok){ //Si ha habido un error en el servidor
        return res.status(500).json(errorResult(data));
    } else if(!found){ //Si no se encuentra el cliente
        return res
            .status(400)
            .json(errorResult(`Client doesn't exist`));
    } else{ //Si existe el cliente
        return res.json(okResult(data));
    } 
        
});

//Post de un nuevo cliente
router.post("/", async (req,res) => {
    const {PEO_name, PEO_surname_1, PEO_surname_2, PEO_gender, PEO_birth_date, PEO_phone, PEO_observations} = req.body;
    //Validamos que lo que envian esta bien
    if(!PEO_name){
        return res.status(400).json(errorResult("Missing 'name' field"));
    }
    if(!PEO_surname_1){
        return res.status(400).json(errorResult("Missing '1st surname' field"));
    }
    if(!PEO_surname_2){
        return res.status(400).json(errorResult("Missing '2nd surname' field"));
    }
    if(!PEO_gender){
        return res.status(400).json(errorResult("Missing 'gender' field"));
    }
    if(!PEO_birth_date){
        return res.status(400).json(errorResult("Missing 'birth date' field"));
    }
    if(!PEO_phone){
        return res.status(400).json(errorResult("Missing 'phone' field"));
    }
    try{
        const newClient = await db.newClient(PEO_name, PEO_surname_1, PEO_surname_2, PEO_gender, PEO_birth_date, PEO_phone, PEO_observations);
        res.json(okResult(newClient));
    }catch (e){
        res.status(500).json(errorResult(e.toString()));
    } 
});

//Actualización de un cliente
router.put("/:PEO_id" , async(req, res) => {
    const {PEO_id} = req.params;
    const {PEO_name, PEO_surname_1, PEO_surname_2, PEO_gender, PEO_birth_date, PEO_phone, PEO_observations} = req.body;
    const { ok, found, data } = await db.updateClient(PEO_id, PEO_name, PEO_surname_1, PEO_surname_2, PEO_gender, PEO_birth_date, PEO_phone, PEO_observations);

    if(!ok){ //Si ha habido un error en el servidor
        return res.status(500).json(errorResult(data));
    } else if(!found){ //Si no encuentra el cliente a actualizar
        return res
            .status(400)
            .json(errorResult(`Client with ID ${PEO_id} not found`));
    } else{ //Si se ha actualizado el cliente
        return res.json(okResult(data));
    } 
       
});

//Delete de un cliente
router.delete("/:PEO_id" , async(req, res) => {
    const {PEO_id} = req.params;
    const { ok, found, data } = await db.deleteClient(PEO_id);

    if(!ok){ //Si ha habido un error en el servidor
        return res.status(500).json(errorResult(data));
    } else if(!found){ //Si no encuentra el cliente a liminar
        return res
            .status(400)
            .json(errorResult(`Client with ID ${PEO_id} not found`));
    } else{ //Si se ha eliminado el cliente
        return res.json(okResult(data));
    } 
})

module.exports = router;
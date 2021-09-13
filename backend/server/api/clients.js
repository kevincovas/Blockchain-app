const db = require ('../db/db_clients');
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
router.get('/:id', async (req,res) => {
    
    const { ok, found, data } = await db.getOneClient(req.params.id);
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
router.post("/registerClient", async (req,res) => {
    const {name, surname_1, surname_2, gender, birth_date, phone, observations} = req.body;
    //Validamos que lo que envian esta bien
    if(!name){
        return res.status(400).json(errorResult("Missing 'name' field"));
    }
    if(!surname_1){
        return res.status(400).json(errorResult("Missing '1st surname' field"));
    }
    if(!surname_2){
        return res.status(400).json(errorResult("Missing '2nd surname' field"));
    }
    if(!gender){
        return res.status(400).json(errorResult("Missing 'gender' field"));
    }
    if(!phone){
        return res.status(400).json(errorResult("Missing 'phone' field"));
    }
    try{
        const newClient = await db.newClient(name, surname_1, surname_2, gender, birth_date, phone, observations);
        res.json(okResult(newClient));
    }catch (e){
        res.status(500).json(errorResult(e.toString()));
    } 
});

//Actualización de un cliente
router.put("/:id" , async(req, res) => {
    const {id} = req.params;
    const {name, surname_1, surname_2, gender, birth_date, phone, observations} = req.body;
    const { ok, found, data } = await db.updateClient(id, name, surname_1, surname_2, gender, birth_date, phone, observations);

    if(!ok){ //Si ha habido un error en el servidor
        return res.status(500).json(errorResult(data));
    } else if(!found){ //Si no encuentra el cliente a actualizar
        return res
            .status(400)
            .json(errorResult(`Client with ID ${id} not found`));
    } else{ //Si se ha actualizado el cliente
        return res.json(okResult(data));
    } 
       
});

//Delete de un cliente
router.delete("/:id" , async(req, res) => {
    const {id} = req.params;
    const { ok, found, data } = await db.deleteClient(id);

    if(!ok){ //Si ha habido un error en el servidor
        return res.status(500).json(errorResult(data));
    } else if(!found){ //Si no encuentra el cliente a eliminar
        return res
            .status(400)
            .json(errorResult(`Client with ID ${id} not found`));
    } else{ //Si se ha eliminado el cliente
        return res.json(okResult(data));
    } 
})

module.exports = router;
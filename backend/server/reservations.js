const db = require ('./db/db_reservations');
const { Router } = require('express');

const router = new Router();

const okResult = (results) => ({ status: "OK", results })
const errorResult = (details) => ({ status: "ERROR", details })

// Get All Hairdressers
router.get('/hairdressers', async (req,res) =>{
    const { ok, found, data } = await db.getHairdressers();
    if(!ok){ //Si ha habido un error en el servidor
        return res.status(500).json(errorResult(data));
    } else if(!found){ // If not hairdressers found
        return res
            .status(400)
            .json(errorResult(`Hairdressers doesn't exist`));
    } else{ //Si hay usuarios
        return res.json(okResult(data));
    } 
});

// Get Services List
router.get('/services', async (req,res) =>{
    const { ok, found, data } = await db.getServices();
    if(!ok){ //Si ha habido un error en el servidor
        return res.status(500).json(errorResult(data));
    } else if(!found){ // If not services found
        return res
            .status(400)
            .json(errorResult(`Services doesn't exist`));
    } else{ //Si hay usuarios
        return res.json(okResult(data));
    } 
});

module.exports = router;
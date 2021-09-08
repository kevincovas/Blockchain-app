const db = require ('./db/db_reservations');
const { Router } = require('express');

const router = new Router();

const okResult = (results) => ({ status: "OK", results })
const errorResult = (details) => ({ status: "ERROR", details })

//Obtenemos todos los usuarios
router.get('/hairdressers', async (req,res) =>{
    const { ok, found, data } = await db.getHairdressers();
    if(!ok){ //Si ha habido un error en el servidor
        return res.status(500).json(errorResult(data));
    } else if(!found){ //Si no se encuentran usuarios
        return res
            .status(400)
            .json(errorResult(`Hairdressers doesn't exist`));
    } else{ //Si hay usuarios
        return res.json(okResult(data));
    } 
});

module.exports = router;
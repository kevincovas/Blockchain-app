const db = require ('./db/db_users');
const { Router } = require('express');
const auth = require("./auth/auth.service");

const router = new Router();

const okResult = (results) => ({ status: "OK", results })
const errorResult = (details) => ({ status: "ERROR", details })

//Obtenemos todos los usuarios
router.get('/', async (req,res) =>{
    const { ok, found, data } = await db.getUsers();
    if(!ok){ //Si ha habido un error en el servidor
        return res.status(500).json(errorResult(data));
    } else if(!found){ //Si no se encuentran usuarios
        return res
            .status(400)
            .json(errorResult(`Clients doesn't exist`));
    } else{ //Si hay usuarios
        return res.json(okResult(data));
    } 
});

//Obtenemos un solo usuario
router.get('/:USE_id', async (req,res) => {
    const { ok, found, data } = await db.getOneUser(req.params.USE_id);
    if(!ok){ //Si ha habido un error en el servidor
        return res.status(500).json(errorResult(data));
    } else if(!found){ //Si no se encuentra el usuario
        return res
            .status(400)
            .json(errorResult(`User doesn't exist`));
    } else{ //Si existe el usuario
        return res.json(okResult(data));
    } 
});

//Creamos un nuevo usuario
router.post("/", async (req,res) => {
    const {USE_email, USE_password} = req.body;
    if(!USE_email){
        return res.status(400).json(errorResult("Missing 'email' field"));
    }
    if(!USE_password){
        return res.status(400).json(errorResult("Missing 'password' field"));
    }
    try{
        const hashedPassword = await auth.hashPassword(USE_password);
        console.log(`Hashed password: ${hashedPassword}`);
        const newUser = await db.newUser(USE_email,hashedPassword);
        res.json(okResult(newUser));
    }catch (e){
        res.status(500).json(errorResult(e.toString()));
    } 
});

/*Post para hacer el LOGIN */
router.post("/login", async (req, res) => {
    const { USE_email, USE_password } = req.body;
    
    const {ok, found, USE_password_DB} = await db.getUserByEmail(USE_email);   
    console.log(`USE_password_DB: ${USE_password_DB}`);
    if(!USE_email){
        return res.status(400).json(errorResult("Missing 'email' field"));
    }
    if(!USE_password){
        return res.status(400).json(errorResult("Missing 'password' field"));
    }
    if(!ok){ //Si ha habido un error en el servidor
        return res.status(500).json(errorResult(data));
    } else if(!found){ //Si no se encuentra el usuario
        return res
            .status(400)
            .json(errorResult(`User doesn't exist`));
    } else{ //Si existe el usuario
        const passwordMatches = await auth.comparePasswords(USE_password, USE_password_DB);
        const token = auth.createToken(USE_email);
        res.status(201).send(token);
        if (!passwordMatches) {
            return res.status(400).json(errorResult(`Wrong email/password combination`));
        }
        return res.json(okResult(data));       
    }    
});


//Actualizamos un usuario
router.put("/:USE_id" , async(req, res) => {
    const {USE_id} = req.params;
    const {USE_email, USE_password} = req.body;
    const { ok, found, data } = await db.updateUser(USE_id, USE_email, USE_password);

    if(!ok){ //Si ha habido un error en el servidor
        return res.status(500).json(errorResult(data));
    } else if(!found){ //Si no encuentra el usuario a actualizar
        return res
            .status(400)
            .json(errorResult(`User with ID ${USE_id} not found`));
    } else{ //Si se ha actualizado el usuario
        return res.json(okResult(data));
    }   
});

//Eliminamos un usuario
router.delete("/:USE_id" , async(req, res) => {
    const {USE_id} = req.params;
    const { ok, found, data } = await db.deleteUser(USE_id);

    if(!ok){ //Si ha habido un error en el servidor
        return res.status(500).json(errorResult(data));
    } else if(!found){ //Si no encuentra el usuario a eliminar
        return res
            .status(400)
            .json(errorResult(`User with ID ${USE_id} not found`));
    } else{ //Si se ha eliminado el usuario
        return res.json(okResult(data));
    } 
})


module.exports = router;
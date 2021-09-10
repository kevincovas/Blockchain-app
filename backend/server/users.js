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

/*Post para hacer el LOGIN */
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if(!email){
        return res.status(400).json(errorResult("Missing 'email' field"));
    }
    if(!password){
        return res.status(400).json(errorResult("Missing 'password' field"));
    }
    const {ok, found, data} = await db.getUserByEmail(email);
    //return res.json(okResult(data));
    if(!ok){ //Si ha habido un error en el servidor
        return res.status(500).json(errorResult(data));
    } else if(!found){ //Si no se encuentran usuarios
        return res
            .status(400)
            .json(errorResult(`User doesn't exist`));
    } else{ //Si hay usuarios
        const password_db = data.password;
        console.log(`password_db ${password_db}`);
        console.log(`password ${password}`);
        const passwordMatches = await auth.comparePasswords(password, password_db);
        console.log(`passwordMatches ${passwordMatches}`);
    
        if (!passwordMatches) {
            return res.status(400).json(errorResult(`Wrong email/password combination`));
        }

        const token = auth.createToken(email);
        res.status(201).send(token);
        
        //return res.json(okResult(data));
    } 
});

//Obtenemos un solo usuario
router.get('/:id', async (req,res) => {
    const { ok, found, data } = await db.getOneUser(req.params.id);
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
    const {email, password} = req.body;
    if(!email){
        return res.status(400).json(errorResult("Missing 'email' field"));
    }
    if(!password){
        return res.status(400).json(errorResult("Missing 'password' field"));
    }
    try{
        const hashedPassword = await auth.hashPassword(password);
        console.log(`Hashed password: ${hashedPassword}`);
        const newUser = await db.newUser(email,hashedPassword);
        res.json(okResult(newUser));
    }catch (e){
        res.status(500).json(errorResult(e.toString()));
    } 
});

//Actualizamos un usuario
router.put("/:id" , async(req, res) => {
    const {id} = req.params;
    const {email, password} = req.body;
    const { ok, found, data } = await db.updateUser(id, email, password);

    if(!ok){ //Si ha habido un error en el servidor
        return res.status(500).json(errorResult(data));
    } else if(!found){ //Si no encuentra el usuario a actualizar
        return res
            .status(400)
            .json(errorResult(`User with ID ${id} not found`));
    } else{ //Si se ha actualizado el usuario
        return res.json(okResult(data));
    }   
});

//Eliminamos un usuario
router.delete("/:id" , async(req, res) => {
    const {id} = req.params;
    const { ok, found, data } = await db.deleteUser(id);

    if(!ok){ //Si ha habido un error en el servidor
        return res.status(500).json(errorResult(data));
    } else if(!found){ //Si no encuentra el usuario a eliminar
        return res
            .status(400)
            .json(errorResult(`User with ID ${id} not found`));
    } else{ //Si se ha eliminado el usuario
        return res.json(okResult(data));
    } 
})


module.exports = router;
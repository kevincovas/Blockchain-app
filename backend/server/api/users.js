const db = require ('../db/db_users');
const { Router } = require('express');
const auth = require("../auth/auth.service");

const router = new Router();

const okResult = (results) => ({ status: "OK", results })
const errorResult = (details) => ({ status: "ERROR", details })

const CLIENT_ROLE_NAME = "customer"

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
        const roles_result = await db.getUserRolesById(data.id);

        if(!roles_result.ok){
            return res.status(500).json(errorResult(roles_result.data));
        } else if (!roles_result.found){
            return res
                .status(400)
                .json(errorResult(`Error al iniciar sesión. Por favor, contacte con nosotros para solucionarlo.`));
        } else {
            const token = auth.createToken(data, roles_result.data);
            res.status(201).send(token);
        }
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

//
router.post("/exist", async (req,res) => {
    const {email} = req.body;
    try{
        const userExist = await db.checkIfUserExistsByEmail(email);
        res.json(okResult(userExist));
    }catch (e){
        res.status(500).json(errorResult(e.toString()));
    } 
});

//Creamos un nuevo usuario
router.post("/register", async (req,res) => {
    const {email, password} = req.body;
    if(!email){
        return res.status(400).json(errorResult("Missing 'email' field"));
    }
    if(!password){
        return res.status(400).json(errorResult("Missing 'password' field"));
    }
    const userExists = await db.checkIfUserExistsByEmail(email);
    if(!userExists.ok){
        return res.status(500).json(errorResult(data));
    } else if(userExists.data.exists) {
        return res.status(400).json(errorResult("Ya existe un usuario asociado a este correo."));
    }
    try{
        const hashedPassword = await auth.hashPassword(password);
        console.log(`Hashed password: ${hashedPassword}`);
        const addUserResult = await db.newUser(email,hashedPassword);
        if(!addUserResult.ok){
            return res.status(400).json(errorResult(data));
        }
        const addUserRoleResult = await db.addUserRole(addUserResult.data.id, CLIENT_ROLE_NAME);
        if(!addUserRoleResult.ok){
            return res.status(400).json(errorResult(addUserRoleResult.data));
        }
        res.json(okResult(addUserResult.data));
    } catch (e){
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
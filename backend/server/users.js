const db = require ('./db/db_users');
const { Router } = require('express');

const router = new Router();

const okResult = (results) => ({ status: "OK", results })
const errorResult = (details) => ({ status: "ERROR", details })

router.get('/', async (req,res) =>{
    try{
        const users = await db.getUsers();
        res.json(okResult(users));
    } catch (e){
        res.status(500).json(errorResult(e.toString()));
    } 
});

router.get('/:user_id', async (req,res) => {
    try{
        const user = await db.getOneUser(req.params.user_id);
        res.json(okResult(user));
    } catch (e){
        res.status(500).json(errorResult(e.toString()));
    } 
});

router.post("/", async (req,res) => {
    const {email, user_password} = req.body;
    if(!email){
        return res.status(400).json(errorResult("Missing 'email' field"));
    }
    if(!user_password){
        return res.status(400).json(errorResult("Missing 'user_password' field"));
    }
    try{
        const newUser = await db.newUser(email, user_password);
        res.json(okResult(newUser));
    }catch (e){
        res.status(500).json(errorResult(e.toString()));
    } 
});

router.put("/:user_id" , async(req, res) => {
    const {user_id} = req.params;
    const {email, user_password} = req.body;
    try {
        const updateUser = await db.updateUser(user_id, email, user_password);
        res.json(okResult(updateUser));
    } catch(e) {
        res.status(500).json(errorResult(e.toString()));
    }    
});

router.delete("/:user_id" , async(req, res) => {
    const {user_id} = req.params;
    try {
        const deleteUser = await db.deleteUser(user_id);
        res.json(okResult(deleteUser));
    }catch (e){
        res.status(500).json(errorResult(e.toString()));
    }
})

module.exports = router;
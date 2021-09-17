const db = require("../db/db_clients");
const { Router } = require("express");

const {CLIENT_ROLE_NAME} = require("../common/config");

const { isHairdresser, authenticated } = require("../auth/auth.middlewares");

const router = new Router();

const okResult = (results) => ({ status: "OK", results });
const errorResult = (details) => ({ status: "ERROR", details });

//Get de todos los clientes
router.get("/", async (req, res) => {
  const { ok, found, data } = await db.getClients();
  if (!ok) {
    //Si ha habido un error en el servidor
    return res.status(500).json(errorResult(data));
  } else if (!found) {
    //Si no se encuentran clientes
    return res.status(400).json(errorResult(`Clients doesn't exist`));
  } else {
    //Si hay clientes
    return res.json(okResult(data));
  }
});

//Get de un solo cliente
router.get("/:id/", async (req, res) => {
  const { ok, found, data } = await db.getOneClient(req.params.id);
  if (!ok) {
    //Si ha habido un error en el servidor
    return res.status(500).json(errorResult(data));
  } else if (!found) {
    //Si no se encuentra el cliente
    return res.status(400).json(errorResult(`Client doesn't exist`));
  } else {
    //Si existe el cliente
    return res.json(okResult(data));
  }
});

router.post("/get-person-by-user-id/", async (req, res) => {
  const { ok, found, data } = await db.getPersonByUserId(req.body.id);
  if (!ok) {
    //Si ha habido un error en el servidor
    return res.status(500).json(errorResult(data));
  } else if (!found) {
    //Si no se encuentra el cliente
    return res.status(400).json(errorResult(`Person doesn't exist`));
  } else {
    //Si existe el cliente
    return res.json(okResult(data));
  }
});

//Post de un nuevo cliente
router.post("/register/", async (req, res) => {
  const { name, surname_1, surname_2, gender, birth_date, phone, user_id } =
    req.body;
  //Validamos que lo que envian esta bien
  if (!name) {
    return res.status(400).json(errorResult("Missing 'name' field"));
  }
  if (!surname_1) {
    return res.status(400).json(errorResult("Missing '1st surname' field"));
  }
  if (!gender) {
    return res.status(400).json(errorResult("Missing 'gender' field"));
  }
  if (!user_id) {
    return res.status(400).json(errorResult("Missing 'user_id' field"));
  }
  console.log(user_id);
  const personAlreadyExists = await db.checkIfPersonExistsByUserId(user_id);
  console.log(personAlreadyExists);
  if (!personAlreadyExists.ok) {
    return res.status(500).json(errorResult(`Error interno del servidor: ${personAlreadyExists.data}`));
  } else if (personAlreadyExists.data.exists){
    return res.status(400).json(errorResult("Error creando cliente, ya existe un cliente para este usuario."));
  }
  try {
    const newClient = await db.newClient(
      name,
      surname_1,
      surname_2,
      gender,
      birth_date,
      phone,
      user_id,
      CLIENT_ROLE_NAME
    );
    return res.json(okResult(newClient));
  } catch (e) {
    return res.status(500).json(errorResult(e.toString()));
  }
});

//Actualización de un cliente
router.put("/:id/", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    surname_1,
    surname_2,
    gender,
    birth_date,
    phone,
    observations,
  } = req.body;
  const { ok, found, data } = await db.updateClient(
    id,
    name,
    surname_1,
    surname_2,
    gender,
    birth_date,
    phone,
    observations
  );

  if (!ok) {
    //Si ha habido un error en el servidor
    return res.status(500).json(errorResult(data));
  } else if (!found) {
    //Si no encuentra el cliente a actualizar
    return res.status(400).json(errorResult(`Client with ID ${id} not found`));
  } else {
    //Si se ha actualizado el cliente
    return res.json(okResult(data));
  }
});

//Delete de un cliente
router.delete("/:id/", async (req, res) => {
  const { id } = req.params;
  const { ok, found, data } = await db.deleteClient(id);

  if (!ok) {
    //Si ha habido un error en el servidor
    return res.status(500).json(errorResult(data));
  } else if (!found) {
    //Si no encuentra el cliente a eliminar
    return res.status(400).json(errorResult(`Client with ID ${id} not found`));
  } else {
    //Si se ha eliminado el cliente
    return res.json(okResult(data));
  }
});

router.post(
  "/get-people-by-role/",
  authenticated,
  isHairdresser,
  async (req, res) => {
    const role = req.body;
    const { error, error_message, data } = await db.getPeopleByRoleName(role);
    if (error) {
      return res.status(500).json(errorResult(error_message));
    } else {
      return res.json(okResult(data));
    }
  }
);

router.post(
  "/get-people-by-role-extended/",
  authenticated,
  isHairdresser,
  async (req, res) => {
    const role = req.body;
    const { error, error_message, data } = await db.getPeopleByRoleNameExtended(
      role
    );
    if (error) {
      return res.status(500).json(errorResult(error_message));
    } else {
      return res.json(okResult(data));
    }
  }
);

module.exports = router;

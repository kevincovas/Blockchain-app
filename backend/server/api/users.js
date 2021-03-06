const db_users = require("../db/db_users");
const db_clients = require("../db/db_clients");
const { Router } = require("express");
const auth = require("../auth/auth.service");
const {
  sendEmail,
  from_mail,
  from_name,
  text_part,
  custom_id,
} = require("../utils/mail");
const { authenticated } = require("../auth/auth.middlewares");
/*const {
  from_mail,
  from_name,
  to_mail,
  to_name,
  text_part,
  custom_id,
} = require("../common/sentEmail");*/

const router = new Router();
// Mail API
//const mailjet = require("../utils/mail");

const okResult = (results) => ({ status: "OK", results });
const errorResult = (details) => ({ status: "ERROR", details });

//Obtenemos todos los usuarios
router.get("/", async (req, res) => {
  const { ok, found, data } = await db_users.getUsers();
  if (!ok) {
    //Si ha habido un error en el servidor
    return res.status(500).json(errorResult(data));
  } else if (!found) {
    //Si no se encuentran usuarios
    return res.status(400).json(errorResult(`Clients doesn't exist`));
  } else {
    //Si hay usuarios
    return res.json(okResult(data));
  }
});

/*Post para hacer el LOGIN */
router.post("/login/", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json(errorResult("Missing 'email' field"));
  }
  if (!password) {
    return res.status(400).json(errorResult("Missing 'password' field"));
  }

  //Check if a user with this email exists
  const { ok, found, data } = await db_users.getUserByEmail(email);
  if (!ok) {
    //If there was a server error during the query to the DB
    return res.status(500).json(errorResult(data));
  } else if (!found) {
    //If there is NO user with this email
    return res.status(400).json(errorResult(`User doesn't exist`));
  } else {
    //If there is a user with this email, now check if passwords matches
    const password_db = data.password;
    const passwordMatches = await auth.comparePasswords(password, password_db);

    //If passwords do not match, an error is sent.
    if (!passwordMatches) {
      return res
        .status(400)
        .json(errorResult(`Wrong email/password combination`));
    }

    //If passwords do match, try to get the person profile associated to this user.
    const person_result = await db_clients.getPersonByUserId(data.id);
    if (!person_result.ok) {
      //If there was a an error in the server while querying the DB
      return res.status(500).json(errorResult(person_result.data));
    } else if (!person_result.found) {
      // If the profile is not found
      return res
        .status(400)
        .json(
          errorResult(
            `Error al iniciar sesi??n. Cliente no encontrado. Por favor, contacte con nosotros para solucionarlo.`
          )
        );
    }
    const token = auth.createToken(data, person_result.data);
    res.status(201).send(token);
  }
});

//Obtenemos un solo usuario
router.get("/:id/", async (req, res) => {
  const { ok, found, data } = await db_users.getOneUser(req.params.id);
  if (!ok) {
    //Si ha habido un error en el servidor
    return res.status(500).json(errorResult(data));
  } else if (!found) {
    //Si no se encuentra el usuario
    return res.status(400).json(errorResult(`User doesn't exist`));
  } else {
    //Si existe el usuario
    return res.json(okResult(data));
  }
});

//Cambiar contrase??a
router.post("/changePassword/", authenticated, async (req, res) => {
  const email = req.user.email;
  const { password, newPassword, confirmNewPassword } = req.body;

  if (!password) {
    return res.status(400).json(errorResult("Missing 'password' field"));
  }
  if (!newPassword) {
    return res.status(400).json(errorResult("Missing 'newPassword' field"));
  }
  if (!confirmNewPassword) {
    return res
      .status(400)
      .json(errorResult("Missing 'confirmNewPassword' field"));
  }

  const { ok, found, data } = await db_users.getUserByEmail(email);
  const password_db = data.password;
  const passwordMatches = await auth.comparePasswords(password, password_db);

  //If passwords do not match, an error is sent.
  if (!passwordMatches) {
    return res
      .status(400)
      .json(errorResult(`Wrong email/password combination`));
  }
  if (newPassword == confirmNewPassword) {
    //Hasheamos el nuevo password
    const hashedPassword = await auth.hashPassword(newPassword);
    //Actualizamos contrase??a
    const updatedPassword = await db_users.updatePassword(
      email,
      hashedPassword
    );
    res.json(okResult(updatedPassword));
  } else {
    res.json(errorResult(`New passwords don't match`));
  }
});

//Generar nueva contrase??a
router.post("/rememberPassword/", async (req, res) => {
  const { email } = req.body;
  try {
    const userExist = await db_users.checkIfUserExistsByEmail(email);
    if (userExist.data.exists) {
      //Generamos un password aleatorio
      const randPassword = auth.generatePasswordRand(8);
      //Hasheamos el nuevo password
      const hashedPassword = await auth.hashPassword(randPassword);
      //Actualizamos contrase??a
      await db_users.updatePassword(email, hashedPassword);

      //Env??o de contrase??a
      let to_mail = email;
      let to_name = "Kevin";
      let subject = "Nueva contrase??a generada";

      //HTML de correo de Cambio de Contrase??a
      let html_cambioContrase??a = `
        <br />Como solicitaste, a continuaci??n le mostramos su nueva contrase??a:
        <br> Contrase??a: ${randPassword}
        <br> Si quieres cambiarla, inicia sesi??n y seguidamente en Mi perfil-Cambiar contrase??a 
      `;
      //Mandamos el correo con la nueva password
      await sendEmail(
        from_mail,
        from_name,
        to_mail,
        to_name,
        subject,
        text_part,
        html_cambioContrase??a,
        custom_id
      );
      res.json(okResult(userExist));
    } else {
      res.json(errorResult("Usuario no existe"));
    }
  } catch (e) {
    res.status(500).json(errorResult(e.toString()));
  }
});
//Comprobamos si el correo existe
router.post("/exist/", async (req, res) => {
  const { email } = req.body;
  try {
    const userExist = await db_users.checkIfUserExistsByEmail(email);
    res.json(okResult(userExist));
  } catch (e) {
    res.status(500).json(errorResult(e.toString()));
  }
});

//Creamos un nuevo usuario
router.post("/register/", async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json(errorResult("Missing 'email' field"));
  }
  if (!password) {
    return res.status(400).json(errorResult("Missing 'password' field"));
  }
  const userExists = await db_users.checkIfUserExistsByEmail(email);
  if (!userExists.ok) {
    return res.status(500).json(errorResult(data));
  } else if (userExists.data.exists) {
    return res
      .status(400)
      .json(errorResult("Ya existe un usuario asociado a este correo."));
  }
  try {
    const hashedPassword = await auth.hashPassword(password);
    const addUserResult = await db_users.newUser(email, hashedPassword);
    if (!addUserResult.ok) {
      return res.status(400).json(errorResult(data));
    }

    //Env??o de correo de bienvenida
    let to_mail = email;
    let to_name = "Kevin";
    let subject = "Bienvenido a Arkus Peluquer??a";

    //HTML de correo de Usuario Creado
    let html_usuarioCreado = `
        <br />Bienvenido a Peluquer??a Arkus,
        <br />Su usuario para hacer login es: ${email}
        `;

    //Mandamos el correo de usuario creado
    await sendEmail(
      from_mail,
      from_name,
      to_mail,
      to_name,
      subject,
      text_part,
      html_usuarioCreado,
      custom_id
    );
    res.json(okResult(addUserResult.data));
  } catch (e) {
    res.status(500).json(errorResult(e.toString()));
  }
});

//Actualizamos un usuario
router.put("/:id/", async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  const { ok, found, data } = await db_users.updateUser(id, email, password);

  if (!ok) {
    //Si ha habido un error en el servidor
    return res.status(500).json(errorResult(data));
  } else if (!found) {
    //Si no encuentra el usuario a actualizar
    return res.status(400).json(errorResult(`User with ID ${id} not found`));
  } else {
    //Si se ha actualizado el usuario
    return res.json(okResult(data));
  }
});

//Eliminamos un usuario
router.delete("/:id/", async (req, res) => {
  const { id } = req.params;
  const { ok, found, data } = await db_users.deleteUser(id);

  if (!ok) {
    //Si ha habido un error en el servidor
    return res.status(500).json(errorResult(data));
  } else if (!found) {
    //Si no encuentra el usuario a eliminar
    return res.status(400).json(errorResult(`User with ID ${id} not found`));
  } else {
    //Si se ha eliminado el usuario
    return res.json(okResult(data));
  }
});

module.exports = router;

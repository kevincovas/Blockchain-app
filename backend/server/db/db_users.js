const { pool } = require("./db");

const getUsersSQL = `
  SELECT * FROM users;
`;

const getUsers = async () => {
  try {
    const result = await pool.query(getUsersSQL);
    //Comprobamos que haya usuarios
    if (result.rowCount < 1) {
      return { ok: true, found: false }; //No se han encontrado usuarios
    }
    return { ok: true, found: true, data: result.rows }; //Se han encontrado usuarios
  } catch (e) {
    return { ok: false, data: e.toString() };
  }
};

const getOneUserSQL = `
  SELECT * FROM users WHERE id = $1;
`;

const getOneUser = async (id) => {
  try {
    const result = await pool.query(getOneUserSQL, [id]);
    //Comprobamos que el cliente exista
    if (result.rowCount < 1) {
      return { ok: true, found: false }; //No se ha encontrado el usuario
    }
    return { ok: true, found: true, data: result.rows }; //Se ha encontrado el usuario
  } catch (e) {
    return { ok: false, data: e.toString() };
  }
};

const getUserByEmailSQL = `
  SELECT id, email, password FROM users WHERE email = $1;
`;

const getUserByEmail = async (email) => {
  try {
    console.log(`email_DB_users ${email}`);
    const result = await pool.query(getUserByEmailSQL, [email]);

    //Comprobamos que el cliente exista
    if (result.rowCount < 1) {
      return { ok: true, found: false }; //No se ha encontrado el usuario
    }
    return { ok: true, found: true, data: result.rows[0] }; //Se ha encontrado el usuario
  } catch (e) {
    return { ok: false, data: e.toString() };
  }
};

const checkIfUserExistsByEmailSQL = `
  SELECT EXISTS(SELECT * FROM users WHERE email=$1);
`;

const checkIfUserExistsByEmail = async (email) => {
  try {
    const result = await pool.query(checkIfUserExistsByEmailSQL, [email]);
    return { ok: true, data: result.rows[0] };
  } catch (e) {
    return { ok: false, data: e.toString() };
  }
};

const newUserSQL = `
  INSERT INTO users (email, password) VALUES ($1,$2) RETURNING email, password, id;
`;

const newUser = async (email, hashedPassword) => {
  try{
    const result = await pool.query(newUserSQL, [email, hashedPassword]);
    return { ok: true, found: true, data: result.rows[0] };
  } catch (e){
    return { ok: false, data: e.toString() };
  }
};

const updateUserSQL = `
  UPDATE users SET  email = $2,
                    password = $3
  WHERE id = $1 RETURNING *;  
`;

const updateUser = async (id, email, password) => {
  try {
    const result = await pool.query(updateUserSQL, [id, email, password]);
    if (result.rowCount < 1) {
      return { ok: true, found: false };
    }
    return { ok: true, found: true, data: result.rows };
  } catch (e) {
    return { ok: false, data: e.toString() };
  }
};

const deleteUserSQL = `
  DELETE FROM users WHERE id = $1 RETURNING *; 
`;

const deleteUser = async (id) => {
  try {
    const result = await pool.query(deleteUserSQL, [id]);
    //Comprobamos que se haya eliminado algun usuario
    if (result.rowCount < 1) {
      return { ok: true, found: false }; //No se ha eliminado ningun usuario
    }
    return { ok: true, found: true, data: result.rows }; //Se ha eliminado el usuario
  } catch (e) {
    return { ok: false, data: e.toString() };
  }
};



module.exports = {
  getUsers,
  getOneUser,
  newUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  checkIfUserExistsByEmail,
};

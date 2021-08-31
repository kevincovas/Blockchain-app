require('dotenv').config(); //Pone las variables del fichero .env en el entorno.

const express = require("express");
const cors = require("cors");
const config = require('./config');

const app = express();

app.use(express.json());  //Convierte el body(JSON) en un objeto Javascript
app.use(cors()); 

app.use("/clients", require('./clients'));
app.use("/users", require('./users'));

app.listen(config.SERVER_PORT, () => {
    console.log(`peluqueria_app server on port ${config.SERVER_PORT}`);
});
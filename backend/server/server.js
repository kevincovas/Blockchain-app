//Pone las variables del fichero .env en el entorno.
require('dotenv').config();

const db = require("../server/db/db");
const express = require("express");
const cors = require("cors");
const config = require('./config');
const morgan = require("morgan");
const helmet = require("helmet");
const {errorHandler, ApiError} = require("./common/errors");

const app = express();

//Middlewares
app.use(helmet());
app.use(express.json());  //Convierte el body(JSON) en un objeto Javascript
app.use(cors());
app.use(morgan('dev'));

//Servimos el fichero index.html en la raiz
app.use(express.static('../../frontend/dist')); 

app.use("/clients", require('./clients'));
app.use("/reservations", require('./reservations'));
app.use("/users", require('./users'));
app.use("/", require('./users'));
app.use("/login", require('./users'));
app.use("/sales", require('./sales'));

//Provocamos un error para cazarlo
app.get('/error', async (req,res,next) => {
    next(new ApiError(503, 'Error provocado'));
})
app.use(errorHandler);

const startServer = async () => {
    db.pool;
    app.listen(config.SERVER_PORT, () => {
        console.log(`peluqueria_app server on port ${config.SERVER_PORT}`);
    });
  }
  
  startServer();

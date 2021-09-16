//Funcion que comprueba que la variable de entorno exista
const checkEnvVar = (name) => {
    if (name in process.env){
        return process.env[name];
    }
    throw new Error("Missing environment variable");
}

const METHODS_OF_PAYMENT = [
    {
        id: 0,
        name: "Efectivo"
    }, 
    {
        id: 1, 
        name: "Tarjeta"
    }
];

const ROLES = [
    'admin', 
    'hairdresser', 
    'customer'
]

const CLIENT_ROLE_NAME = "customer";
const HAIRDRESSER_ROLE_NAME = "hairdresser";
const ADMIN_ROLE_NAME = "admin";

module.exports = {
    JWT_SECRET: 'myjwtsecret',
    JWT_EXPIRATION_TIME: '2h',
    DB_HOST: checkEnvVar('DB_HOST'),
    DB_PORT: checkEnvVar('DB_PORT'),
    DB_USER: checkEnvVar('POSTGRES_USER'),
    DB_PASSWORD: checkEnvVar('POSTGRES_PASSWORD'),
    DB_DATABASE: checkEnvVar('POSTGRES_DB'),
    SERVER_PORT: checkEnvVar('SERVER_PORT'),
    METHODS_OF_PAYMENT, 
    ROLES,
    CLIENT_ROLE_NAME, 
    ADMIN_ROLE_NAME,
    HAIRDRESSER_ROLE_NAME
};
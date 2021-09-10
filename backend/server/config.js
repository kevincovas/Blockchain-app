
//Funcion que comprueba que la variable de entorno exista
const checkEnvVar = (name) => {
    if (name in process.env){
        return process.env[name];
    }
    throw new Error("Missing environment variable");
}
module.exports = {
    JWT_SECRET: 'myjwtsecret',
    JWT_EXPIRATION_TIME: '2h',
    DB_HOST: checkEnvVar('DB_HOST'),
    DB_PORT: checkEnvVar('DB_PORT'),
    DB_USER: checkEnvVar('POSTGRES_USER'),
    DB_PASSWORD: checkEnvVar('POSTGRES_PASSWORD'),
    DB_DATABASE: checkEnvVar('POSTGRES_DB'),
    SERVER_PORT: checkEnvVar('SERVER_PORT'),

};
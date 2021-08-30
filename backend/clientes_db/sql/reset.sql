
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS clients;

CREATE TABLE clients (
    client_id SERIAL PRIMARY KEY,
    client_name VARCHAR(25),
    client_surname VARCHAR(25),
    birth_date DATE,
    gender VARCHAR(1),
    phone NUMERIC,
    cell_phone NUMERIC,
    details TEXT,
    created TIMESTAMP DEFAULT NOW(),
    updated TIMESTAMP
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(25),
    user_password VARCHAR(12),
    created TIMESTAMP DEFAULT NOW(),
    updated TIMESTAMP
);

CREATE TABLE clientUser (
    clientUserId SERIAL PRIMARY KEY,
    clientId INTEGER REFERENCES clients (client_id)
)
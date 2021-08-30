
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS clients;

CREATE TABLE clients (
    client_id SERIAL PRIMARY KEY,
    client_name VARCHAR(25),
    client_surname VARCHAR(25),
    birth_date DATE,
    gender VARCHAR(1),
    email VARCHAR(50),
    phone NUMERIC,
    cell_phone NUMERIC,
    details TEXT,
    created TIMESTAMP DEFAULT NOW(),
    updated TIMESTAMP
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(client_id),
    email VARCHAR(25),
    user_password VARCHAR(12),
    rol VARCHAR(25),
    hasLogedIn BOOLEAN,
    created TIMESTAMP DEFAULT NOW(),
    updated TIMESTAMP
);


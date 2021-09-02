#!/bin/sh
docker-compose up --build -d 
docker exec -it ${DB_CONTAINER_NAME} psql -U ${POSTGRES_USER} ${POSTGRES_DB} -f /docker-entrypoint-initdb.d/setup_db.sql
docker exec -it ${DB_CONTAINER_NAME} psql -U ${POSTGRES_USER} ${POSTGRES_DB} -f /docker-entrypoint-initdb.d/dummy_data_db.sql

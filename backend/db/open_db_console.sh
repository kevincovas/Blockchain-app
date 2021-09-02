#!/bin/sh
docker exec -it ${DB_CONTAINER_NAME} psql -U ${POSTGRES_USER} ${POSTGRES_DB}
echo off
cls
docker-compose up --build -d 
timeout 5
docker exec -it backend_db psql -U admin peluqueria -f /docker-entrypoint-initdb.d/setup_db.sql
docker exec -it backend_db psql -U admin peluqueria -f /docker-entrypoint-initdb.d/init_data_db.sql
echo Hecho con éxito ! 
pause
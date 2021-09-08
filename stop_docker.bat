echo off
cls
docker-compose down
docker rm -f $(docker ps -a -q)
docker volume rm $(docker volume ls -q)
echo Docker cerrado !
pause
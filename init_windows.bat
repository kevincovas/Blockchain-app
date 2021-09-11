echo off
cls
cd %~dp0
cd backend
cd server
start npm start
cd ..
cd ..
cd frontend
start npm run dev
cd ..
code .
exit
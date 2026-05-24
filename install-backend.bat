@echo off
echo Este proyecto ya no usa backend para WhatsApp API.
echo.
echo Ahora el envio de pedidos se hace directo con enlace wa.me desde el frontend.
echo.
echo Recomendado: usar Docker para todo.
echo.
echo 1) Copia variables para Docker:
echo    Copy-Item .env.docker.example .env.docker
echo.
echo 2) Levanta desarrollo en Docker:
echo    docker compose up petworld-dev --build
echo.
echo 3) Levanta produccion en Docker:
echo    docker compose --env-file .env.docker up petworld-prod --build
echo.
pause

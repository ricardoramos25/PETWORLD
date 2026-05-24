@echo off
echo Iniciando PetWorld con Docker (desarrollo)...

docker compose up petworld-dev --build

echo.
echo Contenedor detenido.
# TechnicalChallengeMeLi
La documentación del proyecto se encuentra en el readme en la carpeta service, las preguntas están en un readme en la carpeta questions

## Requerimientos
* Docker
* Docker Compose
* Node JS v16 o posterior
* Yarn package manager o NPM

## Montar base de datos
Para montar la base de datos utilizaremos docker con el siguiente comando
```bash
export MONGODB_VERSION=6.0-ubi8
docker run --name mongodb -d -p 27017:27017 mongodb/mongodb-community-server:$MONGODB_VERSION
```
Para ejecutar en entornos linux:
```
docker run --name mongodb -d -p 27017:27017 bitnami/mongodb:latest
```
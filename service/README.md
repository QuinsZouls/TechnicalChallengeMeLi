## Microservicio con nodejs
## Arquitectura
El proyecto consta de un servicio de API REST que expone un único endpoint que dispara una función para procesar un archivo de información. Para procesar los datos del archivo, se utiliza una función que lee el archivo, lo descompone en líneas, y por cada línea, crea una tarea en una cola de procesamiento. Cada tarea consiste en varias solicitudes a una API pública de mercado libre utilizando el servicio "Ml bridge", que se encarga de hacer las solicitudes de manera asincrónica y devolver la respuesta. Los datos recibidos se procesan y se almacenan en una base de datos para su posterior uso.
El servicio "Ml bridge" es una clase que utiliza la librería Axios para realizar solicitudes HTTP a la API de Mercado Libre, y devuelve los datos obtenidos en formato JSON.
La función que procesa el archivo utiliza la librería Node.js fs para leer el archivo en formato stream, readline para separar las líneas una por una para evitar leer todo el archivo y la función applyHeaders para aplicar las cabeceras a los datos del archivo. La función lineDecoder se encarga de decodificar y separar cada línea del archivo, según los parámetros especificados.
Para hacer el procesamiento de forma eficiente, se utiliza una cola de procesamiento que se encarga de ejecutar las solicitudes a la API de Mercado Libre de manera asincróna. Además, se utiliza el módulo OS de Node.js para obtener el número de CPUs disponibles, y de esta forma, crear un número óptimo de hilos de ejecución en la cola de procesamiento.
Finalmente, se utilizan eventos de la cola de procesamiento y de la lectura del archivo para pausar y reanudar la lectura del archivo según el estado de la cola de procesamiento. Cuando todas las tareas se han completado, se cierra la lectura del archivo y se almacenan los datos procesados en una base de datos para su posterior uso.
## Setup del ambiente desarrollo
### Requerimientos
- NodeJS v16 o posterior
- npm o yarn
### Instalación de dependencias
Para ejecutar el proyecto es necesario instalar las dependencias con el siguiente comando:
```bash
npm install
# en caso de usar yarn
yarn install
```
### Ambientes de entorno
Crear un archivo con el nombre `.env.development.local` que contenga las siguientes variables de entorno:
```bash
# Puerto donde se quiere ejecutar el servicio
PORT =
# Host de la base de datos de mongodb
DB_HOST =
DB_PORT =
# Nombre de la base de datos de mongodb
DB_DATABASE =

# Url de la API pública de mercado libre
ML_API_SERVICE_URL =
```
Se utiliza dotenv para cargar las variables de ambiente.
Ejemplo:
```bash
# PORT
PORT = 3030

# Database
DB_HOST = localhost
DB_PORT = 27017
DB_DATABASE = ml_challenge

ML_API_SERVICE_URL = https://api.mercadolibre.com
```
## Ejecución
Para la ejecución debe tener configuradas las variables de ambiente
### Desarrollo
Para ejecutar el microservicio en modo desarrollo basta con correr el siguiente comando:
```bash
npm run dev
# En caso de yarn
yarn dev
```
### Desarrollo
Para ejecutar el microservicio en producción basta con correr el siguiente comando:
```bash
npm run start
# En caso de yarn
yarn start
```
## Pruebas unitarias y calidad de código
### Ejecución de pruebas unitarias
Para ejecutar las pruebas unitarias basta con ejecutar el siguiente comando:
```bash
npm run test
# yarn
yarn test
```
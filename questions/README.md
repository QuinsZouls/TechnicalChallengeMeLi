## Procesos, hilos y corrutinas
* Un caso en el que usarías procesos para resolver un problema y por qué.
* Un caso en el que usarías threads para resolver un problema y por qué.
* Un caso en el que usarías corrutinas para resolver un problema y por qué.
### Procesos
En un caso que se requiera procesar grandes cantidades de información y cada tarea cuente con una gran carga de trabajo como por ejemplo procesamiento de imágenes, se emplearían procesos ya que si se usaran hilos estos no podrían manejar toda la carga de trabajo y podrían causar cuellos de botella, también los procesos permiten aislar la información y tener un ambiente controlado.
### Hilos
Para realizar tareas que no sean pesadas pero requieran cierto tiempo para procesar como las peticiones HTTP o realizar consultas en una base de datos, usaría hilos para estos casos ya que no es una tarea que demande muchos recursos para ser ejecutada además pero requieren cierto tiempo para que la instancia responda, para evitar hacer que el servicio espere la respuesta de una petición o una lectura pesada en la base de datos y cause un cuello de botella, también los hilos permiten compartir los recursos con el hilo principal permitiendo tener comunicación directa con los hilos (para el envío y recepción de información)
### Corrutinas
Para la lectura de un archivo en formato stream para leer y procesarlo,  En lugar de cargar todo el archivo de datos en memoria y procesarlo en un solo hilo, se pueden utilizar corrutinas para dividir la tarea en pequeñas tareas, procesarlas de manera asincróna y en paralelo, y luego combinar los resultados al final.
## Optimización de recursos del sistema operativo
Si tuvieras 1.000.000 de elementos y tuvieras que consultar para cada uno de
ellos información en una API HTTP. ¿Cómo lo harías? Explicar.
### Respuesta
- Primero, haría una prueba de estrés al servidor para saber cuantas peticiones simultaneas puede manejar
- Una vez teniendo en cuenta los limites del servidor, separaría la cantidad de peticiones en lotes más pequeños.
- Una vez separado implementaría un servicio con una arquitectura en cluster utilizando los hilos del equipo host como Workers, tendría un nodo maestro que se encargaría de orquestar y asignar los lotes de peticiones a cada nodo Worker para que así trabajen de forma simultanea, lo haría en javascript usando NodeJS con el módulo build in `worker_threads`, también implementaría ciertos limites para prevenir que se lancen más peticiones de lo que el servicio puede soportar para así evitar futuros cuellos de botella
- Ya teniendo lista la implementación se procede a realizar pruebas de rendimiento y de estabilidad del servicio para asegurarse de que no haya problemas
## Análisis de complejidad
### Problema 1
Descartaría primero los algoritmos **B** y **C** por su naturaleza exponencial ya que el algoritmo **B** puede afectar el performance desde un inicio por ser cúbico y en algoritmo **C** lo evitaría a toda cosa ya que la complejidad de este algoritmo crecerá de manera insostenible (ya que es exponencial) y trataría siempre de usar los algoritmos **A** y **D** en mayor medida, si es posible utilizaría siempre el **D** y que su naturaleza es logarítmica por lo cual el valor final tiende a ser menor que una cuadrática (y también es una optimización del algoritmo **A**)
### Problema 2
Un de los posibles usos para la base de datos **AlfaDB** es la consulta numerosa de información, por ejemplo un blog web dinámico muy concurrido cuya información solo se actualiza pocas veces pero es consultada por millones de usuarios, también ésta base se podría utilizar para los sistemas de reportes o consultas complejas (que no requieran de una inserción constante de información) por otro lado la base de datos **BetaDB** la podría emplear para sistemas en tiempo real como por ejemplo, mensajería en tiempo real, streaming de información, sistemas meteorológicos, sistemas de rastreo, entre otros.
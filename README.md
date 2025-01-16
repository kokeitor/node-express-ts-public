## Comandos de inicio de proyecto
```bash	
npm i
```

## Añade las variables de entorno y cambia el nombre de example.env a .env


## Crea una cuenta en Aiven Cloud y crea la carpeta .secrets con el archivo ca.pem de conexion a tu BBDD

## Ejecuta el proyecto
```bash
npm run dev
```


### Descripcion del proyecto:

API REST haciendo uso de clean arquitecture. Implementación de varios casos de uso como JWT auth middlewares, operaciones CRUD de users conectándose a una BBDD PostgresSql y role managing mediante bearer JWT auth headers requests. La API ha sido desarrollada para un proyecto propio (side work/proyect para una Pyme de servicios) con typescript usando Node.js y express.js. El deployment de la aplicación se lleva acabo mediante GitHub actions, a través de un pipeline CI/CD definido en archivo yaml que incluye,entre otras features, paralelización de testing con supertest y jest, lintado de código y build (transpilacion de código ts a js y compresión) de artefactos.
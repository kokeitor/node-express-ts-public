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

Desarrollo una API REST siguiendo los principios de Clean Architecture, diseñada para ser modular, escalable y fácil de mantener. La API implementa diversos casos de uso clave, entre los que se incluyen:

- Autenticación JWT: Middlewares para la validación de tokens JWT, asegurando el acceso autorizado a los endpoints.
- Gestión de usuarios: Operaciones CRUD contra una base de datos PostgreSQL desplegada en Aiven Cloud.
- Gestión de roles: Control de permisos basado en roles, integrado mediante headers de autorización Bearer JWT.
- Login y registro de usuarios: Casos de uso implementados con validaciones robustas para garantizar la seguridad e integridad del proceso.
- Verificación de usuarios: Integración con el servicio Resend para el envío de correos electrónicos de verificación, mejorando la confianza y autenticidad del sistema.

La API está desarrollada en TypeScript, utilizando Node.js y Express.js como base para construir endpoints robustos y eficientes.

Para monitorear y optimizar el rendimiento, se ha integrado Better Stack como proveedor de logging profesional, lo que permite:

- Seguimiento de métricas de performance: Registro de tiempos de respuesta, carga de endpoints y errores.
- Análisis avanzado: Identificación de cuellos de botella y optimización del uso de recursos.
- Alertas en tiempo real: Notificaciones configuradas para problemas críticos, mejorando la respuesta ante incidencias.

El deployment de la aplicación se realiza mediante un pipeline CI/CD definido como workflow en GitHub Actions, que incluye:

- Testing paralelizado: Implementado con Supertest y Jest, asegurando la calidad del código.
- Linting y transpilación: Código TypeScript convertido a JavaScript optimizado, incluyendo compresión de artefactos para deployment.
- Automatización confiable: Definición de jobs en un archivo YAML, garantizando deploy rápido y seguro.

Este proyecto fue desarrollado como un trabajo personal, enfocado en cubrir necesidades específicas de una pequeña empresa de servicios (PyME), integrando funcionalidad avanzada con buenas prácticas de desarrollo profesional.
# Sistema de Gestión de Productos API (Node.js + Express + MongoDB + JWT)

Aplicación web y API RESTful desarrollada para la gestión segura de productos con operaciones CRUD completas, autenticación y autorización basada en JSON Web Tokens (JWT), pruebas unitarias automatizadas con Jest y despliegue continuo mediante GitHub Actions y Vercel.

## Estructura del Proyecto

- config/db.js: Conexión a MongoDB Atlas mediante Mongoose.
- models/: Esquemas de datos (Usuario.js y Producto.js).
- controllers/: Lógica de negocio para autenticación y operaciones CRUD.
- middlewares/authMiddleware.js: Verificación de tokens JWT en rutas protegidas.
- routes/: Definición de endpoints /api/auth y /api/productos.
- public/: Vista estática web (login.html e index.html) para registro, inicio de sesión y administración de productos.
- tests/productos.test.js: Pruebas unitarias automatizadas con Jest y Supertest.
- .github/workflows/ci-cd.yml: Pipeline de CI/CD en GitHub Actions.

## Instrucciones de Instalación y Ejecución Local

1. Clonar el repositorio:
   git clone [https://github.com/MeCansoGanzo/gestion-productos-api.git](https://github.com/MeCansoGanzo/gestion-productos-api.git)
   cd gestion-productos-api

2. Instalar dependencias:
   npm install

3. Configurar un archivo .env en la raíz con las variables:
   PORT=3000
   JWT_SECRET=tu_clave_secreta
   MONGO_URI=tu_cadena_de_conexion_mongodb_atlas

4. Ejecutar pruebas unitarias:
   npm test

5. Iniciar el servidor:
   npm start
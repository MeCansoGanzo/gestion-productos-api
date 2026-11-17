require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const conectarDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productoRoutes = require('./routes/productoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  conectarDB();
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api', (req, res) => {
  res.json({
    mensaje: 'API de Gestión de Productos funcionando correctamente',
    version: '1.0.0'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Formato JSON inválido en la solicitud' });
  }
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: err.message || 'Error interno en el servidor'
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}

module.exports = app;
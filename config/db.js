const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gestion_productos';
    const conn = await mongoose.connect(uri);

    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error al conectar con MongoDB: ${error.message}`);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

module.exports = conectarDB;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const registrarUsuario = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: 'Todos los campos (nombre, email y password) son obligatorios'
      });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({
        error: 'El correo electrónico ya está registrado'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordEncriptado = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordEncriptado
    });

    await nuevoUsuario.save();

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email
      }
    });
  } catch (error) {
    next(error);
  }
};

const iniciarSesion = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Debe proporcionar correo electrónico y contraseña'
      });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    const secreto = process.env.JWT_SECRET || 'secreto_desarrollo_productos_jwt';
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, nombre: usuario.nombre },
      secreto,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    next(error);
  }
};

const cerrarSesion = async (req, res) => {
  res.status(200).json({
    mensaje: 'Sesión cerrada exitosamente. Elimine el token en el cliente'
  });
};

module.exports = {
  registrarUsuario,
  iniciarSesion,
  cerrarSesion
};
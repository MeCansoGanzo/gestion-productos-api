const Producto = require('../models/Producto');

const obtenerProductos = async (req, res, next) => {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 });
    res.status(200).json(productos);
  } catch (error) {
    next(error);
  }
};

const obtenerProductoPorId = async (req, res, next) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }
    next(error);
  }
};

const crearProducto = async (req, res, next) => {
  try {
    const { nombre, descripcion, precio, categoria, stock } = req.body;

    if (!nombre || !descripcion || precio === undefined || !categoria) {
      return res.status(400).json({
        error: 'Nombre, descripción, precio y categoría son obligatorios'
      });
    }

    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      precio,
      categoria,
      stock: stock !== undefined ? stock : 0,
      creadoPor: req.usuario ? req.usuario.id : undefined
    });

    const productoGuardado = await nuevoProducto.save();

    res.status(201).json({
      mensaje: 'Producto creado exitosamente',
      producto: productoGuardado
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

const actualizarProducto = async (req, res, next) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!productoActualizado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json({
      mensaje: 'Producto actualizado exitosamente',
      producto: productoActualizado
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

const eliminarProducto = async (req, res, next) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);

    if (!productoEliminado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json({
      mensaje: 'Producto eliminado exitosamente',
      producto: productoEliminado
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }
    next(error);
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};
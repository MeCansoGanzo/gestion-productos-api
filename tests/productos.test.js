const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const Producto = require('../models/Producto');

jest.mock('../models/Producto');

const SECRET = process.env.JWT_SECRET || 'secreto_desarrollo_productos_jwt';
const tokenValido = jwt.sign(
  { id: '507f1f77bcf86cd799439011', email: 'german@tecmilenio.mx', nombre: 'German' },
  SECRET,
  { expiresIn: '1h' }
);

describe('Pruebas Unitarias - Controladores y Rutas de Productos', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Debe denegar acceso (401) si no se envía token JWT', async () => {
    const res = await request(app).get('/api/productos');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Acceso denegado. Token no proporcionado');
  });

  test('Debe denegar acceso (403) si el token JWT es inválido', async () => {
    const res = await request(app)
      .get('/api/productos')
      .set('Authorization', 'Bearer token_falso_123');
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('Token inválido o expirado');
  });

  test('GET /api/productos - Debe devolver la lista de productos autenticados', async () => {
    const listaMock = [
      { _id: '1', nombre: 'Laptop', descripcion: 'Core Ultra 5', precio: 15000, categoria: 'Cómputo', stock: 5 }
    ];
    Producto.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(listaMock)
    });

    const res = await request(app)
      .get('/api/productos')
      .set('Authorization', `Bearer ${tokenValido}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].nombre).toBe('Laptop');
  });

  test('GET /api/productos/:id - Debe devolver 404 si el producto no existe', async () => {
    Producto.findById.mockResolvedValue(null);

    const res = await request(app)
      .get('/api/productos/507f1f77bcf86cd799439099')
      .set('Authorization', `Bearer ${tokenValido}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Producto no encontrado');
  });

  test('POST /api/productos - Debe crear un producto válido (201)', async () => {
    const nuevoProd = {
      nombre: 'Monitor 2K',
      descripcion: '180Hz IPS',
      precio: 4500,
      categoria: 'Monitores',
      stock: 10
    };

    Producto.prototype.save = jest.fn().mockResolvedValue({
      _id: '507f1f77bcf86cd799439022',
      ...nuevoProd
    });

    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${tokenValido}`)
      .send(nuevoProd);

    expect(res.statusCode).toBe(201);
    expect(res.body.mensaje).toBe('Producto creado exitosamente');
    expect(res.body.producto.nombre).toBe('Monitor 2K');
  });

  test('POST /api/productos - Debe devolver 400 si faltan campos obligatorios', async () => {
    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${tokenValido}`)
      .send({ nombre: 'Incompleto' });

    expect(res.statusCode).toBe(400);
  });

  test('PUT /api/productos/:id - Debe actualizar un producto existente (200)', async () => {
    const actualizado = {
      _id: '507f1f77bcf86cd799439022',
      nombre: 'Monitor 2K Pro',
      precio: 4800
    };
    Producto.findByIdAndUpdate.mockResolvedValue(actualizado);

    const res = await request(app)
      .put('/api/productos/507f1f77bcf86cd799439022')
      .set('Authorization', `Bearer ${tokenValido}`)
      .send({ nombre: 'Monitor 2K Pro', precio: 4800 });

    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toBe('Producto actualizado exitosamente');
  });

  test('DELETE /api/productos/:id - Debe eliminar un producto existente (200)', async () => {
    Producto.findByIdAndDelete.mockResolvedValue({
      _id: '507f1f77bcf86cd799439022',
      nombre: 'Monitor 2K Pro'
    });

    const res = await request(app)
      .delete('/api/productos/507f1f77bcf86cd799439022')
      .set('Authorization', `Bearer ${tokenValido}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toBe('Producto eliminado exitosamente');
  });
});
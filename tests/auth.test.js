const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');

describe('Endpoints de Autenticación', () => {
  beforeAll(async () => {
    // Conectar a una base de datos de prueba
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Limpiar usuarios después de cada prueba
    await User.deleteMany();
  });

  it('debería registrar un nuevo usuario', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'usuarioPrueba', password: 'password123' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual('Usuario registrado exitosamente');
  });

  it('debería iniciar sesión y retornar un token', async () => {
    // Crear usuario de prueba
    const user = new User({ username: 'usuarioPrueba', password: 'password123' });
    await user.save();

    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'usuarioPrueba', password: 'password123' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
  });
});

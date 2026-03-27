// __tests__/endpoints.test.js
const request = require('supertest');
const app = require('../src/app');

// ─────────────────────────────────────────
// GET /
// ─────────────────────────────────────────
describe('GET /', () => {
W
  it('retorna status 200', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });

  it('retorna el mensaje correcto', async () => {
    const res = await request(app).get('/');
    expect(res.body.message).toBe('Prueba Técnica APAP');
  });

  it('retorna version como string', async () => {
    const res = await request(app).get('/');
    expect(typeof res.body.version).toBe('string');
  });

  it('retorna version por defecto si no hay APP_VERSION', async () => {
    delete process.env.APP_VERSION; // aseguramos que no esté seteada
    const res = await request(app).get('/');
    expect(res.body.version).toBe('1.0.0');
  });

  it('retorna version desde variable de entorno si existe', async () => {
    process.env.APP_VERSION = '2.5.0';
    const res = await request(app).get('/');
    expect(res.body.version).toBe('2.5.0');
    delete process.env.APP_VERSION; // limpiamos después
  });

  it('retorna environment por defecto si no hay NODE_ENV', async () => {
    delete process.env.NODE_ENV;
    const res = await request(app).get('/');
    expect(res.body.environment).toBe('development');
  });

  it('retorna los 3 campos requeridos', async () => {
    const res = await request(app).get('/');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('version');
    expect(res.body).toHaveProperty('environment');
  });

});


// ─────────────────────────────────────────
// GET /api/info
// ─────────────────────────────────────────
describe('GET /api/info', () => {

  it('retorna status 200', async () => {
    const res = await request(app).get('/api/info');
    expect(res.status).toBe(200);
  });

  it('retorna el nombre de la app correcto', async () => {
    const res = await request(app).get('/api/info');
    expect(res.body.app).toBe('prueba-tecnica-apap');
  });

  it('retorna una descripción como string', async () => {
    const res = await request(app).get('/api/info');
    expect(typeof res.body.description).toBe('string');
    expect(res.body.description.length).toBeGreaterThan(0);
  });

  it('retorna un array de endpoints', async () => {
    const res = await request(app).get('/api/info');
    expect(Array.isArray(res.body.endpoints)).toBe(true);
  });

  it('retorna exactamente 3 endpoints', async () => {
    const res = await request(app).get('/api/info');
    expect(res.body.endpoints).toHaveLength(3);
  });

  it('cada endpoint tiene method, path y description', async () => {
    const res = await request(app).get('/api/info');
    res.body.endpoints.forEach(endpoint => {
      expect(endpoint).toHaveProperty('method');
      expect(endpoint).toHaveProperty('path');
      expect(endpoint).toHaveProperty('description');
    });
  });

  it('contiene el endpoint GET /', async () => {
    const res = await request(app).get('/api/info');
    const root = res.body.endpoints.find(e => e.path === '/');
    expect(root).toBeDefined();
    expect(root.method).toBe('GET');
  });

  it('contiene el endpoint GET /health', async () => {
    const res = await request(app).get('/api/info');
    const health = res.body.endpoints.find(e => e.path === '/health');
    expect(health).toBeDefined();
    expect(health.method).toBe('GET');
  });

  it('contiene el endpoint GET /api/info', async () => {
    const res = await request(app).get('/api/info');
    const info = res.body.endpoints.find(e => e.path === '/api/info');
    expect(info).toBeDefined();
    expect(info.method).toBe('GET');
  });

  it('retorna los 3 campos principales', async () => {
    const res = await request(app).get('/api/info');
    expect(res.body).toHaveProperty('app');
    expect(res.body).toHaveProperty('description');
    expect(res.body).toHaveProperty('endpoints');
  });

});
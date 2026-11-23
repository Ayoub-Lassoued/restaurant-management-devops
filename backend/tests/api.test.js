const request = require('supertest');

// Mock de la base MySQL pour que les tests tournent aussi en CI sans BDD
jest.mock('../config/db', () => ({
  query: jest.fn()
}));

const pool = require('../config/db');
const app = require('../app');

describe('Restaurant API - Tests de base', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /health doit retourner 200 et status UP quand la BDD répond', async () => {
    pool.query.mockResolvedValueOnce([[{ '1': 1 }]]);
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.database).toBe('CONNECTED');
  });

  test('GET /health doit retourner 503 si la BDD échoue', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB connection lost'));
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(503);
    expect(res.body.status).toBe('DOWN');
  });

  test('POST /api/categories sans nom doit retourner 400', async () => {
    const res = await request(app).post('/api/categories').send({ description: 'Test' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Category name is required');
  });
});

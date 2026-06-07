const request = require('supertest');

// Mock the database so tests run without a real PostgreSQL connection
jest.mock('../db', () => ({
  query: jest.fn().mockResolvedValue({ rows: [{ '?column?': 1 }] })
}));

const app = require('../app');

describe('Health endpoint', () => {
  it('GET /health returns 200 with healthy status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
    expect(response.body.database).toBe('connected');
    expect(response.body.timestamp).toBeDefined();
  });
});

describe('Payments endpoint', () => {
  it('GET /api/payments returns 200', async () => {
    const { query } = require('../db');
    query.mockResolvedValueOnce({ rows: [] });
    query.mockResolvedValueOnce({ rows: [] });
    query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).get('/api/payments');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /api/payments returns 400 when required fields missing', async () => {
    const response = await request(app)
      .post('/api/payments')
      .send({ amount: 100 });
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});

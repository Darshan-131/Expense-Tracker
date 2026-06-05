const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../index');

const DATA_FILE = path.join(__dirname, '../data/expenses.json');

// Reset the data file before each test
beforeEach(() => {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, '[]', 'utf8');
});

afterAll(() => {
  // Clean up test data
  if (fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');
});

describe('POST /api/expenses', () => {
  it('creates a valid expense and returns 201', async () => {
    const res = await request(app).post('/api/expenses').send({
      amount: 250,
      category: 'Food',
      date: '2024-01-15',
      note: 'Lunch',
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      amount: 250,
      category: 'Food',
      date: '2024-01-15',
      note: 'Lunch',
    });
    expect(res.body.id).toBeDefined();
  });

  it('rejects a negative amount with 400', async () => {
    const res = await request(app).post('/api/expenses').send({
      amount: -50,
      category: 'Food',
      date: '2024-01-15',
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('Amount must be a positive number.');
  });

  it('rejects a missing category with 400', async () => {
    const res = await request(app).post('/api/expenses').send({
      amount: 100,
      date: '2024-01-15',
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('Category is required.');
  });

  it('rejects a future date with 400', async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const res = await request(app).post('/api/expenses').send({
      amount: 100,
      category: 'Bills',
      date: futureDate.toISOString().split('T')[0],
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('Date cannot be in the future.');
  });
});

describe('GET /api/expenses', () => {
  it('returns all expenses sorted newest first', async () => {
    await request(app).post('/api/expenses').send({ amount: 100, category: 'Food', date: '2024-01-10' });
    await request(app).post('/api/expenses').send({ amount: 200, category: 'Bills', date: '2024-01-20' });

    const res = await request(app).get('/api/expenses');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(new Date(res.body[0].date) >= new Date(res.body[1].date)).toBe(true);
  });

  it('filters by category', async () => {
    await request(app).post('/api/expenses').send({ amount: 100, category: 'Food', date: '2024-01-10' });
    await request(app).post('/api/expenses').send({ amount: 200, category: 'Bills', date: '2024-01-15' });

    const res = await request(app).get('/api/expenses?category=Food');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].category).toBe('Food');
  });
});

describe('PUT /api/expenses/:id', () => {
  it('updates an existing expense', async () => {
    const created = await request(app).post('/api/expenses').send({
      amount: 100,
      category: 'Food',
      date: '2024-01-10',
    });

    const id = created.body.id;
    const res = await request(app).put(`/api/expenses/${id}`).send({
      amount: 150,
      category: 'Transport',
      date: '2024-01-10',
    });

    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(150);
    expect(res.body.category).toBe('Transport');
  });

  it('returns 404 for non-existent expense', async () => {
    const res = await request(app).put('/api/expenses/nonexistent-id').send({
      amount: 100,
      category: 'Food',
      date: '2024-01-10',
    });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/expenses/:id', () => {
  it('deletes an expense and returns success message', async () => {
    const created = await request(app).post('/api/expenses').send({
      amount: 100,
      category: 'Food',
      date: '2024-01-10',
    });

    const id = created.body.id;
    const res = await request(app).delete(`/api/expenses/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Expense deleted.');

    const all = await request(app).get('/api/expenses');
    expect(all.body.length).toBe(0);
  });
});

describe('GET /api/expenses/summary', () => {
  it('returns correct totals for current month', async () => {
    const today = new Date().toISOString().split('T')[0];
    await request(app).post('/api/expenses').send({ amount: 300, category: 'Food', date: today });
    await request(app).post('/api/expenses').send({ amount: 500, category: 'Bills', date: today });

    const res = await request(app).get('/api/expenses/summary');
    expect(res.status).toBe(200);
    expect(res.body.totalThisMonth).toBe(800);
    expect(res.body.totalPerCategory['Food']).toBe(300);
    expect(res.body.totalPerCategory['Bills']).toBe(500);
  });
});

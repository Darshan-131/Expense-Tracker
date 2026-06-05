const BASE = 'https://expense-tracker-api-9xvp.onrender.com/api/expenses';

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    const message = data.errors ? data.errors.join(' ') : data.error || 'Something went wrong.';
    throw new Error(message);
  }
  return data;
}

export async function fetchExpenses(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== 'All') params.set('category', filters.category);
  if (filters.startDate) params.set('startDate', filters.startDate);
  if (filters.endDate) params.set('endDate', filters.endDate);

  const query = params.toString();
  const res = await fetch(`${BASE}${query ? '?' + query : ''}`);
  return handleResponse(res);
}

export async function fetchSummary() {
  const res = await fetch(`${BASE}/summary`);
  return handleResponse(res);
}

export async function createExpense(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateExpense(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteExpense(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}

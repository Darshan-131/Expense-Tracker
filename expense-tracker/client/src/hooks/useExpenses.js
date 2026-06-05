import { useState, useEffect, useCallback } from 'react';
import { fetchExpenses, fetchSummary, createExpense, updateExpense, deleteExpense } from '../utils/api';

export function useExpenses(filters) {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [expData, sumData] = await Promise.all([
        fetchExpenses(filters),
        fetchSummary(),
      ]);
      setExpenses(expData);
      setSummary(sumData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    load();
  }, [load]);

  async function addExpense(data) {
    const created = await createExpense(data);
    await load();
    return created;
  }

  async function editExpense(id, data) {
    const updated = await updateExpense(id, data);
    await load();
    return updated;
  }

  async function removeExpense(id) {
    await deleteExpense(id);
    await load();
  }

  return { expenses, summary, loading, error, addExpense, editExpense, removeExpense, reload: load };
}

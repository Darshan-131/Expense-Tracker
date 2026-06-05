import { useState } from 'react';
import { useExpenses } from './hooks/useExpenses';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import SummaryPanel from './components/SummaryPanel';
import CategoryChart from './components/CategoryChart';
import FiltersBar from './components/FiltersBar';
import { exportToCSV } from './utils/csvExport';
import styles from './App.module.css';

const DEFAULT_FILTERS = {
  category: 'All',
  startDate: '',
  endDate: '',
  preset: 'all',
};

export default function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [formLoading, setFormLoading] = useState(false);

  const { expenses, summary, loading, error, addExpense, editExpense, removeExpense } =
    useExpenses(filters);

  async function handleAdd(data) {
    setFormLoading(true);
    try {
      await addExpense(data);
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <h1 className={styles.logo}>Expense Tracker</h1>
            <p className={styles.tagline}>Keep tabs on every rupee.</p>
          </div>
          <button
            className={styles.exportBtn}
            onClick={() => exportToCSV(expenses)}
            disabled={expenses.length === 0}
            title="Export visible expenses as CSV"
          >
            ↓ Export CSV
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {/* Left column */}
        <div className={styles.left}>
          <ExpenseForm onSubmit={handleAdd} loading={formLoading} />

          <FiltersBar filters={filters} onChange={setFilters} />

          {error && (
            <div className={styles.errorBanner}>
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <div className={styles.spinner} aria-label="Loading expenses" />
          ) : (
            <ExpenseList
              expenses={expenses}
              onEdit={editExpense}
              onDelete={removeExpense}
            />
          )}
        </div>

        {/* Right column */}
        <aside className={styles.right}>
          {summary && (
            <>
              <SummaryPanel summary={summary} />
              <CategoryChart totalPerCategory={summary.totalPerCategory} />
            </>
          )}
        </aside>
      </main>
    </div>
  );
}

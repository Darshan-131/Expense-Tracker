import { useState } from 'react';
import { formatCurrency, formatDate, CATEGORY_COLORS } from '../utils/helpers';
import ExpenseForm from './ExpenseForm';
import styles from './ExpenseList.module.css';

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  async function handleEditSubmit(data) {
    setActionLoading(true);
    try {
      await onEdit(editingId, data);
      setEditingId(null);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete(id) {
    setActionLoading(true);
    try {
      await onDelete(id);
      setConfirmDeleteId(null);
    } finally {
      setActionLoading(false);
    }
  }

  if (expenses.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🧾</span>
        <p>No expenses found.</p>
        <p className={styles.emptyHint}>Add one above or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {expenses.map((exp) => (
        <div key={exp.id} className={`${styles.item} fade-in`}>
          {editingId === exp.id ? (
            <ExpenseForm
              initial={exp}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingId(null)}
              loading={actionLoading}
            />
          ) : confirmDeleteId === exp.id ? (
            <div className={styles.confirmDelete}>
              <p>Delete <strong>{exp.category}</strong> — {formatCurrency(exp.amount)}?</p>
              <div className={styles.confirmActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setConfirmDeleteId(null)}
                >
                  Cancel
                </button>
                <button
                  className={styles.deleteConfirmBtn}
                  onClick={() => handleDelete(exp.id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Deleting…' : 'Yes, delete'}
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.row}>
              <span
                className={styles.catBadge}
                style={{
                  background: CATEGORY_COLORS[exp.category] + '22',
                  color: CATEGORY_COLORS[exp.category],
                  borderColor: CATEGORY_COLORS[exp.category] + '44',
                }}
              >
                {exp.category}
              </span>

              <div className={styles.info}>
                <span className={styles.amount}>{formatCurrency(exp.amount)}</span>
                {exp.note && <span className={styles.note}>{exp.note}</span>}
              </div>

              <span className={styles.date}>{formatDate(exp.date)}</span>

              <div className={styles.actions}>
                <button
                  className={styles.editBtn}
                  onClick={() => setEditingId(exp.id)}
                  aria-label="Edit expense"
                >
                  ✏️
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => setConfirmDeleteId(exp.id)}
                  aria-label="Delete expense"
                >
                  🗑️
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

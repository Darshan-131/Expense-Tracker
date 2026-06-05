import { useState, useEffect } from 'react';
import { CATEGORIES, today } from '../utils/helpers';
import styles from './ExpenseForm.module.css';

const EMPTY = { amount: '', category: '', date: today(), note: '' };

export default function ExpenseForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initial || EMPTY);
    setErrors({});
  }, [initial]);

  function validate() {
    const e = {};
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      e.amount = 'Enter a positive amount.';
    if (!form.category) e.category = 'Select a category.';
    if (!form.date) e.date = 'Pick a date.';
    else if (form.date > today()) e.date = 'Date cannot be in the future.';
    return e;
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    try {
      await onSubmit({ ...form, amount: Number(form.amount) });
      setForm(EMPTY);
    } catch (err) {
      setErrors({ submit: err.message });
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.title}>{initial ? 'Edit Expense' : 'Add Expense'}</h2>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            className={errors.amount ? styles.inputError : ''}
          />
          {errors.amount && <span className={styles.error}>{errors.amount}</span>}
        </div>

        <div className={styles.field}>
          <label>Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={errors.category ? styles.inputError : ''}
          >
            <option value="">Select…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <span className={styles.error}>{errors.category}</span>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            max={today()}
            className={errors.date ? styles.inputError : ''}
          />
          {errors.date && <span className={styles.error}>{errors.date}</span>}
        </div>

        <div className={styles.field}>
          <label>Note <span className={styles.optional}>(optional)</span></label>
          <input
            type="text"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="What was this for?"
            maxLength={120}
          />
        </div>
      </div>

      {errors.submit && <p className={styles.submitError}>{errors.submit}</p>}

      <div className={styles.actions}>
        {onCancel && (
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Saving…' : initial ? 'Save Changes' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}

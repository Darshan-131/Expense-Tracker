import { CATEGORIES, today, firstOfMonth } from '../utils/helpers';
import styles from './FiltersBar.module.css';

const DATE_PRESETS = [
  { label: 'All time', value: 'all' },
  { label: 'This month', value: 'month' },
  { label: 'Last month', value: 'last_month' },
  { label: 'Custom', value: 'custom' },
];

function getPresetDates(preset) {
  const now = new Date();
  if (preset === 'month') {
    return {
      startDate: firstOfMonth(),
      endDate: today(),
    };
  }
  if (preset === 'last_month') {
    const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const last = new Date(now.getFullYear(), now.getMonth(), 0);
    return {
      startDate: first.toISOString().split('T')[0],
      endDate: last.toISOString().split('T')[0],
    };
  }
  return { startDate: '', endDate: '' };
}

export default function FiltersBar({ filters, onChange }) {
  const { category, startDate, endDate, preset } = filters;

  function handlePreset(p) {
    const dates = getPresetDates(p);
    onChange({ ...filters, preset: p, ...dates });
  }

  function handleCategory(e) {
    onChange({ ...filters, category: e.target.value });
  }

  function handleDate(field, value) {
    onChange({ ...filters, [field]: value, preset: 'custom' });
  }

  return (
    <div className={styles.bar}>
      <div className={styles.group}>
        <label>Category</label>
        <select value={category} onChange={handleCategory}>
          <option value="All">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className={styles.group}>
        <label>Period</label>
        <div className={styles.presets}>
          {DATE_PRESETS.map((p) => (
            <button
              key={p.value}
              className={`${styles.presetBtn} ${preset === p.value ? styles.active : ''}`}
              onClick={() => handlePreset(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {preset === 'custom' && (
        <div className={styles.group}>
          <label>Date Range</label>
          <div className={styles.dateRow}>
            <input
              type="date"
              value={startDate}
              max={endDate || today()}
              onChange={(e) => handleDate('startDate', e.target.value)}
            />
            <span className={styles.dateSep}>to</span>
            <input
              type="date"
              value={endDate}
              min={startDate}
              max={today()}
              onChange={(e) => handleDate('endDate', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

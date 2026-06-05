import { formatCurrency, CATEGORY_COLORS } from '../utils/helpers';
import styles from './SummaryPanel.module.css';

export default function SummaryPanel({ summary }) {
  if (!summary) return null;
  const { totalThisMonth, totalPerCategory, highestExpense } = summary;

  return (
    <div className={styles.panel}>
      <div className={styles.bigStat}>
        <span className={styles.bigLabel}>Spent this month</span>
        <span className={styles.bigValue}>{formatCurrency(totalThisMonth)}</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.categories}>
        {Object.entries(totalPerCategory).map(([cat, amount]) => (
          <div key={cat} className={styles.catRow}>
            <span
              className={styles.dot}
              style={{ background: CATEGORY_COLORS[cat] }}
            />
            <span className={styles.catName}>{cat}</span>
            <span className={styles.catAmount}>{formatCurrency(amount)}</span>
          </div>
        ))}
      </div>

      {highestExpense && (
        <>
          <div className={styles.divider} />
          <div className={styles.highest}>
            <span className={styles.highLabel}>Highest single expense</span>
            <span className={styles.highValue}>{formatCurrency(highestExpense.amount)}</span>
            <span className={styles.highMeta}>
              {highestExpense.category} · {highestExpense.note || 'No note'}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

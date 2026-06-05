import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CATEGORY_COLORS, formatCurrency } from '../utils/helpers';
import styles from './CategoryChart.module.css';

export default function CategoryChart({ totalPerCategory }) {
  const data = Object.entries(totalPerCategory)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  if (data.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No data for this month yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.chart}>
      <h3 className={styles.heading}>Spending by Category</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(value)}
            contentStyle={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text)',
              fontSize: '0.85rem',
            }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Format number as Indian Rupee
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format date string to readable form
export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Today's date in YYYY-MM-DD
export function today() {
  return new Date().toISOString().split('T')[0];
}

// First day of current month in YYYY-MM-DD
export function firstOfMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

// Category colour map
export const CATEGORY_COLORS = {
  Food: 'var(--cat-food)',
  Transport: 'var(--cat-transport)',
  Bills: 'var(--cat-bills)',
  Entertainment: 'var(--cat-entertainment)',
  Other: 'var(--cat-other)',
};

export const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

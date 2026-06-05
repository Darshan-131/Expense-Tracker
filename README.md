# Mini Expense Tracker

A full-stack expense tracking application built with Node.js + Express on the backend and React + Vite on the frontend.

## Live Demo

> _Deploy to Render (backend) + Vercel (frontend) and add links here._

---

## Exercise

This is **Exercise 2: Mini Expense Tracker** from the Studio Graphene Full Stack Developer assessment. It lets a user log daily spending across five categories, filter by category and date range, and view a summary of where their money is going — including a donut chart, monthly total, per-category breakdown, and highest single expense. Expenses persist to a JSON file, so data survives server restarts.

---

## Tech Stack

| Layer      | Choice                    | Why                                                                                     |
|------------|---------------------------|-----------------------------------------------------------------------------------------|
| Backend    | Node.js + Express         | Lightweight, minimal boilerplate, widely familiar                                       |
| Frontend   | React 18 + Vite           | Fast dev server, modern build pipeline, functional components with hooks                |
| Styling    | CSS Modules               | Scoped styles with no build-time dependencies; keeps things simple and readable         |
| Chart      | Recharts                  | Well-documented React charting library with responsive container support                |
| Storage    | JSON file (`data/expenses.json`) | Persists across restarts without needing a full DB setup                          |
| Testing    | Jest + Supertest          | Standard Node testing tools; Supertest lets us hit real HTTP endpoints in tests         |
| Fonts      | DM Serif Display + DM Sans | Distinctive, readable pairing from Google Fonts                                        |

---

## How to Run Locally

**Prerequisites:** Node.js v18+ installed. That's it.

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd expense-tracker
```

### 2. Install & start the backend

```bash
cd server
npm install
npm run dev        # runs on http://localhost:5000
```

### 3. Install & start the frontend (new terminal)

```bash
cd client
npm install
npm run dev        # runs on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> The Vite dev server proxies all `/api` requests to `http://localhost:5000`, so no CORS configuration is needed during development.

### 4. Run tests

```bash
cd server
npm test
```

---

## API Documentation

Base URL: `http://localhost:5000`

### `GET /api/expenses`

Returns all expenses, sorted by date (newest first). Supports optional query filters.

**Query params:**

| Param       | Type   | Description                                         |
|-------------|--------|-----------------------------------------------------|
| `category`  | string | Filter by category (`Food`, `Transport`, etc.)      |
| `startDate` | string | ISO date string `YYYY-MM-DD` — inclusive lower bound|
| `endDate`   | string | ISO date string `YYYY-MM-DD` — inclusive upper bound|

**Response:** `200 OK`

```json
[
  {
    "id": "uuid",
    "amount": 250,
    "category": "Food",
    "date": "2024-01-15",
    "note": "Lunch",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
```

---

### `GET /api/expenses/summary`

Returns aggregated stats for the current calendar month.

**Response:** `200 OK`

```json
{
  "totalThisMonth": 3200,
  "totalPerCategory": {
    "Food": 800,
    "Transport": 400,
    "Bills": 1500,
    "Entertainment": 300,
    "Other": 200
  },
  "highestExpense": {
    "id": "uuid",
    "amount": 1500,
    "category": "Bills",
    "date": "2024-01-01",
    "note": "Electricity"
  }
}
```

---

### `POST /api/expenses`

Creates a new expense.

**Request body:**

```json
{
  "amount": 250,
  "category": "Food",
  "date": "2024-01-15",
  "note": "Lunch with team"
}
```

**Validation rules:**
- `amount` — required, positive number
- `category` — required, one of: `Food`, `Transport`, `Bills`, `Entertainment`, `Other`
- `date` — required, valid date, not in the future
- `note` — optional string

**Response:** `201 Created` — returns the created expense object.

**Error response:** `400 Bad Request`

```json
{ "errors": ["Amount must be a positive number.", "Category is required."] }
```

---

### `PUT /api/expenses/:id`

Updates an existing expense. Same validation rules as POST.

**Response:** `200 OK` — returns the updated expense object.

**Error:** `404 Not Found` if the ID doesn't exist.

---

### `DELETE /api/expenses/:id`

Deletes an expense.

**Response:** `200 OK`

```json
{ "message": "Expense deleted." }
```

**Error:** `404 Not Found` if the ID doesn't exist.

---

### `GET /api/health`

Simple health check endpoint.

**Response:** `200 OK` — `{ "status": "ok" }`

---

## Project Structure

```
expense-tracker/
├── client/                   # React frontend (Vite)
│   ├── index.html
│   ├── vite.config.js        # Dev server with /api proxy
│   └── src/
│       ├── main.jsx          # React entry point
│       ├── App.jsx           # Root layout, state orchestration
│       ├── App.module.css
│       ├── index.css         # Global CSS variables and resets
│       ├── components/
│       │   ├── ExpenseForm.jsx       # Add / edit form with validation
│       │   ├── ExpenseList.jsx       # Expense rows with inline edit & confirm-delete
│       │   ├── SummaryPanel.jsx      # Monthly total + per-category breakdown
│       │   ├── CategoryChart.jsx     # Recharts donut chart
│       │   └── FiltersBar.jsx        # Category select + date range presets
│       ├── hooks/
│       │   └── useExpenses.js        # Data fetching, CRUD, summary in one hook
│       └── utils/
│           ├── api.js                # All fetch calls to the backend
│           ├── helpers.js            # Currency, date formatting, constants
│           └── csvExport.js          # Client-side CSV export
│
└── server/                   # Node.js + Express backend
    ├── index.js              # App setup, middleware, global error handling
    ├── package.json
    ├── data/
    │   └── expenses.json     # Persisted data (auto-created on first run)
    ├── routes/
    │   ├── expenses.js       # All expense routes + validation logic
    │   └── storage.js        # Read/write JSON file helper
    └── __tests__/
        └── expenses.test.js  # Jest + Supertest integration tests
```

---

## Next Steps

Given more time, I would add:

- **Authentication** — even a simple username/password with JWT would make this multi-user
- **Budget limits per category** — store a `budgets` object server-side and return a warning flag when a category exceeds its monthly budget
- **Pagination** — the list currently loads all expenses matching the filter; pagination would be needed at scale
- **PostgreSQL or SQLite** — the JSON file works fine here but isn't suitable for concurrent writes or large datasets
- **Frontend tests** — React Testing Library tests for the form validation flow and the filter interactions
- **Bar chart view** — a month-over-month bar chart would complement the donut chart nicely
- **Accessible colour contrast** — the dark theme passes most contrast checks, but a formal a11y audit would be worthwhile

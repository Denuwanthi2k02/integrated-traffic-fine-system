# Traffic Fine Admin Portal — Member 5

React Vite frontend for the Sri Lanka Police Traffic Fine Management System.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5174

**Demo login:** `admin` / `admin123`

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Overview | KPI cards, district bar chart, category doughnut, revenue trend, recent transactions |
| `/districts` | Districts | Stacked bar chart + sortable table of all districts |
| `/categories` | Categories | Doughnut + horizontal bar + category detail table |
| `/transactions` | Transactions | Searchable, filterable transaction table |
| `/reports` | Reports | Monthly trend lines + top-5 tables + CSV export |

## Connecting to the Backend (Member 1 & 2)

All API calls are in `src/services/api.js`. Each function has a commented-out real axios call ready:

```js
// Replace mock with real call:
export const getAdminSummary = async (filters = {}) => {
  return api.get('/admin/summary', { params: filters })  // uncomment
}
```

Set `VITE_API_URL` in `.env` to your Spring Boot server URL.

JWT token is auto-attached to every request via the axios interceptor.

## Project Structure

```
src/
  components/       Reusable UI: KpiCard, Card, FilterBar, StatusBadge, PageHeader
  pages/            Route pages: DashboardHome, Districts, Categories, Transactions, Reports
  services/api.js   All API calls + mock data
  context/          JWT auth context
  index.css         Global CSS variables & resets
  App.jsx           Router setup
```

## Git Commits

```bash
git add .
git commit -m "Admin(Member5): Initial admin portal setup with React Vite"
git commit -m "Admin(Member5): Add district analytics page with stacked bar chart"
git commit -m "Admin(Member5): Add transactions page with search and filtering"
git commit -m "Admin(Member5): Add reports page with CSV export"
```

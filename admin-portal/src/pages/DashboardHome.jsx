import React, { useState, useEffect } from 'react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement, LineElement, PointElement, Filler
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { DollarSign, FileText, Clock, AlertTriangle, Map, TrendingUp } from 'lucide-react'
import KpiCard from '../components/KpiCard'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import FilterBar from '../components/FilterBar'
import StatusBadge from '../components/StatusBadge'
import {
  getAdminSummary, getDistrictCollections,
  getCategoryBreakdown, getMonthlyTrend, getRecentTransactions
} from '../services/api'
import styles from './DashboardHome.module.css'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  ArcElement, LineElement, PointElement, Filler
)

const fmt = (n) => 'Rs. ' + (n >= 1000000
  ? (n / 1000000).toFixed(1) + 'M'
  : n >= 1000 ? (n / 1000).toFixed(0) + 'K' : n)

const DashboardHome = () => {
  const [filters, setFilters] = useState({ district: 'all', status: 'all', month: '2026-06' })
  const [summary, setSummary] = useState(null)
  const [districts, setDistricts] = useState([])
  const [categories, setCategories] = useState([])
  const [monthly, setMonthly] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getAdminSummary(filters),
      getDistrictCollections(filters),
      getCategoryBreakdown(filters),
      getMonthlyTrend(filters),
      getRecentTransactions(filters),
    ]).then(([s, d, c, m, t]) => {
      setSummary(s); setDistricts(d); setCategories(c); setMonthly(m); setTransactions(t)
      setLoading(false)
    })
  }, [filters])

  const catColors = ['#1a3a6b','#2251a3','#e8a020','#d85a30','#5b4ec7','#16803c']

  const districtChartData = {
    labels: districts.slice(0,7).map(d => d.name),
    datasets: [{
      label: 'Revenue (LKR)',
      data: districts.slice(0,7).map(d => d.revenue),
      backgroundColor: '#2251a3',
      borderRadius: 5,
      borderSkipped: false,
    }]
  }

  const catChartData = {
    labels: categories.map(c => c.name),
    datasets: [{
      data: categories.map(c => c.count),
      backgroundColor: catColors,
      borderWidth: 2,
      borderColor: '#ffffff',
    }]
  }

  const trendChartData = monthly ? {
    labels: monthly.labels,
    datasets: [{
      label: 'Revenue (LKR)',
      data: monthly.revenue,
      borderColor: '#2251a3',
      backgroundColor: 'rgba(34,81,163,0.08)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#2251a3',
      pointRadius: 4,
    }]
  } : null

  const chartOpts = (yFmt) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { font: { size: 11 }, color: '#94a3b8' }, grid: { display: false } },
      y: { ticks: { font: { size: 11 }, color: '#94a3b8', callback: yFmt }, grid: { color: 'rgba(0,0,0,0.05)' } }
    }
  })

  if (loading) return (
    <div className={styles.loadingWrap}>
      <div className={styles.spinner} />
      <span>Loading dashboard data...</span>
    </div>
  )

  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle={`National traffic fine analytics · June 2026`}
      />

      <FilterBar filters={filters} onChange={setFilters} />

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <KpiCard
          icon={DollarSign}
          label="Total Revenue"
          value={fmt(summary.totalRevenue)}
          trend={summary.revenueGrowth}
          trendUp
          color="blue"
        />
        <KpiCard
          icon={FileText}
          label="Fines Issued"
          value={summary.totalFines.toLocaleString()}
          trend={summary.fineGrowth}
          trendUp
          color="green"
        />
        <KpiCard
          icon={Clock}
          label="Pending Fines"
          value={summary.pendingFines.toLocaleString()}
          sub={`${((summary.pendingFines / summary.totalFines) * 100).toFixed(1)}% of total`}
          color="amber"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Top Violation"
          value={summary.topViolation}
          sub="42% of all fines issued"
          color="red"
        />
      </div>

      {/* Charts Row 1 */}
      <div className={styles.chartsRow}>
        <Card title="District-wise collections" icon={Map}>
          <div className={styles.chartWrap}>
            <Bar
              data={districtChartData}
              options={chartOpts(v => 'Rs.' + (v/1000).toFixed(0) + 'K')}
              aria-label="Bar chart of fine revenue by district"
            />
          </div>
        </Card>

        <Card title="Violations by category" icon={AlertTriangle}>
          <div className={styles.pieLegend}>
            {categories.map((c, i) => (
              <div key={c.name} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: catColors[i] }} />
                <span className={styles.legendName}>{c.name}</span>
                <span className={styles.legendVal}>{c.count}</span>
              </div>
            ))}
          </div>
          <div className={styles.donutWrap}>
            <Doughnut
              data={catChartData}
              options={{ responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { display: false } } }}
              aria-label="Doughnut chart of violations by category"
            />
          </div>
        </Card>
      </div>

      {/* Revenue Trend */}
      <Card title="Revenue trend (Jan – Jun 2026)" icon={TrendingUp} style={{ marginBottom: '1.25rem' }}>
        <div className={styles.lineWrap}>
          {trendChartData && (
            <Line
              data={trendChartData}
              options={chartOpts(v => 'Rs.' + (v/1000000).toFixed(1) + 'M')}
              aria-label="Line chart of monthly revenue trend"
            />
          )}
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card title="Recent transactions" icon={FileText}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Reference #</th>
                <th>Category</th>
                <th>District</th>
                <th>Officer</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 6).map(tx => (
                <tr key={tx.id}>
                  <td className={styles.mono}>{tx.id}</td>
                  <td>{tx.category}</td>
                  <td>{tx.district}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{tx.officer}</td>
                  <td style={{ fontWeight: 600 }}>Rs. {tx.amount.toLocaleString()}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{tx.date}</td>
                  <td><StatusBadge status={tx.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default DashboardHome

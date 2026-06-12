import React, { useState, useEffect } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { FileBarChart2, Download } from 'lucide-react'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import { getAdminSummary, getDistrictCollections, getCategoryBreakdown, getMonthlyTrend } from '../services/api'
import styles from './DashboardHome.module.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

const fmt = n => 'Rs. ' + (n >= 1000000 ? (n/1000000).toFixed(2)+'M' : (n/1000).toFixed(0)+'K')

const ReportsPage = () => {
  const [summary, setSummary] = useState(null)
  const [districts, setDistricts] = useState([])
  const [categories, setCategories] = useState([])
  const [monthly, setMonthly] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAdminSummary(), getDistrictCollections(), getCategoryBreakdown(), getMonthlyTrend()])
      .then(([s, d, c, m]) => { setSummary(s); setDistricts(d); setCategories(c); setMonthly(m); setLoading(false) })
  }, [])

  if (loading) return <div className={styles.loadingWrap}><div className={styles.spinner} /><span>Loading...</span></div>

  const lineData = {
    labels: monthly.labels,
    datasets: [
      {
        label: 'Revenue',
        data: monthly.revenue,
        borderColor: '#1a3a6b',
        backgroundColor: 'rgba(26,58,107,0.07)',
        fill: true, tension: 0.4, pointRadius: 4,
      },
      {
        label: 'Fines × 1000',
        data: monthly.fines.map(f => f * 1000),
        borderColor: '#e8a020',
        backgroundColor: 'rgba(232,160,32,0.07)',
        fill: true, tension: 0.4, pointRadius: 4,
        borderDash: [5, 3],
      }
    ]
  }

  const handleExport = () => {
    const rows = [
      ['District', 'Revenue', 'Total Fines', 'Settled', 'Pending', 'Rate %'],
      ...districts.map(d => [d.name, d.revenue, d.fines, d.settled, d.pending, ((d.settled/d.fines)*100).toFixed(1)])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'district-report.csv'; a.click()
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Monthly and cumulative performance reports"
        action={
          <button
            onClick={handleExport}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', background: 'var(--color-primary)',
              color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer'
            }}
          >
            <Download size={14} /> Export CSV
          </button>
        }
      />

      {/* Summary boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '12px', marginBottom: '1.25rem' }}>
        {[
          { label: 'Total Revenue', value: fmt(summary.totalRevenue) },
          { label: 'Total Fines', value: summary.totalFines.toLocaleString() },
          { label: 'Settled', value: summary.settledFines.toLocaleString() },
          { label: 'Pending', value: summary.pendingFines.toLocaleString() },
          { label: 'Settlement Rate', value: ((summary.settledFines / summary.totalFines) * 100).toFixed(1) + '%' },
          { label: 'Avg Fine', value: fmt(Math.round(summary.totalRevenue / summary.totalFines)) },
        ].map(item => (
          <div key={item.label} style={{
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem'
          }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{item.label}</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)' }}>{item.value}</div>
          </div>
        ))}
      </div>

      <Card title="Revenue & fine count trend (Jan – Jun 2026)" icon={FileBarChart2} style={{ marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative', height: '220px' }}>
          <Line
            data={lineData}
            options={{
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { position: 'top', labels: { font: { size: 11 }, boxWidth: 12 } } },
              scales: {
                x: { ticks: { font: { size: 11 }, color: '#94a3b8' }, grid: { display: false } },
                y: { ticks: { font: { size: 11 }, color: '#94a3b8', callback: v => 'Rs.'+(v/1000000).toFixed(1)+'M' }, grid: { color: 'rgba(0,0,0,0.05)' } }
              }
            }}
            aria-label="Line chart of monthly revenue and fine count trend"
          />
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Card title="Top districts by revenue" icon={FileBarChart2}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>#</th><th>District</th><th>Revenue</th><th>Fines</th></tr></thead>
              <tbody>
                {districts.slice(0,5).map((d, i) => (
                  <tr key={d.name}>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>{i+1}</td>
                    <td style={{ fontWeight: 500 }}>{d.name}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{fmt(d.revenue)}</td>
                    <td>{d.fines}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Top categories by revenue" icon={FileBarChart2}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>#</th><th>Category</th><th>Revenue</th><th>Count</th></tr></thead>
              <tbody>
                {[...categories].sort((a,b) => b.revenue - a.revenue).slice(0,5).map((c, i) => (
                  <tr key={c.name}>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>{i+1}</td>
                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{fmt(c.revenue)}</td>
                    <td>{c.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ReportsPage

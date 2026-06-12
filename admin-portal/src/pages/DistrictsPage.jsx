import React, { useState, useEffect } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { Map } from 'lucide-react'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import { getDistrictCollections } from '../services/api'
import styles from './DashboardHome.module.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const fmt = n => 'Rs. ' + (n >= 1000000 ? (n/1000000).toFixed(2)+'M' : (n/1000).toFixed(0)+'K')

const DistrictsPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('revenue')

  useEffect(() => {
    getDistrictCollections().then(d => { setData(d); setLoading(false) })
  }, [])

  const sorted = [...data].sort((a, b) => b[sort] - a[sort])
  const maxRev = Math.max(...data.map(d => d.revenue), 1)

  const chartData = {
    labels: sorted.map(d => d.name),
    datasets: [
      { label: 'Settled', data: sorted.map(d => d.settled), backgroundColor: '#16803c', borderRadius: 4, stack: 'a' },
      { label: 'Pending', data: sorted.map(d => d.pending), backgroundColor: '#e8a020', borderRadius: 4, stack: 'a' },
    ]
  }

  if (loading) return <div className={styles.loadingWrap}><div className={styles.spinner} /><span>Loading...</span></div>

  return (
    <div>
      <PageHeader
        title="District Collections"
        subtitle="District-wise fine revenue and settlement breakdown"
      />

      <Card title="Fine count by district (stacked: settled vs pending)" icon={Map} style={{ marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative', width: '100%', height: '300px' }}>
          <Bar
            data={chartData}
            options={{
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { position: 'top', labels: { font: { size: 11 }, boxWidth: 12 } } },
              scales: {
                x: { ticks: { font: { size: 11 }, color: '#94a3b8' }, grid: { display: false } },
                y: { ticks: { font: { size: 11 }, color: '#94a3b8' }, grid: { color: 'rgba(0,0,0,0.05)' } }
              }
            }}
            aria-label="Stacked bar chart of settled and pending fines by district"
          />
        </div>
      </Card>

      <Card title="District summary table" icon={Map}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {['revenue','fines','settled','pending'].map(k => (
            <button
              key={k}
              onClick={() => setSort(k)}
              style={{
                padding: '4px 12px', fontSize: '11px', borderRadius: '99px', fontWeight: 500,
                border: '1px solid',
                borderColor: sort === k ? 'var(--color-primary)' : 'var(--color-border)',
                background: sort === k ? 'var(--color-primary)' : 'transparent',
                color: sort === k ? '#fff' : 'var(--color-text-muted)',
                cursor: 'pointer',
              }}
            >
              Sort: {k.charAt(0).toUpperCase() + k.slice(1)}
            </button>
          ))}
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>District</th>
                <th>Revenue</th>
                <th>Total Fines</th>
                <th>Settled</th>
                <th>Pending</th>
                <th>Settlement Rate</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((d, i) => {
                const rate = ((d.settled / d.fines) * 100).toFixed(1)
                return (
                  <tr key={d.name}>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{d.name}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{fmt(d.revenue)}</td>
                    <td>{d.fines.toLocaleString()}</td>
                    <td style={{ color: 'var(--color-success)' }}>{d.settled.toLocaleString()}</td>
                    <td style={{ color: 'var(--color-warning)' }}>{d.pending.toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '3px', height: '6px', overflow: 'hidden', minWidth: '60px' }}>
                          <div style={{ width: rate + '%', background: '#16803c', height: '100%', borderRadius: '3px' }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600, minWidth: '36px' }}>{rate}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default DistrictsPage

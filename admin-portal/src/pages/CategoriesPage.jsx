import React, { useState, useEffect } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import { Tag } from 'lucide-react'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import { getCategoryBreakdown } from '../services/api'
import styles from './DashboardHome.module.css'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const COLORS = ['#1a3a6b','#2251a3','#e8a020','#d85a30','#5b4ec7','#16803c']

const CategoriesPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const total = data.reduce((s, c) => s + c.count, 0)

  useEffect(() => {
    getCategoryBreakdown().then(d => { setData(d); setLoading(false) })
  }, [])

  const donutData = {
    labels: data.map(c => c.name),
    datasets: [{ data: data.map(c => c.count), backgroundColor: COLORS, borderWidth: 3, borderColor: '#fff' }]
  }

  const barData = {
    labels: data.map(c => c.name),
    datasets: [{
      label: 'Revenue (LKR)',
      data: data.map(c => c.revenue),
      backgroundColor: COLORS,
      borderRadius: 5,
      borderSkipped: false,
    }]
  }

  if (loading) return <div className={styles.loadingWrap}><div className={styles.spinner} /><span>Loading...</span></div>

  return (
    <div>
      <PageHeader title="Violation Categories" subtitle="Fine breakdown by violation type and revenue" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '12px', marginBottom: '1.25rem' }}>
        <Card title="Distribution by count" icon={Tag}>
          <div style={{ position: 'relative', width: '100%', height: '240px' }}>
            <Doughnut
              data={donutData}
              options={{ responsive: true, maintainAspectRatio: false, cutout: '62%', plugins: { legend: { display: false } } }}
              aria-label="Doughnut chart of violations by category count"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }}>
            {data.map((c, i) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '2px', background: COLORS[i], flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{c.name}</span>
                <span style={{ fontWeight: 600 }}>{((c.count/total)*100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Revenue by category" icon={Tag}>
          <div style={{ position: 'relative', width: '100%', height: '320px' }}>
            <Bar
              data={barData}
              options={{
                indexAxis: 'y',
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { font: { size: 11 }, color: '#94a3b8', callback: v => 'Rs.'+(v/1000).toFixed(0)+'K' }, grid: { color: 'rgba(0,0,0,0.05)' } },
                  y: { ticks: { font: { size: 11 }, color: '#94a3b8' }, grid: { display: false } }
                }
              }}
              aria-label="Horizontal bar chart of revenue by violation category"
            />
          </div>
        </Card>
      </div>

      <Card title="Category details" icon={Tag}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Fine Amount</th>
                <th>Count</th>
                <th>% of Total</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.map((c, i) => (
                <tr key={c.name}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: COLORS[i], flexShrink: 0 }} />
                      <span style={{ fontWeight: 500 }}>{c.name}</span>
                    </div>
                  </td>
                  <td>Rs. {c.fineAmount.toLocaleString()}</td>
                  <td style={{ fontWeight: 600 }}>{c.count.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '3px', height: '6px', minWidth: '60px', overflow: 'hidden' }}>
                        <div style={{ width: ((c.count/total)*100)+'%', background: COLORS[i], height: '100%', borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>{((c.count/total)*100).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Rs. {c.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default CategoriesPage

import React, { useState, useEffect } from 'react'
import { Search, List } from 'lucide-react'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import FilterBar from '../components/FilterBar'
import StatusBadge from '../components/StatusBadge'
import { getRecentTransactions } from '../services/api'
import styles from './DashboardHome.module.css'

const CATEGORIES = ['Speeding', 'No License', 'Illegal Parking', 'Drunk Driving', 'Using Phone', 'No Seatbelt']

const TransactionsPage = () => {
  const [filters, setFilters] = useState({ district: 'all', status: 'all', category: 'all', month: '2026-06' })
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getRecentTransactions(filters).then(d => { setData(d); setLoading(false) })
  }, [filters])

  const filtered = data.filter(tx =>
    tx.id.toLowerCase().includes(search.toLowerCase()) ||
    tx.category.toLowerCase().includes(search.toLowerCase()) ||
    tx.district.toLowerCase().includes(search.toLowerCase()) ||
    tx.officer.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle="All fine payment transactions with filtering and search"
      />

      <FilterBar filters={filters} onChange={setFilters} categories={CATEGORIES} />

      <Card title="Fine transactions" icon={List}>
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
          <input
            type="text"
            placeholder="Search by reference, category, district, officer…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '8px 12px 8px 32px',
              border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
              fontSize: '13px', outline: 'none', background: '#f8fafc', color: 'var(--color-text)'
            }}
          />
        </div>

        {loading ? (
          <div className={styles.loadingWrap} style={{ height: '200px' }}>
            <div className={styles.spinner} /><span>Loading...</span>
          </div>
        ) : (
          <>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              Showing {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
            </div>
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
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>No transactions found.</td></tr>
                  ) : filtered.map(tx => (
                    <tr key={tx.id}>
                      <td className={styles.mono}>{tx.id}</td>
                      <td>
                        <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>
                          {tx.category}
                        </span>
                      </td>
                      <td>{tx.district}</td>
                      <td style={{ color: 'var(--color-text-muted)' }}>{tx.officer}</td>
                      <td style={{ fontWeight: 700 }}>Rs. {tx.amount.toLocaleString()}</td>
                      <td style={{ color: 'var(--color-text-muted)' }}>{tx.date}</td>
                      <td><StatusBadge status={tx.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

export default TransactionsPage

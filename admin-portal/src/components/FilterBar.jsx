import React from 'react'
import { Filter } from 'lucide-react'
import styles from './FilterBar.module.css'

const FilterBar = ({ filters, onChange, districts, categories }) => (
  <div className={styles.bar}>
    <Filter size={14} className={styles.icon} aria-hidden="true" />
    <span className={styles.label}>Filter:</span>

    <select
      value={filters.district || 'all'}
      onChange={e => onChange({ ...filters, district: e.target.value })}
      className={styles.select}
      aria-label="Filter by district"
    >
      <option value="all">All Districts</option>
      {(districts || [
        'Colombo','Gampaha','Kandy','Kurunegala','Galle',
        'Jaffna','Matara','Ratnapura','Badulla','Anuradhapura'
      ]).map(d => <option key={d} value={d}>{d}</option>)}
    </select>

    {categories && (
      <select
        value={filters.category || 'all'}
        onChange={e => onChange({ ...filters, category: e.target.value })}
        className={styles.select}
        aria-label="Filter by category"
      >
        <option value="all">All Categories</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    )}

    <select
      value={filters.status || 'all'}
      onChange={e => onChange({ ...filters, status: e.target.value })}
      className={styles.select}
      aria-label="Filter by status"
    >
      <option value="all">All Status</option>
      <option value="paid">Paid</option>
      <option value="pending">Pending</option>
    </select>

    <input
      type="month"
      value={filters.month || '2026-06'}
      onChange={e => onChange({ ...filters, month: e.target.value })}
      className={styles.select}
      aria-label="Filter by month"
    />

    <button
      className={styles.resetBtn}
      onClick={() => onChange({ district: 'all', status: 'all', category: 'all', month: '2026-06' })}
    >
      Reset
    </button>
  </div>
)

export default FilterBar

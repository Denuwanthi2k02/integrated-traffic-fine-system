import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import styles from './KpiCard.module.css'

const KpiCard = ({ icon: Icon, label, value, sub, trend, trendUp, color = 'blue' }) => (
  <div className={`${styles.card} ${styles[color]}`}>
    <div className={styles.top}>
      <span className={styles.label}>{label}</span>
      {Icon && <div className={styles.iconWrap}><Icon size={15} aria-hidden="true" /></div>}
    </div>
    <div className={styles.value}>{value}</div>
    {(sub || trend !== undefined) && (
      <div className={styles.bottom}>
        {trend !== undefined && (
          <span className={trendUp ? styles.up : styles.down}>
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}% vs last month
          </span>
        )}
        {sub && !trend && <span className={styles.sub}>{sub}</span>}
      </div>
    )}
  </div>
)

export default KpiCard

import React from 'react'

const config = {
  paid:    { bg: '#dcfce7', color: '#15803d', label: 'Paid' },
  pending: { bg: '#fef3c7', color: '#b45309', label: 'Pending' },
  overdue: { bg: '#fee2e2', color: '#b91c1c', label: 'Overdue' },
}

const StatusBadge = ({ status }) => {
  const c = config[status] || config.pending
  return (
    <span style={{
      background: c.bg,
      color: c.color,
      fontSize: '11px',
      fontWeight: 600,
      padding: '3px 9px',
      borderRadius: '99px',
      whiteSpace: 'nowrap',
    }}>
      {c.label}
    </span>
  )
}

export default StatusBadge

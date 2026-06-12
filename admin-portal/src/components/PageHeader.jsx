import React from 'react'

const PageHeader = ({ title, subtitle, action }) => (
  <div style={{
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '1.25rem',
    flexWrap: 'wrap',
    gap: '10px',
  }}>
    <div>
      <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '2px' }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{subtitle}</p>
      )}
    </div>
    {action && <div>{action}</div>}
  </div>
)

export default PageHeader

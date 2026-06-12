import React from 'react'

const Card = ({ children, title, icon: Icon, style, titleAction }) => (
  <div style={{
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '14px',
    padding: '1.1rem 1.25rem',
    ...style,
  }}>
    {title && (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          {Icon && <Icon size={15} style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />}
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>{title}</h3>
        </div>
        {titleAction && <div>{titleAction}</div>}
      </div>
    )}
    {children}
  </div>
)

export default Card

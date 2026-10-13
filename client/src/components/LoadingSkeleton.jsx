import React from 'react';

export const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '2rem',
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
            height: '420px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              height: '220px',
              backgroundColor: 'var(--color-surface-soft)',
              animation: 'pulse 1.5s infinite ease-in-out',
            }}
          />
          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
            <div style={{ width: '40%', height: '14px', backgroundColor: 'var(--color-surface-soft)', borderRadius: '4px' }} />
            <div style={{ width: '80%', height: '22px', backgroundColor: 'var(--color-surface-soft)', borderRadius: '4px' }} />
            <div style={{ width: '50%', height: '14px', backgroundColor: 'var(--color-surface-soft)', borderRadius: '4px' }} />
            <div style={{ width: '100%', height: '40px', backgroundColor: 'var(--color-surface-soft)', borderRadius: '4px', marginTop: 'auto' }} />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.9; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

import React from 'react';
import { AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

export const AuthBanner = ({ type = 'error', message }) => {
  if (!message) return null;

  const isSuccess = type === 'success';

  // Handle both object { manglish, english } and string
  const manglishText = typeof message === 'object' ? message.manglish : message;
  const englishText = typeof message === 'object' ? message.english : null;

  return (
    <div
      role="alert"
      className="animate-fade-in"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.85rem',
        padding: '1rem 1.15rem',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1.5rem',
        border: `1.5px solid ${isSuccess ? '#B7E4C7' : '#F5C2C7'}`,
        backgroundColor: isSuccess ? '#F2FBF5' : '#FFF5F5',
        boxShadow: isSuccess
          ? '0 4px 14px rgba(46, 125, 50, 0.08)'
          : '0 4px 14px rgba(217, 72, 65, 0.08)',
        transition: 'var(--transition)',
      }}
    >
      <div
        style={{
          color: isSuccess ? '#2E7D32' : 'var(--color-error)',
          flexShrink: 0,
          marginTop: '2px',
        }}
      >
        {isSuccess ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />}
      </div>

      <div style={{ flex: 1 }}>
        {/* Manglish Headline */}
        <p
          style={{
            fontSize: '0.94rem',
            fontWeight: '700',
            color: isSuccess ? '#1B4D20' : '#842029',
            lineHeight: 1.45,
            marginBottom: englishText ? '0.2rem' : 0,
          }}
        >
          {manglishText}
        </p>

        {/* Supporting English Context */}
        {englishText && (
          <p
            style={{
              fontSize: '0.8rem',
              color: isSuccess ? '#2E7D32' : '#646E68',
              lineHeight: 1.4,
              opacity: 0.9,
            }}
          >
            {englishText}
          </p>
        )}
      </div>
    </div>
  );
};

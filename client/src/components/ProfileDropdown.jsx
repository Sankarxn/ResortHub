import React, { useEffect, useRef } from 'react';
import { User, HelpCircle, LogOut, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfileDropdown = ({ isOpen, onClose, onOpenInstructions, onLogout, user }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="animate-fade-in"
      style={{
        position: 'absolute',
        top: 'calc(100% + 10px)',
        right: 0,
        width: '260px',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)',
        zIndex: 500,
        overflow: 'hidden',
      }}
      role="menu"
      aria-orientation="vertical"
    >
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
        <p style={{ fontWeight: '700', color: 'var(--color-text-main)', fontSize: '0.95rem' }}>
          {user?.name || 'Member'}
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {user?.email || 'member@resorthub.com'}
        </p>
      </div>

      <div style={{ padding: '0.4rem 0' }}>
        {user?.role === 'admin' && (
          <button
            onClick={() => {
              onClose();
              navigate('/admin/dashboard');
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1.25rem',
              fontSize: '0.9rem',
              color: 'var(--color-primary)',
              fontWeight: '700',
              textAlign: 'left',
              transition: 'var(--transition)',
              backgroundColor: '#FAF5EB',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-soft)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FAF5EB')}
            role="menuitem"
          >
            <ShieldCheck size={18} color="var(--color-accent)" />
            <span>Admin Dashboard</span>
          </button>
        )}

        <button
          onClick={() => {
            onClose();
            navigate('/profile');
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1.25rem',
            fontSize: '0.9rem',
            color: 'var(--color-text-main)',
            textAlign: 'left',
            transition: 'var(--transition)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-soft)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          role="menuitem"
        >
          <User size={18} color="var(--color-primary)" />
          <span>My Profile</span>
        </button>

        <button
          onClick={() => {
            onClose();
            onOpenInstructions();
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1.25rem',
            fontSize: '0.9rem',
            color: 'var(--color-text-main)',
            textAlign: 'left',
            transition: 'var(--transition)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-soft)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          role="menuitem"
        >
          <HelpCircle size={18} color="var(--color-accent)" />
          <span>Instructions</span>
        </button>

        <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '0.35rem 0' }} />

        <button
          onClick={() => {
            onClose();
            onLogout();
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1.25rem',
            fontSize: '0.9rem',
            color: 'var(--color-error)',
            textAlign: 'left',
            transition: 'var(--transition)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FDEDEC')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          role="menuitem"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

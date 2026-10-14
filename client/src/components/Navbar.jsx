import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Palmtree, User as UserIcon, ChevronDown, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProfileDropdown } from './ProfileDropdown';
import { InstructionsModal } from './InstructionsModal';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(250, 248, 242, 0.94)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
          transition: 'var(--transition)',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
      
          <Link
            to="/rooms"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              color: 'var(--color-primary)',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-accent)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <Palmtree size={22} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.45rem',
                  fontWeight: '700',
                  lineHeight: '1.1',
                  letterSpacing: '-0.02em',
                  color: 'var(--color-primary)',
                }}
              >
                Resort<span style={{ color: 'var(--color-accent)' }}>Hub</span>
              </span>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-muted)' }}>
                Kannur, Kerala Rooms
              </span>
            </div>
          </Link>

          
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link
              to="/rooms"
              style={{
                fontWeight: '600',
                fontSize: '0.92rem',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Compass size={17} />
              <span>Explore Rooms & Suites</span>
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                style={{
                  fontWeight: '700',
                  fontSize: '0.92rem',
                  color: 'var(--color-accent)',
                  backgroundColor: 'rgba(23, 61, 51, 0.08)',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  border: '1px solid rgba(214, 167, 91, 0.35)',
                }}
              >
                <span>Admin Dashboard</span>
              </Link>
            )}
          </nav>

          {/* User Profile Area */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border)',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-surface-soft)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={16} />}
              </div>
              <span
                style={{
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  color: 'var(--color-text-main)',
                  maxWidth: '120px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.name || 'Explorer'}
              </span>
              <ChevronDown
                size={16}
                color="var(--color-text-muted)"
                style={{
                  transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>

            <ProfileDropdown
              isOpen={dropdownOpen}
              onClose={() => setDropdownOpen(false)}
              onOpenInstructions={() => setInstructionsOpen(true)}
              onLogout={logout}
              user={user}
            />
          </div>
        </div>
      </header>

      {/* Accessible Instructions Modal */}
      <InstructionsModal
        isOpen={instructionsOpen}
        onClose={() => setInstructionsOpen(false)}
      />
    </>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Palmtree,
  User as UserIcon,
  ChevronDown,
  Compass,
  Menu,
  X,
  ShieldCheck,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProfileDropdown } from './ProfileDropdown';
import { InstructionsModal } from './InstructionsModal';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  const navRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDesktopDropdownOpen(false);
  }, [location.pathname]);

  // Close menus on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
        setDesktopDropdownOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setDesktopDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <header
        ref={navRef}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 500,
          backgroundColor: 'rgba(250, 248, 242, 0.96)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
          transition: 'var(--transition)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '72px',
          }}
        >
          {/* Brand Logo & Name */}
          <Link
            to="/rooms"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              color: 'var(--color-primary)',
              textDecoration: 'none',
              flexShrink: 0,
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
                flexShrink: 0,
              }}
            >
              <Palmtree size={22} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.2rem, 3.5vw, 1.45rem)',
                  fontWeight: '700',
                  lineHeight: '1.1',
                  letterSpacing: '-0.02em',
                  color: 'var(--color-primary)',
                }}
              >
                Resort<span style={{ color: 'var(--color-accent)' }}>Hub</span>
              </span>
              <span
                className="hide-xs"
                style={{
                  fontSize: '0.65rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--color-text-muted)',
                }}
              >
                Kannur, Kerala Rooms
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="show-desktop-only"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
            }}
          >
            <Link
              to="/rooms"
              style={{
                fontWeight: location.pathname === '/rooms' ? '700' : '600',
                fontSize: '0.92rem',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.8rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor:
                  location.pathname === '/rooms' ? 'rgba(23, 61, 51, 0.06)' : 'transparent',
                transition: 'var(--transition)',
              }}
            >
              <Compass size={17} />
              <span>Explore Rooms</span>
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                style={{
                  fontWeight: '700',
                  fontSize: '0.92rem',
                  color: '#8A5D19',
                  backgroundColor: 'rgba(214, 167, 91, 0.18)',
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  border: '1px solid rgba(214, 167, 91, 0.45)',
                  transition: 'var(--transition)',
                }}
              >
                <ShieldCheck size={16} />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </nav>

          {/* Desktop User Profile Button & Dropdown */}
          <div className="show-desktop-only" style={{ position: 'relative' }}>
            <button
              onClick={() => setDesktopDropdownOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={desktopDropdownOpen}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border)',
                transition: 'var(--transition)',
                cursor: 'pointer',
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
                  transform: desktopDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>

            <ProfileDropdown
              isOpen={desktopDropdownOpen}
              onClose={() => setDesktopDropdownOpen(false)}
              onOpenInstructions={() => setInstructionsOpen(true)}
              onLogout={logout}
              user={user}
            />
          </div>

          {/* Mobile Actions: Compact Avatar + Hamburger Menu Button */}
          <div
            className="show-mobile-only"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '0.65rem',
            }}
          >
            {/* Quick Profile Icon on Mobile */}
            <Link
              to="/profile"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-surface-soft)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.9rem',
                border: '1px solid var(--color-border)',
                textDecoration: 'none',
              }}
              title="Go to Profile"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={16} />}
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: mobileMenuOpen ? 'var(--color-primary)' : '#FFFFFF',
                color: mobileMenuOpen ? '#FFFFFF' : 'var(--color-primary)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {mobileMenuOpen && (
          <div
            className="animate-slide-down"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: '#FFFFFF',
              borderBottom: '2px solid var(--color-border)',
              boxShadow: '0 12px 28px rgba(23, 61, 51, 0.14)',
              padding: '1.25rem 1rem 1.5rem',
              zIndex: 499,
              maxHeight: 'calc(100vh - 72px)',
              overflowY: 'auto',
            }}
          >
            {/* User Info Card in Drawer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '1rem',
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                border: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '1.15rem',
                  flexShrink: 0,
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={20} />}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontWeight: '700',
                    fontSize: '0.98rem',
                    color: 'var(--color-text-main)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user?.name || 'Explorer'}
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user?.email || 'member@resorthub.com'}
                </div>
                {user?.role === 'admin' ? (
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: 'rgba(214, 167, 91, 0.25)',
                      color: '#8A5D19',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      marginTop: '0.25rem',
                    }}
                  >
                    👑 Verified Administrator
                  </span>
                ) : (
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: 'rgba(23, 61, 51, 0.08)',
                      color: 'var(--color-primary)',
                      fontSize: '0.72rem',
                      fontWeight: '600',
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      marginTop: '0.25rem',
                    }}
                  >
                    Kannur Explorer
                  </span>
                )}
              </div>
            </div>

            {/* Mobile Nav Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link
                to="/rooms"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor:
                    location.pathname === '/rooms' ? 'rgba(23, 61, 51, 0.08)' : 'transparent',
                  color: 'var(--color-primary)',
                  fontWeight: location.pathname === '/rooms' ? '700' : '600',
                  fontSize: '0.96rem',
                  textDecoration: 'none',
                  transition: 'var(--transition)',
                }}
              >
                <Compass size={20} color="var(--color-primary)" />
                <span>Explore Rooms & Suites</span>
              </Link>

              {user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor:
                      location.pathname === '/admin/dashboard'
                        ? 'rgba(214, 167, 91, 0.22)'
                        : 'rgba(214, 167, 91, 0.1)',
                    color: '#8A5D19',
                    fontWeight: '700',
                    fontSize: '0.96rem',
                    textDecoration: 'none',
                    border: '1px solid rgba(214, 167, 91, 0.4)',
                    transition: 'var(--transition)',
                  }}
                >
                  <ShieldCheck size={20} color="#8A5D19" />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor:
                    location.pathname === '/profile' ? 'rgba(23, 61, 51, 0.08)' : 'transparent',
                  color: 'var(--color-text-main)',
                  fontWeight: location.pathname === '/profile' ? '700' : '600',
                  fontSize: '0.96rem',
                  textDecoration: 'none',
                  transition: 'var(--transition)',
                }}
              >
                <UserIcon size={20} color="var(--color-text-muted)" />
                <span>My Profile</span>
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setInstructionsOpen(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-main)',
                  fontWeight: '600',
                  fontSize: '0.96rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <HelpCircle size={20} color="var(--color-text-muted)" />
                <span>How ResortHub Works</span>
              </button>

              <div
                style={{
                  height: '1px',
                  backgroundColor: 'var(--color-border)',
                  margin: '0.5rem 0',
                }}
              />

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-error)',
                  fontWeight: '700',
                  fontSize: '0.96rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <LogOut size={20} color="var(--color-error)" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Accessible Instructions Modal */}
      <InstructionsModal
        isOpen={instructionsOpen}
        onClose={() => setInstructionsOpen(false)}
      />
    </>
  );
};

export default Navbar;

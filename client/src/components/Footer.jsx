import React from 'react';
import { Palmtree, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#112D26',
        color: '#EDE5D8',
        borderTop: '1px solid rgba(214, 167, 91, 0.2)',
        padding: 'clamp(2rem, 5vw, 3rem) 0 1.75rem',
        marginTop: 'auto',
      }}
    >
      <div className="container" style={{ maxWidth: '1240px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
            paddingBottom: '1.75rem',
            borderBottom: '1px solid rgba(226, 219, 208, 0.12)',
          }}
        >
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-primary)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Palmtree size={20} />
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  letterSpacing: '-0.01em',
                }}
              >
                Resort<span style={{ color: 'var(--color-accent)' }}>Hub</span>
              </span>
              <p style={{ fontSize: '0.75rem', color: '#B3BDB7', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Kannur, Kerala Stays & Suites
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.9rem' }}>
            <Link to="/rooms" style={{ color: '#EDE5D8', transition: 'var(--transition)' }}>
              Rooms & Suites
            </Link>
            <Link to="/profile" style={{ color: '#EDE5D8', transition: 'var(--transition)' }}>
              My Profile
            </Link>
          </div>
        </div>

    
        <div
          style={{
            paddingTop: '1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.88rem',
            color: '#B3BDB7',
          }}
        >
          <p>
            © {new Date().getFullYear()} ResortHub. Handcrafted Stays in God's Own Country.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Crafted with</span>
            <Heart size={15} color="#D94841" fill="#D94841" />
            <span>by <strong style={{ color: 'var(--color-accent)', fontWeight: '700' }}>Sankaran</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

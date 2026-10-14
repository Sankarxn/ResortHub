import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Palmtree, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthBanner } from '../components/AuthBanner';
import { authMessages, getManglishErrorMessage } from '../utils/authMessages';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg(authMessages.missingLoginFields);
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate('/rooms');
    } catch (err) {
      setErrorMsg(getManglishErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      {/* Left Column: Premium Photography Showcase (Kannur, Kerala) */}
      <div
        style={{
          flex: 1.1,
          position: 'relative',
          backgroundImage: `linear-gradient(rgba(15, 39, 32, 0.48), rgba(15, 39, 32, 0.8)), url('https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '4rem',
          color: '#FFFFFF',
        }}
        className="hide-mobile"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Palmtree size={24} />
          </div>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: '700' }}>
            Resort<span style={{ color: 'var(--color-accent)' }}>Hub</span>
          </span>
        </div>

        <div style={{ maxWidth: '540px' }}>
          <span
            style={{
              display: 'inline-block',
              color: 'var(--color-accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '1rem',
            }}
          >
            Malabar Coastal Collection • Kannur, Kerala
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.8rem',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
            }}
          >
            Wake up to Arabian Sea waves & swaying palms.
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#E2DBD0', lineHeight: 1.6 }}>
            Browse verified beachfront villas at Muzhappilangad, colonial cliff suites at Payyambalam, and tranquil backwater lodges at Kavvayi with seamless Google Maps exploration.
          </p>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#B3BDB7' }}>
          © {new Date().getFullYear()} ResortHub Kannur. Handcrafted Kerala Hospitality.
        </div>
      </div>

      {/* Right Column: Clean Login Form */}
      <div
        style={{
          flex: 0.9,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(1.25rem, 4vw, 2.5rem) clamp(0.75rem, 3vw, 1.5rem)',
        }}
      >
        <div
          style={{
            maxWidth: '440px',
            width: '100%',
            backgroundColor: '#FFFFFF',
            padding: 'clamp(1.75rem, 5vw, 3rem) clamp(1.25rem, 4vw, 2.5rem)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--color-border)',
          }}
        >
          {/* Mobile-Only Brand Header */}
          <div
            className="show-mobile-only"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '0.65rem',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-accent)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Palmtree size={20} />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                fontWeight: '700',
                color: 'var(--color-primary)',
              }}
            >
              Resort<span style={{ color: 'var(--color-accent)' }}>Hub</span>
            </span>
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <span
              style={{
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-accent)',
                fontWeight: '700',
              }}
            >
              Namaskaram & Welcome
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2rem',
                color: 'var(--color-primary)',
                marginTop: '0.25rem',
                marginBottom: '0.5rem',
              }}
            >
              Sign into ResortHub
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Sign in to explore curated stays, suites, and eco-lodges across Kannur.
            </p>
          </div>

          {/* Friendly Manglish Banner */}
          <AuthBanner type="error" message={errorMsg} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: 'var(--color-text-main)',
                  marginBottom: '0.4rem',
                }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)',
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="traveler@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    transition: 'var(--transition)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-main)' }}>
                  Password
                </label>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)',
                  }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.6rem 0.75rem 2.6rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    transition: 'var(--transition)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)',
                    padding: '4px',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                marginTop: '0.5rem',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Entering ResortHub...' : 'Sign In & Explore Kannur'}
            </button>
          </form>

          <div
            style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--color-border)',
              textAlign: 'center',
              fontSize: '0.9rem',
              color: 'var(--color-text-muted)',
            }}
          >
            New to ResortHub?{' '}
            <Link
              to="/register"
              style={{
                color: 'var(--color-primary)',
                fontWeight: '700',
                textDecoration: 'underline',
              }}
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

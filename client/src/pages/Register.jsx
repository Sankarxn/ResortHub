import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Palmtree, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthBanner } from '../components/AuthBanner';
import { authMessages, getManglishErrorMessage } from '../utils/authMessages';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Missing field check
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMsg(authMessages.missingFields);
      return;
    }

    // Basic email format check
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErrorMsg(authMessages.invalidEmail);
      return;
    }

    // Weak password check
    if (password.length < 8) {
      setErrorMsg(authMessages.weakPassword);
      return;
    }

    // Password mismatch check
    if (password !== confirmPassword) {
      setErrorMsg(authMessages.passwordMismatch);
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password);
      setSuccessMsg(authMessages.registerSuccess);
      setTimeout(() => {
        navigate('/login');
      }, 1600);
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
      {/* Left Column: Premium Photography Showcase (Kerala Architecture & Greenery) */}
      <div
        style={{
          flex: 1.1,
          position: 'relative',
          backgroundImage: `linear-gradient(rgba(15, 39, 32, 0.52), rgba(15, 39, 32, 0.82)), url('https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=85')`,
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
            Join ResortHub Kannur
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.8rem',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
            }}
          >
            Immerse yourself in North Malabar’s coastal serenity.
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#E2DBD0', lineHeight: 1.6 }}>
            Create an account to browse room specifications, traditional Ayurvedic health retreats, Theyyam cultural lodges, and direct Google Maps access across Kannur, Kerala.
          </p>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#B3BDB7' }}>
          © {new Date().getFullYear()} ResortHub. Private, authentic & community-focused stays in Kerala.
        </div>
      </div>

      {/* Right Column: Clean Registration Form */}
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
            maxWidth: '460px',
            width: '100%',
            backgroundColor: '#FFFFFF',
            padding: 'clamp(1.75rem, 5vw, 2.8rem) clamp(1.25rem, 4vw, 2.4rem)',
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
              Start Exploring
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.85rem',
                color: 'var(--color-primary)',
                marginTop: '0.25rem',
                marginBottom: '0.4rem',
              }}
            >
              Create your account
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
              Sign up to discover the best resorts, beach chalets, and heritage stays in Kannur.
            </p>
          </div>

          {/* Friendly Manglish Banners */}
          <AuthBanner type="error" message={errorMsg} />
          <AuthBanner type="success" message={successMsg} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Santhosh Kumar"
                  required
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem 0.7rem 2.6rem',
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
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="traveler@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem 0.7rem 2.6rem',
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
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
                Password (min. 8 characters)
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  style={{
                    width: '100%',
                    padding: '0.7rem 2.6rem 0.7rem 2.6rem',
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
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', padding: '4px' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  style={{
                    width: '100%',
                    padding: '0.7rem 2.6rem 0.7rem 2.6rem',
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
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--color-border)',
              textAlign: 'center',
              fontSize: '0.88rem',
              color: 'var(--color-text-muted)',
            }}
          >
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '700', textDecoration: 'underline' }}>
              Sign In
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

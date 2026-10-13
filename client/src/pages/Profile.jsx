import { User, Mail, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        <Link
          to="/rooms"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: 'var(--color-primary)',
            fontSize: '0.9rem',
            fontWeight: '600',
            marginBottom: '2rem',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Rooms</span>
        </Link>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden',
          }}
        >
          {/* Header Profile Banner */}
          <div
            style={{
              backgroundColor: 'var(--color-primary)',
              padding: '3rem 2.5rem',
              color: '#FFFFFF',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: '700',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : <User size={34} />}
              </div>
              <div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--color-accent)',
                    fontWeight: '600',
                  }}
                >
                  Kannur Explorer • Verified Member
                </span>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', lineHeight: 1.2, marginTop: '0.2rem' }}>
                  {user?.name || 'Explorer'}
                </h1>
                <p style={{ fontSize: '0.9rem', color: '#EDE5D8' }}>
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details List */}
          <div style={{ padding: '2.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
              Traveler Profile
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ color: 'var(--color-primary)' }}><User size={20} /></div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Full Name</div>
                  <div style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>{user?.name}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ color: 'var(--color-primary)' }}><Mail size={20} /></div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Email Address</div>
                  <div style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>{user?.email}</div>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '2rem',
                padding: '1rem',
                backgroundColor: '#FAF5EB',
                border: '1px solid #DFCEAA',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
              }}
            >
              <ShieldCheck size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-main)' }}>
                Your account is active for exploring handpicked resorts, eco-lodges, and backwater stays across Kannur, Kerala.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

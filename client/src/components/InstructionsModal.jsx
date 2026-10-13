import React, { useEffect, useRef } from 'react';
import { X, Search, Compass, MapPin, Info, ShieldCheck, Waves, Sparkles } from 'lucide-react';

export const InstructionsModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 39, 32, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="instructions-title"
    >
      <div
        ref={modalRef}
        className="animate-fade-in"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '640px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
          padding: '2.2rem',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            color: 'var(--color-text-muted)',
            padding: '0.4rem',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--color-border)',
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(23, 61, 51, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
            }}
          >
            <Compass size={26} />
          </div>
          <div>
            <h2 id="instructions-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-primary)' }}>
              How to Discover Stays in Kannur, Kerala
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Your curated guide to exploring Malabar coastlines, backwaters & hill resorts
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--color-accent)', marginTop: '2px' }}><Search size={20} /></div>
            <div>
              <h4 style={{ fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '0.2rem' }}>
                Searching by Local Kannur Destinations
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                Filter properties by popular locales including <strong>Muzhappilangad Beach</strong>, <strong>Payyambalam</strong>, <strong>Kavvayi Backwaters</strong>, <strong>Paithalmala Hills</strong>, and <strong>Thalassery</strong>.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--color-primary)', marginTop: '2px' }}><Info size={20} /></div>
            <div>
              <h4 style={{ fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '0.2rem' }}>
                Authentic Malabar Architecture & Amenities
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                Each property features traditional Kerala architecture (such as <em>Nalukettu</em> courtyards, laterite stone, wooden verandas), Ayurvedic consultations, Malabar culinary dishes, and direct sea/backwater views.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ color: '#D94841', marginTop: '2px' }}><MapPin size={20} /></div>
            <div>
              <h4 style={{ fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '0.2rem' }}>
                Verified Google Maps Navigation
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                Clicking <strong>"View on Google Maps"</strong> directly opens the verified geolocation in Kannur, providing instant driving routes and satellite previews without needing third-party API keys.
              </p>
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--color-surface-soft)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--color-accent)',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
              marginTop: '0.5rem',
            }}
          >
            <ShieldCheck size={20} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-main)' }}>
              <strong>Notice:</strong> ResortHub is an informational discovery catalog for Kerala travelers. We do not charge booking fees or handle financial transactions. Prices and availability are indicative demonstration estimates.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.75rem', fontSize: '0.92rem' }}
          >
            Start Exploring Kannur
          </button>
        </div>
      </div>
    </div>
  );
};

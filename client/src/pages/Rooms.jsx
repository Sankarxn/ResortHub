import React, { useState, useEffect, useMemo } from 'react';
import { BedDouble, Users, CheckCircle, ExternalLink, Search, X, Sparkles, MapPin } from 'lucide-react';
import { resortService } from '../services/api';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const Rooms = () => {
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = await resortService.getAllResorts();
        setResorts(data);
      } catch (err) {
        console.error('Failed to load rooms', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Collect all nested rooms from all resorts with their parent resort details
  const allRooms = useMemo(() => {
    return resorts.flatMap((resort) =>
      (resort.rooms || []).map((room) => ({
        ...room,
        resortId: resort.id || resort._id,
        resortName: resort.name,
        resortLocation: resort.location,
        googleMapsUrl: resortService.getGoogleMapsUrl(resort),
      }))
    );
  }, [resorts]);

  // Filter rooms by search term (room name, resort name, or location)
  const filteredRooms = useMemo(() => {
    if (!searchTerm.trim()) return allRooms;
    const term = searchTerm.toLowerCase().trim();
    return allRooms.filter(
      (room) =>
        room.name.toLowerCase().includes(term) ||
        room.resortName.toLowerCase().includes(term) ||
        room.resortLocation.toLowerCase().includes(term)
    );
  }, [allRooms, searchTerm]);

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: 'clamp(3rem, 6vw, 4.5rem) 1rem clamp(2rem, 5vw, 3.5rem)',
          backgroundImage: `linear-gradient(rgba(15, 39, 32, 0.78), rgba(15, 39, 32, 0.9)), url('https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#FFFFFF',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '820px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(214, 167, 91, 0.2)',
              border: '1px solid rgba(214, 167, 91, 0.45)',
              color: 'var(--color-accent)',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: 'clamp(0.74rem, 2vw, 0.84rem)',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={14} />
            <span>Curated Accommodations • Kannur, Kerala</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.75rem, 4.5vw, 3.2rem)',
              lineHeight: 1.18,
              marginBottom: '1rem',
              fontWeight: '600',
            }}
          >
            Find Your Ideal Room & Suite
          </h1>
          <p
            style={{
              fontSize: 'clamp(0.92rem, 2vw, 1.08rem)',
              color: '#EDE5D8',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 2rem',
            }}
          >
            Browse private beach chalets, wooden lofts, and heritage villas available across Kannur. Check room capacities, amenities, and explore locations on Google Maps.
          </p>

          {/* Search Box */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: '0.4rem 0.4rem 0.4rem 1rem',
              display: 'flex',
              alignItems: 'center',
              boxShadow: 'var(--shadow-xl)',
              maxWidth: '650px',
              margin: '0 auto',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <Search size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginRight: '0.5rem' }} />
            <input
              type="text"
              placeholder="Search by room, resort, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                minWidth: 0,
                border: 'none',
                outline: 'none',
                fontSize: '0.95rem',
                color: 'var(--color-text-main)',
                backgroundColor: 'transparent',
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  padding: '0.4rem',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
            <button
              className="btn btn-primary"
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                marginLeft: '0.35rem',
                fontSize: '0.88rem',
                flexShrink: 0,
              }}
              onClick={() => {}}
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Rooms Grid Section */}
      <div className="container" style={{ marginTop: '3rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <span style={{ fontWeight: '700', fontSize: '1.15rem', color: 'var(--color-primary)' }}>
            {filteredRooms.length} {filteredRooms.length === 1 ? 'Room' : 'Rooms'} Available
          </span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="btn btn-outline"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
            >
              Show All Rooms
            </button>
          )}
        </div>

        {loading ? (
          <LoadingSkeleton count={6} />
        ) : filteredRooms.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
              gap: 'clamp(1.25rem, 3vw, 2rem)',
            }}
          >
            {filteredRooms.map((room, idx) => (
              <article
                key={room.id || idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.borderColor = '#C9C0B3';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              >
                <div style={{ height: '220px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src={room.imageUrl || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'}
                    alt={room.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                </div>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                    <MapPin size={14} color="var(--color-accent)" />
                    <span>{room.resortLocation}</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    {room.resortName}
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>
                    {room.name}
                  </h3>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                      <Users size={15} color="var(--color-accent)" />
                      <span>Max {room.capacity} Guests</span>
                    </div>
                    {room.pricePerNight && (
                      <span style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--color-primary)' }}>
                        ₹{room.pricePerNight.toLocaleString()}<span style={{ fontSize: '0.8rem', fontWeight: '400', color: 'var(--color-text-muted)' }}>/night</span>
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {room.description}
                  </p>

                  {room.amenities && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                      {room.amenities.map((amenity, i) => (
                        <span
                          key={i}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.75rem',
                            backgroundColor: 'var(--color-surface-soft)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          <CheckCircle size={11} color="var(--color-primary)" />
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                    <a
                      href={room.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-maps"
                      style={{ width: '100%', justifyContent: 'center' }}
                      title="View Resort Location on Google Maps"
                    >
                      <ExternalLink size={15} />
                      <span>View on Google Maps</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: '4rem 2rem',
              textAlign: 'center',
              border: '1px solid var(--color-border)',
              maxWidth: '520px',
              margin: '3rem auto',
            }}
          >
            <BedDouble size={48} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              No Rooms Found
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              No rooms match "{searchTerm}". Try searching by room type (e.g. Villa, Suite) or location.
            </p>
            <button onClick={() => setSearchTerm('')} className="btn btn-primary">
              Show All Available Rooms
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Building2,
  BedDouble,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  AlertCircle,
  CheckCircle,
  Users,
  Image as ImageIcon,
  DollarSign,
  MapPin,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminService, resortService } from '../services/api';

export const AdminDashboard = () => {
  const { user } = useAuth();

  // Dashboard Data States
  const [stats, setStats] = useState({ totalResorts: 0, totalRooms: 0, resorts: [] });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [feedbackToast, setFeedbackToast] = useState(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResortFilter, setSelectedResortFilter] = useState('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);

  // Form State
  const initialFormData = {
    resortId: '',
    name: '',
    description: '',
    capacity: 2,
    pricePerNight: '',
    imageUrl: '',
    amenities: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-dismiss toast
  useEffect(() => {
    if (feedbackToast) {
      const timer = setTimeout(() => {
        setFeedbackToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedbackToast]);

  // Load Dashboard Data
  const loadDashboardData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);
      setErrorMessage(null);

      const [statsData, roomsData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getRooms(),
      ]);

      setStats(statsData);
      setRooms(roomsData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setErrorMessage(err.message || 'Failed to load admin dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Filtered rooms list
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch =
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.resortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(room.amenities) &&
          room.amenities.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchesResort =
        selectedResortFilter === 'ALL' || room.resortId === selectedResortFilter;

      return matchesSearch && matchesResort;
    });
  }, [rooms, searchTerm, selectedResortFilter]);

  // Form Validation
  const validateForm = (isEdit = false) => {
    const errors = {};
    if (!isEdit && !formData.resortId) {
      errors.resortId = 'Please select a parent resort.';
    }
    if (!formData.name.trim()) {
      errors.name = 'Room name or type is required.';
    }
    if (!formData.description.trim()) {
      errors.description = 'Room description is required.';
    }
    const cap = Number(formData.capacity);
    if (isNaN(cap) || cap < 1) {
      errors.capacity = 'Capacity must be at least 1 guest.';
    }
    if (formData.pricePerNight !== '' && formData.pricePerNight !== null) {
      const price = Number(formData.pricePerNight);
      if (isNaN(price) || price < 0) {
        errors.pricePerNight = 'Price per night must be a valid positive number.';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open Add Room Modal
  const handleOpenAddModal = () => {
    setFormData({
      ...initialFormData,
      resortId: stats.resorts.length > 0 ? (stats.resorts[0]._id || stats.resorts[0].id) : '',
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Open Edit Room Modal
  const handleOpenEditModal = (room) => {
    setActiveRoom(room);
    setFormData({
      resortId: room.resortId,
      name: room.name || '',
      description: room.description || '',
      capacity: room.capacity || 2,
      pricePerNight: room.pricePerNight !== undefined && room.pricePerNight !== null ? room.pricePerNight : '',
      imageUrl: room.imageUrl || '',
      amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : '',
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Open Delete Confirmation Modal
  const handleOpenDeleteModal = (room) => {
    setActiveRoom(room);
    setIsDeleteModalOpen(true);
  };

  // Handle Add Room Submit
  const handleAddRoomSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(false)) return;

    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        capacity: Number(formData.capacity),
        pricePerNight: formData.pricePerNight === '' ? null : Number(formData.pricePerNight),
        imageUrl: formData.imageUrl.trim(),
        amenities: formData.amenities
          ? formData.amenities.split(',').map((a) => a.trim()).filter(Boolean)
          : [],
      };

      await adminService.addRoom(formData.resortId, payload);

      setFeedbackToast({
        type: 'success',
        title: 'Room Added Successfully! 🎉',
        subtitle: 'Pwoli! Puthiya room resort-il create aayi kazhinju.',
      });

      setIsAddModalOpen(false);
      setFormData(initialFormData);
      await loadDashboardData(true);
    } catch (err) {
      console.error('Failed to add room:', err);
      setFeedbackToast({
        type: 'error',
        title: 'Failed to Add Room',
        subtitle: err.message || 'Server error occurred while creating room.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Room Submit
  const handleEditRoomSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(true)) return;
    if (!activeRoom) return;

    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        capacity: Number(formData.capacity),
        pricePerNight: formData.pricePerNight === '' ? null : Number(formData.pricePerNight),
        imageUrl: formData.imageUrl.trim(),
        amenities: formData.amenities
          ? formData.amenities.split(',').map((a) => a.trim()).filter(Boolean)
          : [],
      };

      const targetRoomId = activeRoom._id || activeRoom.roomId || activeRoom.id;
      await adminService.updateRoom(activeRoom.resortId, targetRoomId, payload);

      setFeedbackToast({
        type: 'success',
        title: 'Room Updated Successfully! ✨',
        subtitle: 'Room details vijayakaramaayi update cheythu!',
      });

      setIsEditModalOpen(false);
      setActiveRoom(null);
      await loadDashboardData(true);
    } catch (err) {
      console.error('Failed to update room:', err);
      setFeedbackToast({
        type: 'error',
        title: 'Failed to Update Room',
        subtitle: err.message || 'Server error occurred while updating room.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Room Confirm
  const handleDeleteRoomConfirm = async () => {
    if (!activeRoom) return;

    try {
      setIsSubmitting(true);
      const targetRoomId = activeRoom._id || activeRoom.roomId || activeRoom.id;
      await adminService.deleteRoom(activeRoom.resortId, targetRoomId);

      setFeedbackToast({
        type: 'success',
        title: 'Room Deleted 🗑️',
        subtitle: 'Selected room successfully removed from inventory.',
      });

      setIsDeleteModalOpen(false);
      setActiveRoom(null);
      await loadDashboardData(true);
    } catch (err) {
      console.error('Failed to delete room:', err);
      setFeedbackToast({
        type: 'error',
        title: 'Failed to Delete Room',
        subtitle: err.message || 'Could not delete room from resort.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', backgroundColor: 'var(--color-bg)', paddingBottom: '5rem' }}>
      {/* Toast Notification Banner */}
      {feedbackToast && (
        <div
          style={{
            position: 'fixed',
            top: '84px',
            right: '24px',
            zIndex: 9999,
            maxWidth: '420px',
            backgroundColor: feedbackToast.type === 'success' ? '#FFFFFF' : '#FFF5F5',
            borderLeft: `5px solid ${feedbackToast.type === 'success' ? 'var(--color-success)' : 'var(--color-error)'}`,
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem',
            animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {feedbackToast.type === 'success' ? (
            <CheckCircle size={22} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
          ) : (
            <AlertCircle size={22} color="var(--color-error)" style={{ flexShrink: 0, marginTop: '2px' }} />
          )}
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-text-main)', marginBottom: '0.2rem' }}>
              {feedbackToast.title}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
              {feedbackToast.subtitle}
            </p>
          </div>
          <button
            onClick={() => setFeedbackToast(null)}
            style={{ color: 'var(--color-text-muted)', padding: '2px', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Admin Dashboard Header */}
      <section
        style={{
          backgroundColor: 'var(--color-primary)',
          color: '#FFFFFF',
          padding: '3rem 0 2.75rem',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(214, 167, 91, 0.2)',
                  border: '1px solid rgba(214, 167, 91, 0.4)',
                  color: 'var(--color-accent)',
                  padding: '0.35rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.85rem',
                }}
              >
                <ShieldCheck size={14} />
                <span>Verified Admin Portal</span>
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                  fontWeight: '600',
                  lineHeight: 1.2,
                  marginBottom: '0.5rem',
                }}
              >
                ResortHub Admin Dashboard
              </h1>
              <p style={{ color: 'rgba(255, 255, 255, 0.78)', fontSize: '0.98rem', maxWidth: '600px' }}>
                Welcome back, {user?.name || 'Administrator'}! Manage room accommodations, monitor resort inventory,
                and update suite details.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => loadDashboardData(true)}
                disabled={refreshing || loading}
                className="btn btn-outline"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                  fontSize: '0.88rem',
                  padding: '0.65rem 1rem',
                }}
              >
                <RefreshCw size={16} className={refreshing ? 'spin-icon' : ''} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>

              <button
                onClick={handleOpenAddModal}
                className="btn btn-accent"
                style={{
                  padding: '0.65rem 1.3rem',
                  fontSize: '0.92rem',
                  fontWeight: '700',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <Plus size={18} />
                <span>Add New Room</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container" style={{ marginTop: '2rem' }}>
        {/* Error Banner */}
        {errorMessage && (
          <div
            style={{
              backgroundColor: '#FDF2F2',
              border: '1px solid #F87171',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              color: 'var(--color-error)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.92rem', fontWeight: '500' }}>{errorMessage}</span>
            </div>
            <button
              onClick={() => loadDashboardData(true)}
              className="btn btn-primary"
              style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          {/* Card 1: Total Resorts */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(23, 61, 51, 0.08)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Building2 size={28} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Total Resorts
              </span>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: 'var(--color-primary)',
                  lineHeight: 1.1,
                  marginTop: '0.2rem',
                }}
              >
                {loading ? '...' : stats.totalResorts}
              </div>
            </div>
          </div>

          {/* Card 2: Total Rooms */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(214, 167, 91, 0.15)',
                color: '#9E742E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <BedDouble size={28} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Total Rooms Active
              </span>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: 'var(--color-primary)',
                  lineHeight: 1.1,
                  marginTop: '0.2rem',
                }}
              >
                {loading ? '...' : stats.totalRooms}
              </div>
            </div>
          </div>
        </div>

        {/* Resorts Room Count Overview */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-primary)' }}>
                Resorts Breakdown
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                Summary of room capacity allocated per resort destination.
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {stats.resorts.map((res, index) => {
              const resortKey = res._id || res.id || `resort-${index}`;
              return (
                <div
                  key={resortKey}
                  style={{
                  padding: '1rem 1.15rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: '700',
                      fontSize: '0.94rem',
                      color: 'var(--color-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {res.name}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.8rem',
                      color: 'var(--color-text-muted)',
                      marginTop: '0.2rem',
                    }}
                  >
                    <MapPin size={12} />
                    <span>{res.location || 'Kannur'}</span>
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: 'rgba(23, 61, 51, 0.1)',
                    color: 'var(--color-primary)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    flexShrink: 0,
                  }}
                >
                  {res.roomCount} {res.roomCount === 1 ? 'Room' : 'Rooms'}
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {/* Room Management Section */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
          }}
        >
          {/* Table Header & Controls */}
          <div
            style={{
              padding: '1.5rem',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-primary)' }}>
                Room Inventory Management
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                Search, inspect, edit, or remove room configurations across all resorts.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              {/* Search Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.55rem 0.85rem',
                  minWidth: '240px',
                }}
              >
                <Search size={16} color="var(--color-text-muted)" />
                <input
                  type="text"
                  placeholder="Search rooms, amenities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.88rem',
                  }}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} style={{ color: 'var(--color-text-muted)' }}>
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Resort Filter Dropdown */}
              <select
                value={selectedResortFilter}
                onChange={(e) => setSelectedResortFilter(e.target.value)}
                style={{
                  padding: '0.55rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg)',
                  color: 'var(--color-text-main)',
                  fontWeight: '500',
                  outline: 'none',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                }}
              >
                <option value="ALL">All Resorts ({rooms.length})</option>
                {stats.resorts.map((r, index) => {
                  const rId = r._id || r.id || `filter-resort-${index}`;
                  return (
                    <option key={rId} value={rId}>
                      {r.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Rooms Table */}
          {loading ? (
            <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <RefreshCw size={28} className="spin-icon" style={{ margin: '0 auto 1rem', color: 'var(--color-primary)' }} />
              <p style={{ fontWeight: '600' }}>Loading resort accommodations...</p>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
              <BedDouble size={44} style={{ margin: '0 auto 1rem', color: 'var(--color-surface-soft)' }} />
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                No Rooms Found
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                {searchTerm || selectedResortFilter !== 'ALL'
                  ? 'No room listings match your search criteria. Try modifying your filter.'
                  : 'No room listings have been added yet. Click "Add New Room" above to get started.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedResortFilter('ALL');
                  }}
                  className="btn btn-outline"
                  style={{ fontSize: '0.85rem' }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
                <thead>
                  <tr
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      borderBottom: '1px solid var(--color-border)',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      color: 'var(--color-text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    <th style={{ padding: '1rem 1.25rem' }}>Room & Resort</th>
                    <th style={{ padding: '1rem 1rem' }}>Capacity</th>
                    <th style={{ padding: '1rem 1rem' }}>Price / Night</th>
                    <th style={{ padding: '1rem 1rem' }}>Key Amenities</th>
                    <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.map((room, index) => {
                    const roomKey = room._id || room.roomId || room.id || `room-${index}`;
                    return (
                      <tr
                        key={roomKey}
                      style={{
                        borderBottom: '1px solid var(--color-border)',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(23, 61, 51, 0.02)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Room & Resort Info */}
                      <td style={{ padding: '1.15rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div
                            style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: 'var(--radius-md)',
                              overflow: 'hidden',
                              backgroundColor: 'var(--color-surface-soft)',
                              flexShrink: 0,
                            }}
                          >
                            <img
                              src={
                                room.imageUrl ||
                                'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'
                              }
                              alt={room.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src =
                                  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80';
                              }}
                            />
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '0.98rem' }}>
                              {room.name}
                            </div>
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                fontSize: '0.8rem',
                                color: 'var(--color-accent)',
                                fontWeight: '600',
                                marginTop: '0.15rem',
                              }}
                            >
                              <Building2 size={12} />
                              <span>{room.resortName}</span>
                            </div>
                            <p
                              style={{
                                fontSize: '0.8rem',
                                color: 'var(--color-text-muted)',
                                maxWidth: '300px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                marginTop: '0.2rem',
                              }}
                            >
                              {room.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Capacity */}
                      <td style={{ padding: '1.15rem 1rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem' }}>
                          <Users size={16} color="var(--color-text-muted)" />
                          <span style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>
                            {room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}
                          </span>
                        </div>
                      </td>

                      {/* Price Per Night */}
                      <td style={{ padding: '1.15rem 1rem' }}>
                        {room.pricePerNight ? (
                          <div style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '0.95rem' }}>
                            ₹{room.pricePerNight.toLocaleString('en-IN')}
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '400' }}>
                              {' '}/ night
                            </span>
                          </div>
                        ) : (
                          <span
                            style={{
                              fontSize: '0.82rem',
                              color: 'var(--color-text-muted)',
                              backgroundColor: 'var(--color-bg)',
                              padding: '0.2rem 0.6rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--color-border)',
                            }}
                          >
                            Package Rate
                          </span>
                        )}
                      </td>

                      {/* Amenities */}
                      <td style={{ padding: '1.15rem 1rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', maxWidth: '240px' }}>
                          {Array.isArray(room.amenities) && room.amenities.length > 0 ? (
                            room.amenities.slice(0, 3).map((amenity, idx) => (
                              <span
                                key={idx}
                                style={{
                                  fontSize: '0.74rem',
                                  padding: '0.2rem 0.55rem',
                                  borderRadius: 'var(--radius-full)',
                                  backgroundColor: 'rgba(23, 61, 51, 0.06)',
                                  color: 'var(--color-primary)',
                                  fontWeight: '600',
                                }}
                              >
                                {amenity}
                              </span>
                            ))
                          ) : (
                            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>None</span>
                          )}
                          {Array.isArray(room.amenities) && room.amenities.length > 3 && (
                            <span
                              style={{
                                fontSize: '0.74rem',
                                padding: '0.2rem 0.45rem',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: 'var(--color-bg)',
                                color: 'var(--color-text-muted)',
                              }}
                            >
                              +{room.amenities.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1.15rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleOpenEditModal(room)}
                            title="Edit Room"
                            style={{
                              padding: '0.5rem',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'rgba(23, 61, 51, 0.05)',
                              color: 'var(--color-primary)',
                              transition: 'var(--transition)',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(23, 61, 51, 0.15)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(23, 61, 51, 0.05)')}
                          >
                            <Edit3 size={16} />
                          </button>

                          <button
                            onClick={() => handleOpenDeleteModal(room)}
                            title="Delete Room"
                            style={{
                              padding: '0.5rem',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: '#FDF2F2',
                              color: 'var(--color-error)',
                              transition: 'var(--transition)',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEE2E2')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FDF2F2')}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL: ADD NEW ROOM ================= */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 39, 32, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1.5rem',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '620px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--color-border)',
              animation: 'fadeIn 0.25s ease-out',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.5rem 1.75rem',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--color-bg)',
                borderTopLeftRadius: 'var(--radius-xl)',
                borderTopRightRadius: 'var(--radius-xl)',
              }}
            >
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: '1.35rem' }}>
                  Add New Room
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Create and assign a new accommodation listing to a resort.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{
                  color: 'var(--color-text-muted)',
                  padding: '0.4rem',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddRoomSubmit} style={{ padding: '1.75rem' }}>
              {/* Parent Resort */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                  Parent Resort <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <select
                  value={formData.resortId}
                  onChange={(e) => setFormData({ ...formData, resortId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${formErrors.resortId ? 'var(--color-error)' : 'var(--color-border)'}`,
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                  }}
                >
                  <option value="" disabled>-- Select a Resort --</option>
                  {stats.resorts.map((r, index) => {
                    const rId = r._id || r.id || `add-resort-${index}`;
                    return (
                      <option key={rId} value={rId}>
                        {r.name} ({r.location || 'Kannur'})
                      </option>
                    );
                  })}
                </select>
                {formErrors.resortId && (
                  <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{formErrors.resortId}</p>
                )}
              </div>

              {/* Room Name */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                  Room Name or Type <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Deluxe Ocean View Suite"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${formErrors.name ? 'var(--color-error)' : 'var(--color-border)'}`,
                    outline: 'none',
                  }}
                />
                {formErrors.name && (
                  <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{formErrors.name}</p>
                )}
              </div>

              {/* Room Description */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                  Description <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the room layout, view, bedding, and experience..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${formErrors.description ? 'var(--color-error)' : 'var(--color-border)'}`,
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
                {formErrors.description && (
                  <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{formErrors.description}</p>
                )}
              </div>

              {/* Capacity & Price Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                    Max Guests Capacity <span style={{ color: 'var(--color-error)' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${formErrors.capacity ? 'var(--color-error)' : 'var(--color-border)'}`,
                      outline: 'none',
                    }}
                  />
                  {formErrors.capacity && (
                    <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{formErrors.capacity}</p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                    Price Per Night (₹) <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 4500"
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${formErrors.pricePerNight ? 'var(--color-error)' : 'var(--color-border)'}`,
                      outline: 'none',
                    }}
                  />
                  {formErrors.pricePerNight && (
                    <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{formErrors.pricePerNight}</p>
                  )}
                </div>
              </div>

              {/* Image URL */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                  Room Image URL <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>(Optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Amenities */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                  Amenities <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>(Comma-separated)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. King Bed, Sea View Balcony, Free Wi-Fi, Breakfast"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ minWidth: '130px' }}
                >
                  {isSubmitting ? 'Saving...' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT ROOM ================= */}
      {isEditModalOpen && activeRoom && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 39, 32, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1.5rem',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '620px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--color-border)',
              animation: 'fadeIn 0.25s ease-out',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.5rem 1.75rem',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--color-bg)',
                borderTopLeftRadius: 'var(--radius-xl)',
                borderTopRightRadius: 'var(--radius-xl)',
              }}
            >
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: '1.35rem' }}>
                  Edit Room: {activeRoom.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Under resort: <strong style={{ color: 'var(--color-primary)' }}>{activeRoom.resortName}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                style={{
                  color: 'var(--color-text-muted)',
                  padding: '0.4rem',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditRoomSubmit} style={{ padding: '1.75rem' }}>
              {/* Room Name */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                  Room Name or Type <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${formErrors.name ? 'var(--color-error)' : 'var(--color-border)'}`,
                    outline: 'none',
                  }}
                />
                {formErrors.name && (
                  <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{formErrors.name}</p>
                )}
              </div>

              {/* Room Description */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                  Description <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${formErrors.description ? 'var(--color-error)' : 'var(--color-border)'}`,
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
                {formErrors.description && (
                  <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{formErrors.description}</p>
                )}
              </div>

              {/* Capacity & Price Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                    Max Guests Capacity <span style={{ color: 'var(--color-error)' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${formErrors.capacity ? 'var(--color-error)' : 'var(--color-border)'}`,
                      outline: 'none',
                    }}
                  />
                  {formErrors.capacity && (
                    <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{formErrors.capacity}</p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                    Price Per Night (₹) <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 4500"
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${formErrors.pricePerNight ? 'var(--color-error)' : 'var(--color-border)'}`,
                      outline: 'none',
                    }}
                  />
                  {formErrors.pricePerNight && (
                    <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{formErrors.pricePerNight}</p>
                  )}
                </div>
              </div>

              {/* Image URL */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                  Room Image URL <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>(Optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Amenities */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                  Amenities <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>(Comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ minWidth: '130px' }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE ROOM CONFIRMATION ================= */}
      {isDeleteModalOpen && activeRoom && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 39, 32, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1.5rem',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '480px',
              width: '100%',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--color-border)',
              animation: 'fadeIn 0.25s ease-out',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#FDF2F2',
                color: 'var(--color-error)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <Trash2 size={26} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: '1.35rem', marginBottom: '0.5rem' }}>
              Confirm Room Deletion
            </h3>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Are you sure you want to delete <strong style={{ color: 'var(--color-primary)' }}>"{activeRoom.name}"</strong> from{' '}
              <strong style={{ color: 'var(--color-primary)' }}>{activeRoom.resortName}</strong>? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-outline"
                disabled={isSubmitting}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteRoomConfirm}
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  backgroundColor: 'var(--color-error)',
                  borderColor: 'var(--color-error)',
                }}
              >
                {isSubmitting ? 'Deleting...' : 'Delete Room'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS for animations and spinning */}
      <style>{`
        .spin-icon {
          animation: spinAnimation 1s linear infinite;
        }
        @keyframes spinAnimation {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { transform: translateY(-16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { X, Bus, MapPin, Phone, Star, LogIn, UserX, Ban, Edit3, CheckCircle2, Clock, ShieldCheck, User } from 'lucide-react';

export const BookingDetailsDrawer = ({
  booking,
  onClose,
  onUpdateStatus,
  onEdit,
}) => {
  if (!booking) return null;

  const [notes, setNotes] = useState(booking.notes || '');

  useEffect(() => {
    if (booking) {
      setNotes(booking.notes || '');
    }
  }, [booking]);

  const getStatusBadgeClass = (status) => {
    const s = (status || '').toLowerCase().replace(/[\s-]/g, '');
    return `status-badge ${s}`;
  };

  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Booking ID:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              #{booking.id}
            </span>
          </div>

          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            title="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="drawer-content">
          {/* Passenger Info & Status */}
          <div className="passenger-summary-box">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {booking.employeeName}
                </div>
                {booking.role && (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: booking.role === 'Staff' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: booking.role === 'Staff' ? '#3b82f6' : '#10b981',
                      fontWeight: 700,
                    }}
                  >
                    {booking.role}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                ID: {booking.employeeId}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Schedule Date: <strong style={{ color: 'var(--text-primary)' }}>{booking.date}</strong>
              </div>
            </div>

            <span className={getStatusBadgeClass(booking.status)}>
              {booking.status}
            </span>
          </div>

          {/* Assigned Vehicle Card */}
          <div className="vehicle-info-card">
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--brand-blue-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-blue)',
              }}
            >
              <Bus size={22} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.9rem' }}>
                  {booking.vehicleNumber}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 700 }}>
                  Active Shuttle
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {booking.vehicleDetails}
              </div>
            </div>
          </div>

          {/* Route Timeline with Delay Alert */}
          <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '16px', background: 'var(--bg-card)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Transit Journey Route
            </div>

            <div className="drawer-route-timeline">
              {/* Pickup Node */}
              <div className="timeline-stop-node">
                <div className="timeline-stop-dot">
                  <MapPin size={10} color="var(--brand-primary)" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{booking.fromLocation}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Requested Pickup: <strong>{booking.requestedPickupTime}</strong>
                    </div>
                  </div>

                  {booking.delayMinutes > 0 && (
                    <div
                      style={{
                        background: '#fef2f2',
                        color: '#dc2626',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Clock size={12} />
                      <span>{booking.pickupTime} (+{booking.delayMinutes}m delay)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Drop Node */}
              <div className="timeline-stop-node">
                <div className="timeline-stop-dot drop">
                  <MapPin size={10} color="#ef4444" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{booking.toLocation}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Planned Drop: <strong>{booking.plannedDropTime}</strong>
                    </div>
                  </div>

                  {booking.actualDropTime !== '-' && (
                    <div
                      style={{
                        background: 'var(--status-completed-bg)',
                        color: 'var(--status-completed-text)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      Actual Drop: {booking.actualDropTime}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Driver Contact Card */}
          <div className="driver-contact-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'var(--bg-active)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                }}
              >
                {booking.driverName ? booking.driverName.charAt(0) : 'D'}
              </div>

              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{booking.driverName}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <Phone size={12} />
                  <span>{booking.driverPhone}</span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: '#fef3c7',
                color: '#b45309',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.8rem',
              }}
            >
              <span>{booking.driverRating || 4.5}</span>
              <Star size={13} fill="#b45309" color="#b45309" />
            </div>
          </div>

          {/* Quick Actions matching Screenshot page 13 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ justifyContent: 'flex-start', color: '#16a34a' }}
              onClick={() => onUpdateStatus(booking.id, 'Accepted', 'Rider signed in by dispatcher')}
            >
              <LogIn size={16} />
              <span>Sign in rider</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              style={{ justifyContent: 'flex-start', color: '#ea580c' }}
              onClick={() => onUpdateStatus(booking.id, 'No Show', 'Marked as no show by dispatcher')}
            >
              <UserX size={16} />
              <span>Mark rider as No-show</span>
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1, color: '#dc2626' }}
                onClick={() => onUpdateStatus(booking.id, 'Cancelled', 'Cancelled by admin dispatcher')}
              >
                <Ban size={15} />
                <span>Cancel Booking</span>
              </button>

              <button
                type="button"
                className="btn-primary"
                style={{ flex: 1, background: 'var(--brand-blue)' }}
                onClick={() => onEdit(booking)}
              >
                <Edit3 size={15} />
                <span>Edit Booking</span>
              </button>
            </div>
          </div>

          {/* Additional Notes Box & Check-Out Button (Screenshot page 13) */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="drawer-notes-textarea" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Additional Information & Transit Notes
              </label>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {notes.length}/1000
              </span>
            </div>

            <textarea
              id="drawer-notes-textarea"
              rows={3}
              maxLength={1000}
              className="form-control"
              placeholder="Input transit or rider notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <button
              type="button"
              className="btn-primary"
              style={{
                width: '100%',
                background: 'var(--brand-blue)',
                justifyContent: 'center',
                marginTop: '4px',
              }}
              onClick={() => onUpdateStatus(booking.id, 'Completed', notes || 'Checked out at destination')}
            >
              <CheckCircle2 size={16} />
              <span>Check-Out (Mark Completed)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

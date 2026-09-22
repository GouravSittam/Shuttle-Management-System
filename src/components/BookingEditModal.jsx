import React, { useState } from 'react';
import { X, Save, Edit2 } from 'lucide-react';

const ALL_STATUSES = [
  'Accepted',
  'Waiting',
  'Requested',
  'On Going',
  'Completed',
  'Dropped',
  'Declined',
  'No Show',
  'Cancelled',
];

export const BookingEditModal = ({
  booking,
  onClose,
  onSave,
}) => {
  if (!booking) return null;

  const [employeeName, setEmployeeName] = useState(booking.employeeName);
  const [fromLocation, setFromLocation] = useState(booking.fromLocation);
  const [toLocation, setToLocation] = useState(booking.toLocation);
  const [status, setStatus] = useState(booking.status);
  const [vehicleNumber, setVehicleNumber] = useState(booking.vehicleNumber);
  const [requestedPickupTime, setRequestedPickupTime] = useState(booking.requestedPickupTime);
  const [plannedDropTime, setPlannedDropTime] = useState(booking.plannedDropTime);
  const [driverName, setDriverName] = useState(booking.driverName);
  const [notes, setNotes] = useState(booking.notes);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      employeeName,
      fromLocation,
      toLocation,
      status,
      vehicleNumber,
      requestedPickupTime,
      plannedDropTime,
      driverName,
      notes,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Edit2 size={18} color="var(--brand-blue)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Edit Booking #{booking.id}</h3>
          </div>
          <button type="button" className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label>Passenger Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Booking Status</label>
                <select
                  className="form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {ALL_STATUSES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label>Pickup Location</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Drop Location</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label>Requested Pickup Time</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={requestedPickupTime}
                  onChange={(e) => setRequestedPickupTime(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Planned Drop Time</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={plannedDropTime}
                  onChange={(e) => setPlannedDropTime(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label>Vehicle Reg Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Assigned Driver</label>
                <input
                  type="text"
                  className="form-control"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Special Instructions / Notes</label>
              <textarea
                rows={2}
                className="form-control"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ background: 'var(--brand-blue)' }}>
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Coffee, PlusCircle } from 'lucide-react';

export const DriverDutyModal = ({
  driver,
  onClose,
  onAddBreak,
}) => {
  if (!driver) return null;

  const [startHour, setStartHour] = useState(13);
  const [endHour, setEndHour] = useState(14);
  const [label, setLabel] = useState('Lunch Break');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (endHour <= startHour) {
      alert('Break end hour must be greater than start hour');
      return;
    }
    onAddBreak(driver.id, startHour, endHour, label);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Coffee size={18} color="#f59e0b" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Schedule Break for {driver.name}</h3>
          </div>
          <button type="button" className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.8rem' }}>
              <div>Assigned Vehicle: <strong>{driver.vehicleNumber}</strong></div>
              <div>Current Shift: <strong>{driver.dutyStartHour}:00 - {driver.dutyEndHour}:00</strong></div>
            </div>

            <div className="form-group">
              <label>Break Description / Type</label>
              <select
                className="form-control"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              >
                <option value="Lunch Break">Lunch Break</option>
                <option value="Tea / Rest Break">Tea / Rest Break</option>
                <option value="Vehicle Refuel Break">Vehicle Refuel Break</option>
                <option value="Sanitization Break">Sanitization Break</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label>Start Hour (24h)</label>
                <input
                  type="number"
                  min={6}
                  max={21}
                  required
                  className="form-control"
                  value={startHour}
                  onChange={(e) => setStartHour(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>End Hour (24h)</label>
                <input
                  type="number"
                  min={7}
                  max={22}
                  required
                  className="form-control"
                  value={endHour}
                  onChange={(e) => setEndHour(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ background: '#f59e0b' }}>
              <PlusCircle size={16} />
              <span>Add Break Interval</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

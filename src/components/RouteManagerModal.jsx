import React, { useState } from 'react';
import { Route as RouteIcon, Plus, MapPin, Truck, User, CheckCircle2 } from 'lucide-react';

export const RouteManagerView = ({
  routes,
  drivers,
  onCreateRoute,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [stopsText, setStopsText] = useState('Main Gate, Central Library, Engineering Block, Hostels');
  const [estimatedMinutes, setEstimatedMinutes] = useState(20);
  const [distanceKm, setDistanceKm] = useState(4.5);
  const [assignedDriverId, setAssignedDriverId] = useState(drivers[0]?.id || 'drv-1');
  const [assignedVehicle, setAssignedVehicle] = useState('NB-002-RF');
  const [frequency, setFrequency] = useState('Every 15 mins');

  const handleSubmit = (e) => {
    e.preventDefault();
    const stops = stopsText.split(',').map((s) => s.trim()).filter(Boolean);
    onCreateRoute({
      name,
      code,
      stops,
      estimatedMinutes,
      distanceKm,
      assignedDriverId,
      assignedVehicle,
      frequency,
      active: true,
    });
    setShowAddModal(false);
    setName('');
    setCode('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card-header-bar" style={{ borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
        <div>
          <h2 className="card-title">
            <RouteIcon size={18} color="var(--brand-primary)" />
            Campus Transit Routes & Stop Management
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Define transit lines, pickup/drop sequences, assign active shuttles, and regulate campus dispatch.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} />
          <span>Add New Route</span>
        </button>
      </div>

      {/* Routes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {routes.map((route) => {
          const driver = drivers.find((d) => d.id === route.assignedDriverId);

          return (
            <div key={route.id} className="card-section" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
              <div className="card-header-bar" style={{ background: 'var(--bg-card-subtle)' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--brand-blue)', fontWeight: 700 }}>
                    {route.code}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {route.name}
                  </div>
                </div>

                <span className={`status-badge ${route.active ? 'accepted' : 'cancelled'}`}>
                  {route.active ? 'Active Line' : 'Paused'}
                </span>
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', background: 'var(--bg-hover)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Duration</div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{route.estimatedMinutes} mins</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Distance</div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{route.distanceKm} km</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Frequency</div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{route.frequency}</div>
                  </div>
                </div>

                {/* Assigned Resource */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Truck size={14} color="var(--text-muted)" />
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{route.assignedVehicle}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} color="var(--text-muted)" />
                    <span>{driver ? driver.name : 'Steve Smith'}</span>
                  </div>
                </div>

                {/* Stops sequence */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Stops Hierarchy ({route.stops.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {route.stops.map((stop, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.75rem',
                          background: 'var(--bg-card-subtle)',
                          border: '1px solid var(--border-light)',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <MapPin size={11} color="var(--brand-primary)" />
                        <span>{stop}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Route Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Define New Shuttle Route</h3>
              <button type="button" className="btn-icon" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label>Route Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hostels to Academic Complex"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Route Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HAC-05"
                      className="form-control"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Stops (Comma Separated)</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={stopsText}
                    onChange={(e) => setStopsText(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label>Est. Minutes</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      value={estimatedMinutes}
                      onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label>Distance (km)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      className="form-control"
                      value={distanceKm}
                      onChange={(e) => setDistanceKm(Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label>Frequency</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label>Assigned Vehicle</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={assignedVehicle}
                      onChange={(e) => setAssignedVehicle(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Assigned Driver</label>
                    <select
                      className="form-control"
                      value={assignedDriverId}
                      onChange={(e) => setAssignedDriverId(e.target.value)}
                    >
                      {drivers.map((d) => (
                        <option key={d.id} value={d.id}>{d.name} ({d.vehicleNumber})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  <CheckCircle2 size={16} />
                  <span>Create Campus Route</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

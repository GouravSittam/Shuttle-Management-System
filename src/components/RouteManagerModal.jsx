import React, { useState } from 'react';
import { Route as RouteIcon, Plus, MapPin, Truck, User, CheckCircle2, Navigation, Clock, Sparkles, ShieldCheck } from 'lucide-react';
import AnimatedList from './AnimatedList';

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

  const [selectedStopIndex, setSelectedStopIndex] = useState(1);

  const CAMPUS_STOPS_CATALOG = [
    'Stop 1: Main Gate - Academic Loop (Headway: 10m)',
    'Stop 2: Central Library Express - Transfer Hub (Headway: 8m)',
    'Stop 3: Engineering Block North - Lecture Drop (Headway: 12m)',
    'Stop 4: Data Centre & Tech Park (Headway: 15m)',
    'Stop 5: Hostel Block A - Residential Line (Headway: 10m)',
    'Stop 6: Girls Hostel Quad - Security Escort (Headway: 10m)',
    'Stop 7: Sports Complex & Indoor Stadium (Headway: 20m)',
    'Stop 8: Central Food Court & Student Center (Headway: 12m)',
    'Stop 9: Commuter Parking Lot B (Headway: 15m)',
    'Stop 10: University Administration Block (Headway: 15m)',
  ];

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

      {/* Interactive Campus Transit Stop & Headway Navigator with AnimatedList */}
      <div className="card-section" style={{ margin: 0, padding: '24px' }}>
        <div className="card-header-bar" style={{ marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
              <Sparkles size={14} />
              <span>React Bits Integration: AnimatedList</span>
            </div>
            <h3 className="card-title" style={{ fontSize: '1.05rem' }}>
              <Navigation size={18} color="var(--brand-primary)" />
              Interactive Campus Stop & Headway Navigator
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Browse all sequential transit waypoints with animated entrance, fade gradients, and keyboard arrow navigation.
            </p>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>⌨️ Use <strong>↑</strong> / <strong>↓</strong> arrow keys or click to select</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.3fr) minmax(280px, 1fr)', gap: '24px', alignItems: 'start' }}>
          {/* AnimatedList Component */}
          <div>
            <AnimatedList
              items={CAMPUS_STOPS_CATALOG}
              initialSelectedIndex={selectedStopIndex}
              onItemSelect={(item, index) => setSelectedStopIndex(index)}
              showGradients={true}
              enableArrowNavigation={true}
              displayScrollbar={true}
              className="w-full"
            />
          </div>

          {/* Real-time Stop Telemetry & Connecting Line Details */}
          <div
            style={{
              background: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--brand-primary)', fontWeight: 800, letterSpacing: '0.05em' }}>
                Active Waypoint Selected
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {CAMPUS_STOPS_CATALOG[selectedStopIndex]?.split('(')[0] || 'Stop Selected'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Zone ID: #CP-STOP-{selectedStopIndex + 1}0 • Automated RFID Sensor
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Next Shuttle ETA</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                  {Math.max(2, (selectedStopIndex * 3) % 11 + 2)} mins
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Shuttle UA3282</div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Waiting Commuters</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--brand-blue)' }}>
                  {12 + (selectedStopIndex * 4) % 25} riders
                </div>
                <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>Within capacity</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Connecting Campus Lines
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', background: '#dbeafe', color: '#1d4ed8', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                  Central Express (CCE-01)
                </span>
                <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                  Hostel Loop (HRS-02)
                </span>
                {selectedStopIndex % 2 === 0 && (
                  <span style={{ fontSize: '0.75rem', background: '#ede9fe', color: '#6d28d9', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                    Night Owl (NOL-04)
                  </span>
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={14} color="#10b981" />
              <span>ADA Compliant • CCTV Monitored • Smart Transit Shelter</span>
            </div>
          </div>
        </div>
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

import React, { useState } from 'react';
import { Bus, Navigation, Users, Gauge, Clock, Radio, Play, Pause, FastForward, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { STOP_COORDINATES } from '../utils/realTimeEngine';

export const LiveTransitMap = ({
  shuttles = [],
  routes = [],
  bookings = [],
  simTime = '11:25:30',
  isSimRunning = true,
  simSpeed = 1,
  onToggleSim,
  onCycleSpeed,
  activeEvents = [],
}) => {
  const [selectedShuttleId, setSelectedShuttleId] = useState(shuttles[0]?.id || 'shuttle-1');
  const [selectedStop, setSelectedStop] = useState(null);

  const selectedShuttle = shuttles.find((s) => s.id === selectedShuttleId) || shuttles[0];

  // Calculate waiting counts per stop based on bookings
  const getWaitingCountForStop = (stopName) => {
    return bookings.filter(
      (b) => b.fromLocation.toLowerCase().includes(stopName.toLowerCase()) && (b.status === 'Waiting' || b.status === 'Requested')
    ).length;
  };

  // Compute interpolated pixel coordinates for a shuttle
  const getShuttlePixelCoords = (shuttle) => {
    const route = routes.find((r) => r.id === shuttle.routeId);
    if (!route || !route.stops || route.stops.length === 0) {
      return { x: 400, y: 300 };
    }
    const currStopName = route.stops[shuttle.currentStopIndex % route.stops.length];
    const nextStopName = route.stops[(shuttle.currentStopIndex + 1) % route.stops.length];
    const p1 = STOP_COORDINATES[currStopName] || { x: 200, y: 200 };
    const p2 = STOP_COORDINATES[nextStopName] || { x: 400, y: 400 };

    const t = Math.max(0, Math.min(1, shuttle.progressToNext));
    return {
      x: p1.x + (p2.x - p1.x) * t,
      y: p1.y + (p2.y - p1.y) * t,
    };
  };

  return (
    <div className="card-section" style={{ overflow: 'hidden' }}>
      {/* Top Header & Simulation Controls */}
      <div className="card-header-bar" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-primary)',
            }}
          >
            <Navigation size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 className="card-title" style={{ margin: 0, fontSize: '1.05rem' }}>
                Campus Transit Live Telemetry & GPS Radar
              </h2>
              <span className="badge-live-pulse" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                <span className="live-dot-green" />
                REAL-TIME (1s)
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Live GPS positions of all {shuttles.length} active campus shuttles across {routes.length} transit lines
            </div>
          </div>
        </div>

        {/* Live Simulation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            <Clock size={13} color="var(--brand-primary)" />
            <span>{simTime}</span>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={onToggleSim}
            title={isSimRunning ? 'Pause Live Simulation' : 'Resume Live Simulation'}
            style={{ padding: '5px 10px', fontSize: '0.78rem' }}
          >
            {isSimRunning ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
            <span>{isSimRunning ? 'Pause' : 'Resume'}</span>
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={onCycleSpeed}
            title="Cycle simulation speed (1x / 2x / 5x)"
            style={{ padding: '5px 10px', fontSize: '0.78rem', color: 'var(--brand-blue)' }}
          >
            <FastForward size={14} />
            <span>{simSpeed}x Speed</span>
          </button>
        </div>
      </div>

      {/* Main Grid: SVG Map on Left, Active Shuttle Telemetry Card on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(420px, 1fr) minmax(280px, 340px)', gap: 0, minHeight: '440px' }}>
        {/* Interactive SVG Radar Map */}
        <div
          style={{
            position: 'relative',
            background: 'var(--bg-canvas, #090e17)',
            overflow: 'hidden',
            borderRight: '1px solid var(--border-light)',
          }}
        >
          {/* Subtle grid background pattern */}
          <svg
            viewBox="0 0 840 540"
            style={{ width: '100%', height: '100%', minHeight: '420px', display: 'block' }}
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
              </pattern>
              {/* Route gradients */}
              <linearGradient id="grad-cce" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="grad-hrs" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>

            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Campus Boundary / Zone Outline */}
            <rect
              x="30"
              y="30"
              width="780"
              height="480"
              rx="16"
              fill="rgba(255,255,255,0.015)"
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="6 4"
            />

            {/* Route path lines */}
            {routes.map((route) => {
              if (!route.stops || route.stops.length < 2) return null;
              const points = route.stops
                .map((st) => {
                  const pt = STOP_COORDINATES[st];
                  return pt ? `${pt.x},${pt.y}` : null;
                })
                .filter(Boolean);

              if (points.length < 2) return null;
              const pathD = `M ${points.join(' L ')} Z`;

              return (
                <g key={route.id}>
                  {/* Glowing halo line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={route.color || '#10b981'}
                    strokeWidth="6"
                    strokeOpacity="0.18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Core dashed route path */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={route.color || '#10b981'}
                    strokeWidth="2.5"
                    strokeDasharray="8 5"
                    strokeOpacity="0.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              );
            })}

            {/* Stop nodes */}
            {Object.entries(STOP_COORDINATES).map(([stopName, coords]) => {
              const waiting = getWaitingCountForStop(stopName);
              const isSelected = selectedStop === stopName;

              return (
                <g
                  key={stopName}
                  transform={`translate(${coords.x}, ${coords.y})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedStop(stopName)}
                >
                  {/* Pulse circle if waiting > 0 */}
                  {waiting > 0 && (
                    <circle r="16" fill="rgba(245, 158, 11, 0.25)" className="animate-ping" />
                  )}
                  {/* Outer ring */}
                  <circle
                    r={isSelected ? '9' : '7'}
                    fill={isSelected ? 'var(--brand-primary)' : '#1e293b'}
                    stroke={waiting > 0 ? '#f59e0b' : '#38bdf8'}
                    strokeWidth="2"
                  />
                  {/* Center dot */}
                  <circle r="3" fill="#ffffff" />

                  {/* Stop Label Box */}
                  <g transform="translate(0, -14)">
                    <rect
                      x={-stopName.length * 3.4}
                      y="-12"
                      width={stopName.length * 6.8}
                      height="16"
                      rx="4"
                      fill="rgba(15, 23, 42, 0.88)"
                      stroke="rgba(255, 255, 255, 0.15)"
                      strokeWidth="0.8"
                    />
                    <text
                      textAnchor="middle"
                      y="-1"
                      fill="#e2e8f0"
                      fontSize="9"
                      fontWeight="600"
                      fontFamily="system-ui"
                    >
                      {stopName}
                    </text>
                  </g>

                  {/* Waiting passengers badge */}
                  {waiting > 0 && (
                    <g transform="translate(10, 4)">
                      <rect x="-8" y="-7" width="16" height="14" rx="7" fill="#f59e0b" />
                      <text textAnchor="middle" y="3" fill="#000" fontSize="8" fontWeight="800">
                        {waiting}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Moving Shuttles */}
            {shuttles.map((shuttle) => {
              const pos = getShuttlePixelCoords(shuttle);
              const isSelected = shuttle.id === selectedShuttleId;

              return (
                <g
                  key={shuttle.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  style={{ cursor: 'pointer', transition: 'transform 0.8s linear' }}
                  onClick={() => setSelectedShuttleId(shuttle.id)}
                >
                  {/* Selection / Active halo */}
                  <circle
                    r={isSelected ? '22' : '17'}
                    fill={shuttle.color || '#10b981'}
                    fillOpacity={isSelected ? '0.35' : '0.18'}
                  />
                  <circle
                    r={isSelected ? '14' : '11'}
                    fill={shuttle.color || '#10b981'}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                  />

                  {/* Bus Icon */}
                  <g transform="translate(-6, -6)">
                    <rect x="1" y="2" width="10" height="8" rx="1.5" fill="#ffffff" />
                    <rect x="2.5" y="3.5" width="7" height="3" fill={shuttle.color || '#10b981'} />
                    <circle cx="3.5" cy="10" r="1.2" fill="#000" />
                    <circle cx="8.5" cy="10" r="1.2" fill="#000" />
                  </g>

                  {/* Vehicle Tag Badge */}
                  <g transform="translate(0, 16)">
                    <rect
                      x="-26"
                      y="0"
                      width="52"
                      height="14"
                      rx="3"
                      fill="rgba(15, 23, 42, 0.95)"
                      stroke={isSelected ? '#38bdf8' : 'rgba(255,255,255,0.2)'}
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      y="10"
                      fill="#ffffff"
                      fontSize="7.5"
                      fontFamily="var(--font-mono)"
                      fontWeight="700"
                    >
                      {shuttle.vehicleNumber}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Map Controls Floating Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              background: 'rgba(15, 23, 42, 0.88)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.72rem',
              color: '#94a3b8',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              <span>Express Route</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />
              <span>Hostel Ring</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
              <span>Passenger Waiting</span>
            </div>
          </div>
        </div>

        {/* Right Side: Selected Shuttle / Telemetry Dashboard */}
        <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--bg-card)' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Fleet Telemetry Focus
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                {selectedShuttle?.vehicleNumber}
              </h3>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                }}
              >
                {selectedShuttle?.status || 'Active'}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {selectedShuttle?.model}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div
              style={{
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <Gauge size={13} color="var(--brand-blue)" />
                <span>Speed</span>
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                {selectedShuttle?.speedKmh} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>km/h</span>
              </div>
            </div>

            <div
              style={{
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <Users size={13} color="var(--brand-primary)" />
                <span>Passengers</span>
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                {selectedShuttle?.passengerCount} / {selectedShuttle?.maxCapacity}
              </div>
            </div>
          </div>

          {/* Assigned Driver Card */}
          <div
            style={{
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px',
              background: 'var(--bg-card-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Assigned Driver</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '2px' }}>
                {selectedShuttle?.driverName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {selectedShuttle?.driverPhone}
              </div>
            </div>

            <div
              style={{
                background: '#fef3c7',
                color: '#b45309',
                padding: '3px 8px',
                borderRadius: '4px',
                fontWeight: 800,
                fontSize: '0.75rem',
              }}
            >
              ★ {selectedShuttle?.driverRating}
            </div>
          </div>

          {/* Current & Upcoming Stops */}
          <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
              TRANSIT PROGRESSION
            </div>
            {(() => {
              const route = routes.find((r) => r.id === selectedShuttle?.routeId);
              const stops = route?.stops || ['Main Gate', 'Central Library', 'Engineering Block'];
              const currIdx = selectedShuttle?.currentStopIndex % stops.length;
              const nextIdx = (currIdx + 1) % stops.length;

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Departed:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{stops[currIdx]}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Next Stop:</span>
                    <strong style={{ color: 'var(--brand-primary)' }}>{stops[nextIdx]}</strong>
                  </div>

                  {/* Progress bar */}
                  <div style={{ width: '100%', height: '6px', background: 'var(--bg-hover)', borderRadius: '3px', overflow: 'hidden', marginTop: '4px' }}>
                    <div
                      style={{
                        width: `${Math.round((selectedShuttle?.progressToNext || 0) * 100)}%`,
                        height: '100%',
                        background: selectedShuttle?.color || 'var(--brand-primary)',
                        transition: 'width 0.8s ease',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <span>Progress: {Math.round((selectedShuttle?.progressToNext || 0) * 100)}%</span>
                    <span>ETA ~{Math.max(1, Math.round((1 - (selectedShuttle?.progressToNext || 0)) * 4))} mins</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Live Telemetry Event Ticker */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
              <Radio size={12} color="var(--brand-primary)" />
              <span>LIVE BROADCAST FEED</span>
            </div>
            <div
              style={{
                fontSize: '0.74rem',
                color: 'var(--text-secondary)',
                maxHeight: '75px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {activeEvents.slice(0, 3).map((evt, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--brand-primary)', fontSize: '0.65rem' }}>●</span>
                  <span>{evt}</span>
                </div>
              ))}
              {activeEvents.length === 0 && (
                <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  All shuttles operating on schedule. No transit delays.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Bus, QrCode, History, CheckCircle, ArrowRight, Star, ShieldCheck, RefreshCw } from 'lucide-react';
import JellyRadio from './JellyRadio';

const CAMPUS_STOPS = [
  'Main Gate',
  'Central Library',
  'Engineering Block',
  'Data Centre',
  'Hostel Block A',
  'Girls Hostel',
  'Sports Complex',
  'Food Court',
  'Parking Lot B',
  'Administration Block',
];

export const CommuterPortalView = ({
  bookings,
  onBookRide,
}) => {
  const [activeSubTab, setActiveSubTab] = useState('book');
  const [studentName, setStudentName] = useState('Thompson');
  const [studentId, setStudentId] = useState('123123');
  const [fromStop, setFromStop] = useState(CAMPUS_STOPS[1]); // Central Library
  const [toStop, setToStop] = useState(CAMPUS_STOPS[3]);   // Data Centre
  const [requestedTime, setRequestedTime] = useState('11:21');
  const [latestPass, setLatestPass] = useState(null);

  // Filter my trips
  const myTrips = bookings.filter(
    (b) => b.employeeName.toLowerCase().includes(studentName.toLowerCase()) || b.employeeId.includes(studentId)
  );

  const handleBook = (e) => {
    e.preventDefault();
    const newBooking = {
      employeeName: studentName,
      employeeId: `EMP-${studentId}`,
      fromLocation: fromStop,
      toLocation: toStop,
      requestedPickupTime: requestedTime,
      plannedDropTime: '11:32',
      status: 'Waiting',
      vehicleNumber: 'NB-002-RF',
      vehicleDetails: 'UA3282 White Bus | 12 Seater',
      driverName: 'Steve Smith',
      driverPhone: '+1-322-493-3292',
      driverRating: 4.5,
      date: 'Dec 16, 2024',
      pickupTime: '-',
      actualDropTime: '-',
      delayMinutes: 0,
      notes: 'Booked via Student Commuter Self-Service Portal',
    };
    onBookRide(newBooking);
    setLatestPass({
      ...newBooking,
      id: String(Math.floor(Math.random() * 900000 + 100000)),
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)',
          color: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.2)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, color: '#6ee7b7', marginBottom: '8px' }}>
            <ShieldCheck size={14} />
            Verified Campus Transit Pass
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Student & Staff Commuter Portal</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
            Instant campus transit booking, digital QR e-Pass, and trip tracking history.
          </p>
        </div>

        {/* Tab switch with JellyRadio */}
        <div style={{ background: 'rgba(255,255,255,0.08)', padding: '2px', borderRadius: 'var(--radius-full)' }}>
          <JellyRadio
            items={[
              { value: 'book', label: 'Book Shuttle', icon: <Bus size={15} /> },
              { value: 'history', label: `Trip History (${myTrips.length})`, icon: <History size={15} /> },
            ]}
            value={activeSubTab}
            onChange={(val) => setActiveSubTab(val)}
            size="md"
            gap={6}
            radius={20}
            chipColor="rgba(255, 255, 255, 0.12)"
            activeColor="#10b981"
            textColor="#e2e8f0"
            activeTextColor="#ffffff"
            swell={0.16}
            barge={5}
            jelly={1}
            bounce={0.25}
          />
        </div>
      </div>

      {activeSubTab === 'book' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(320px, 420px)', gap: '24px', alignItems: 'start' }}>
          {/* Booking Form Card */}
          <div className="card-section">
            <div className="card-header-bar">
              <h2 className="card-title">
                <Bus size={18} color="var(--brand-primary)" />
                Schedule a Campus Ride
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 700 }}>
                Next Shuttle in 4 mins
              </span>
            </div>

            <form onSubmit={handleBook} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Student / Staff ID</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label>From Pickup Point</label>
                  <select
                    className="form-control"
                    value={fromStop}
                    onChange={(e) => setFromStop(e.target.value)}
                  >
                    {CAMPUS_STOPS.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>To Destination Point</label>
                  <select
                    className="form-control"
                    value={toStop}
                    onChange={(e) => setToStop(e.target.value)}
                  >
                    {CAMPUS_STOPS.map((st) => (
                      <option key={st} value={st} disabled={st === fromStop}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Preferred Pickup Time</label>
                <input
                  type="time"
                  required
                  className="form-control"
                  value={requestedTime}
                  onChange={(e) => setRequestedTime(e.target.value)}
                />
              </div>

              {/* Transit preview summary */}
              <div
                style={{
                  background: 'var(--bg-card-subtle)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Trip Duration</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--brand-primary)' }}>11 Minutes</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Express Shuttle Route CCE-01</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Assigned Vehicle</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>NB-002-RF</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Capacity: 12-Seater</div>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem' }}
              >
                <CheckCircle size={18} />
                <span>Confirm Booking & Generate e-Pass</span>
              </button>
            </form>
          </div>

          {/* Digital QR e-Pass Card */}
          <div className="card-section">
            <div className="card-header-bar">
              <h2 className="card-title">
                <QrCode size={18} color="var(--brand-blue)" />
                Digital QR Transit Pass
              </h2>
              <span className="status-badge waiting">Pre-Approved</span>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              {/* QR Code Graphic Box */}
              <div
                style={{
                  width: '180px',
                  height: '180px',
                  background: '#ffffff',
                  border: '2px dashed var(--brand-primary)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative',
                }}
              >
                <QrCode size={120} color="#0f172a" />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  PASS-{latestPass ? latestPass.id : '123123'}
                </span>
              </div>

              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{studentName}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  ID: EMP-{studentId}
                </div>
              </div>

              <div
                style={{
                  width: '100%',
                  marginTop: '16px',
                  padding: '12px',
                  background: 'var(--bg-card-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>From:</span>
                  <strong>{fromStop}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>To:</span>
                  <strong>{toStop}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Pickup:</span>
                  <strong>{requestedTime}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Assigned Driver:</span>
                  <strong>Steve Smith (4.5 ★)</strong>
                </div>
              </div>

              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '14px' }}>
                Present this QR code to the onboard scanner or security kiosk to automatically board the shuttle without manual check-in delays.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Trip History Tracking (Section 3.I) */
        <div className="card-section">
          <div className="card-header-bar">
            <h2 className="card-title">
              <History size={18} color="var(--brand-primary)" />
              My Campus Transit Trip History
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Total Past Trips: <strong>{myTrips.length}</strong>
            </span>
          </div>

          <div className="table-wrapper">
            <table className="booking-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Date</th>
                  <th>Route</th>
                  <th>Vehicle</th>
                  <th>Driver</th>
                  <th>Pickup</th>
                  <th>Actual Drop</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myTrips.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No past trips found for {studentName} ({studentId}).
                    </td>
                  </tr>
                ) : (
                  myTrips.map((trip) => (
                    <tr key={trip.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-blue)' }}>
                        #{trip.id}
                      </td>
                      <td>{trip.date}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                          <span>{trip.fromLocation}</span>
                          <ArrowRight size={12} color="var(--text-muted)" />
                          <span>{trip.toLocation}</span>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{trip.vehicleNumber}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>{trip.driverName}</span>
                          <Star size={12} fill="#b45309" color="#b45309" />
                        </div>
                      </td>
                      <td>{trip.requestedPickupTime}</td>
                      <td>{trip.actualDropTime || trip.plannedDropTime}</td>
                      <td>
                        <span className={`status-badge ${trip.status.toLowerCase().replace(/[\s-]/g, '')}`}>
                          {trip.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-view"
                          onClick={() => {
                            setFromStop(trip.fromLocation);
                            setToStop(trip.toLocation);
                            setActiveSubTab('book');
                          }}
                        >
                          <RefreshCw size={12} />
                          <span>Re-book</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

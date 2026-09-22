import React from 'react';
import { TrendingUp, Users, CheckCircle, Clock, Bus, Zap, ShieldAlert } from 'lucide-react';

export const AnalyticsView = ({ analytics }) => {
  if (!analytics) return <div style={{ padding: '24px' }}>Loading analytics metrics...</div>;

  const maxVal = Math.max(...analytics.hourlyPeakDemand.map((d) => Math.max(d.demand, d.capacity)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card-section" style={{ margin: 0, padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Bookings</span>
            <Users size={18} color="var(--brand-blue)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: 'var(--text-primary)' }}>
            {analytics.totalBookings}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '4px', fontWeight: 600 }}>
            ↑ +12.4% vs last week
          </div>
        </div>

        <div className="card-section" style={{ margin: 0, padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>On-Time Arrival Rate</span>
            <CheckCircle size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#10b981' }}>
            {analytics.onTimeArrivalPct}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Target threshold: &gt;95.0%
          </div>
        </div>

        <div className="card-section" style={{ margin: 0, padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Fleet Utilization</span>
            <Bus size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#8b5cf6' }}>
            {analytics.fleetUtilizationPct}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Active: 6 of 8 Shuttles
          </div>
        </div>

        <div className="card-section" style={{ margin: 0, padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Commuter Wait</span>
            <Clock size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: 'var(--text-primary)' }}>
            {analytics.avgWaitMinutes}m
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '4px', fontWeight: 600 }}>
            ↓ 1.2m reduction after schedule optimization
          </div>
        </div>
      </div>

      {/* Peak Hours Usage & Demand Chart */}
      <div className="card-section" style={{ margin: 0 }}>
        <div className="card-header-bar">
          <div>
            <h2 className="card-title">
              <TrendingUp size={18} color="var(--brand-primary)" />
              Shuttle Usage & Hourly Demand Monitoring (06:00 - 22:00)
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Tracks peak transit hours (morning lectures & evening dispersal) to balance driver schedules and prevent idle trips.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', background: '#3b82f6', borderRadius: '2px' }} />
              <span>Passenger Demand</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', background: '#e2e8f0', borderRadius: '2px' }} />
              <span>Scheduled Shuttle Capacity</span>
            </div>
          </div>
        </div>

        {/* Chart Bars */}
        <div style={{ padding: '24px', overflowX: 'auto' }}>
          <div style={{ minWidth: '700px', height: '220px', display: 'flex', alignItems: 'flex-end', gap: '12px', paddingBottom: '30px', borderBottom: '1px solid var(--border-light)', position: 'relative' }}>
            {analytics.hourlyPeakDemand.map((pt, i) => {
              const demandHeight = (pt.demand / maxVal) * 160;
              const capacityHeight = (pt.capacity / maxVal) * 160;
              const isPeak = pt.demand >= 180;

              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  {/* Tooltip hint on hover */}
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: isPeak ? '#dc2626' : 'var(--text-secondary)', marginBottom: '4px' }}>
                    {pt.demand}
                  </div>

                  {/* Dual Bar (Capacity behind or next to Demand) */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '160px' }}>
                    {/* Capacity Bar */}
                    <div
                      style={{
                        width: '14px',
                        height: `${capacityHeight}px`,
                        background: 'var(--border-strong)',
                        borderRadius: '3px 3px 0 0',
                      }}
                      title={`Capacity: ${pt.capacity} seats`}
                    />

                    {/* Demand Bar */}
                    <div
                      style={{
                        width: '18px',
                        height: `${demandHeight}px`,
                        background: isPeak ? 'linear-gradient(to top, #ef4444, #f87171)' : 'linear-gradient(to top, #2563eb, #60a5fa)',
                        borderRadius: '3px 3px 0 0',
                        boxShadow: isPeak ? '0 0 8px rgba(239, 68, 68, 0.4)' : 'none',
                      }}
                      title={`Demand: ${pt.demand} commuters`}
                    />
                  </div>

                  {/* Hour Label */}
                  <div style={{ marginTop: '8px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {pt.hour}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Optimization Insights */}
          <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', gap: '10px' }}>
              <Zap size={20} color="#2563eb" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#1e40af' }}>Morning Peak Surge (09:00 - 10:00)</strong>
                <p style={{ fontSize: '0.78rem', color: '#1e3a8a', marginTop: '2px' }}>
                  Demand peaks at 180 commuters from Hostels to Central Library. All 6 active shuttles deployed on 10-minute headway.
                </p>
              </div>
            </div>

            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', gap: '10px' }}>
              <ShieldAlert size={20} color="#dc2626" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#991b1b' }}>Evening Dispersal Alert (16:30 - 18:30)</strong>
                <p style={{ fontSize: '0.78rem', color: '#7f1d1d', marginTop: '2px' }}>
                  Peak demand reaches 215 commuters. Standby driver <strong>Jonathan Spikes</strong> assigned to Research Park Loop to prevent wait queue accumulation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { TrendingUp, Users, CheckCircle, Clock, Bus, Zap, ShieldAlert, Gauge, Sliders, Sparkles, Activity } from 'lucide-react';
import CometDial from './CometDial';
import JellyRadio from './JellyRadio';

export const AnalyticsView = ({ analytics }) => {
  const [reserveHeadroom, setReserveHeadroom] = useState(72);
  const [lastDialDetail, setLastDialDetail] = useState(null);

  if (!analytics) return <div style={{ padding: '24px' }}>Loading analytics metrics...</div>;

  const maxVal = Math.max(...analytics.hourlyPeakDemand.map((d) => Math.max(d.demand, d.capacity)));

  // Derived simulation metrics based on CometDial headroom
  const requiredStandbyBuses = Math.ceil((reserveHeadroom / 100) * 4);
  const simulatedQueueTime = Math.max(1.5, Number((analytics.avgWaitMinutes * (1 - (reserveHeadroom - 50) / 100)).toFixed(1)));

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

      {/* React Bits <CometDial /> Telemetry & Dispatch Control */}
      <div className="card-section" style={{ margin: 0, padding: '24px' }}>
        <div className="card-header-bar" style={{ marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
              <Sparkles size={14} />
              <span>React Bits Integration: CometDial</span>
            </div>
            <h2 className="card-title">
              <Gauge size={18} color="var(--brand-primary)" />
              Real-time Transit Telemetry & Dynamic Headroom Control
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              High-precision animated radial comet dials measuring punctuality, fleet capacity, and simulated headway response. Drag or flick the dials to test physics momentum.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
          {/* Gauge 1: On-Time Arrival */}
          <div
            style={{
              background: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <CheckCircle size={16} color="#10b981" />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                On-Time Transit Index
              </span>
            </div>

            <CometDial
              defaultValue={Math.round(analytics.onTimeArrivalPct)}
              min={0}
              max={100}
              step={1}
              unit="%"
              label="On-Time Rate"
              accent="#10b981"
              ink="var(--text-primary)"
              size={180}
              sweep={280}
              thickness={6}
              speed={28}
              tapBounce={0.2}
              flickBounce={0.12}
              momentum={1.1}
              cometReach={160}
              cometWidth={12}
            />

            <div style={{ marginTop: '16px', fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '220px' }}>
              Target SLA &gt;95.0%. Current campus route network operating within optimal window.
            </div>
          </div>

          {/* Gauge 2: Fleet Utilization */}
          <div
            style={{
              background: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Bus size={16} color="#8b5cf6" />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Fleet Capacity Utilization
              </span>
            </div>

            <CometDial
              defaultValue={Math.round(analytics.fleetUtilizationPct)}
              min={0}
              max={100}
              step={1}
              unit="%"
              label="Fleet Utilization"
              accent="#8b5cf6"
              ink="var(--text-primary)"
              size={180}
              sweep={280}
              thickness={6}
              speed={28}
              tapBounce={0.2}
              flickBounce={0.12}
              momentum={1.1}
              cometReach={160}
              cometWidth={12}
            />

            <div style={{ marginTop: '16px', fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '220px' }}>
              6 of 8 total shuttle vans deployed across Central, Ring, and Research loops.
            </div>
          </div>

          {/* Gauge 3: Interactive Headroom & Surge Throttle */}
          <div
            style={{
              background: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Sliders size={16} color="#2563eb" />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Dynamic Headroom Throttle
              </span>
              <span style={{ fontSize: '0.68rem', background: '#dbeafe', color: '#1d4ed8', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                Interactive
              </span>
            </div>

            <CometDial
              value={reserveHeadroom}
              min={10}
              max={100}
              step={1}
              unit="%"
              label="Dynamic Headroom Throttle"
              accent="#2563eb"
              ink="var(--text-primary)"
              size={180}
              sweep={320}
              thickness={7}
              speed={32}
              tapBounce={0.25}
              flickBounce={0.15}
              momentum={1.2}
              cometReach={180}
              cometWidth={13}
              onChange={(val) => setReserveHeadroom(val)}
              onChangeEnd={(val, detail) => setLastDialDetail(detail)}
            />

            {/* Quick Presets with JellyRadio */}
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }}>
              <JellyRadio
                items={[
                  { value: '35', label: '35% Off-Peak' },
                  { value: '72', label: '72% Standard' },
                  { value: '95', label: '95% Rush Surge' },
                ]}
                value={[35, 72, 95].includes(reserveHeadroom) ? String(reserveHeadroom) : undefined}
                onChange={(val) => setReserveHeadroom(Number(val))}
                size="sm"
                gap={5}
                radius={12}
                chipColor="var(--bg-card)"
                activeColor="#2563eb"
                textColor="var(--text-secondary)"
                activeTextColor="#ffffff"
                swell={0.16}
                barge={4}
                jelly={1}
                bounce={0.25}
              />
            </div>

            {/* Simulation Feedback Strip */}
            <div
              style={{
                marginTop: '14px',
                width: '100%',
                padding: '8px 12px',
                background: 'var(--bg-hover)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.74rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>Standby fleet: <strong>{requiredStandbyBuses} shuttles</strong></span>
              <span>Sim. wait: <strong>{simulatedQueueTime}m</strong></span>
            </div>
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

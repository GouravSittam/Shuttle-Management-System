import React from 'react';
import { Bus, Moon, Sun, Code2, PlusCircle, Layers, TrendingUp, Route as RouteIcon, UserCheck } from 'lucide-react';
import JellyRadio from './JellyRadio';

export const Navbar = ({
  activeTab,
  setActiveTab,
  isBackendConnected,
  theme,
  toggleTheme,
  onOpenComplexity,
  onOpenNewBooking,
}) => {
  const navItems = [
    { value: 'management', label: 'Management', icon: <Layers size={14} /> },
    { value: 'performance', label: 'Performance', icon: <TrendingUp size={14} /> },
    { value: 'routes', label: 'Campus Routes', icon: <RouteIcon size={14} /> },
    { value: 'commuter', label: 'Commuter Portal', icon: <UserCheck size={14} /> },
  ];

  return (
    <header className="navbar">
      <div className="nav-brand-section">
        <a href="#home" className="nav-logo" onClick={(e) => { e.preventDefault(); setActiveTab('management'); }}>
          <div className="logo-badge">
            <Bus size={20} />
            <span>MoveInSync</span>
          </div>
          <div>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Campus Shuttle</div>
            <div className="logo-subtext">Transit Operations & Dispatch</div>
          </div>
        </a>

        {/* Center Navigation Tabs with JellyRadio spring physics */}
        <nav className="nav-tabs" aria-label="Main Navigation" style={{ background: 'transparent', padding: 0 }}>
          <JellyRadio
            items={navItems}
            value={activeTab}
            onChange={(val) => setActiveTab(val)}
            size="sm"
            gap={6}
            radius={18}
            chipColor="var(--bg-hover)"
            activeColor="var(--brand-primary)"
            textColor="var(--text-secondary)"
            activeTextColor="#ffffff"
            swell={0.16}
            barge={4}
            jelly={1.1}
            bounce={0.28}
          />
        </nav>
      </div>

      <div className="nav-actions">
        {/* Backend Connectivity Status */}
        <div
          className="badge-server-status"
          title={isBackendConnected ? 'Connected to Java REST API at http://localhost:8085' : 'Backend offline - operating in local caching mode'}
        >
          <div className={`status-dot ${isBackendConnected ? 'online' : 'offline'}`} />
          <span style={{ color: 'var(--text-secondary)' }}>
            {isBackendConnected ? 'Java 8 API Live' : 'Backend Disconnected'}
          </span>
        </div>

        {/* Complexity Analysis Modal Button */}
        <button
          type="button"
          className="btn-icon"
          title="View Complexity Analysis & System Evaluation Criteria"
          onClick={onOpenComplexity}
        >
          <Code2 size={18} />
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          className="btn-icon"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          onClick={toggleTheme}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Quick New Booking Button */}
        <button
          type="button"
          className="btn-primary"
          onClick={onOpenNewBooking}
          style={{ padding: '7px 14px', fontSize: '0.82rem' }}
        >
          <PlusCircle size={16} />
          <span>New Booking</span>
        </button>
      </div>
    </header>
  );
};

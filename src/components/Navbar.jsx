import React from 'react';
import { Bus, Moon, Sun, Code2, PlusCircle, Layers, TrendingUp, Route as RouteIcon, UserCheck } from 'lucide-react';

export const Navbar = ({
  activeTab,
  setActiveTab,
  isBackendConnected,
  theme,
  toggleTheme,
  onOpenComplexity,
  onOpenNewBooking,
}) => {
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

        {/* Center Navigation Tabs matching MoveInSync screenshot */}
        <nav className="nav-tabs" aria-label="Main Navigation">
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'management' ? 'active tab-green' : ''}`}
            onClick={() => setActiveTab('management')}
          >
            <Layers size={16} />
            <span>Management</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            <TrendingUp size={16} />
            <span>Performance</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'routes' ? 'active' : ''}`}
            onClick={() => setActiveTab('routes')}
          >
            <RouteIcon size={16} />
            <span>Campus Routes</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn tab-portal ${activeTab === 'commuter' ? 'active' : ''}`}
            onClick={() => setActiveTab('commuter')}
          >
            <UserCheck size={16} />
            <span>Student / Staff Portal</span>
          </button>
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

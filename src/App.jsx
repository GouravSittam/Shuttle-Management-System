import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { DriverTimeline } from './components/DriverTimeline.jsx';
import { BookingManagementTable } from './components/BookingManagementTable.jsx';
import { BookingDetailsDrawer } from './components/BookingDetailsDrawer.jsx';
import { BookingEditModal } from './components/BookingEditModal.jsx';
import { DriverDutyModal } from './components/DriverDutyModal.jsx';
import { NewBookingModal } from './components/NewBookingModal.jsx';
import { RouteManagerView } from './components/RouteManagerModal.jsx';
import { CommuterPortalView } from './components/CommuterPortalView.jsx';
import { AnalyticsView } from './components/AnalyticsView.jsx';
import { ComplexityModal } from './components/ComplexityModal.jsx';
import { ToastNotification } from './components/ToastNotification.jsx';
import { LiveTransitMap } from './components/LiveTransitMap.jsx';
import { api } from './services/api.js';
import {
  getStoredData,
  setStoredData,
  INITIAL_BOOKINGS,
  INITIAL_DRIVERS,
  INITIAL_ROUTES,
  INITIAL_LIVE_SHUTTLES,
} from './utils/realTimeEngine.js';

export const App = () => {
  const [activeTab, setActiveTab] = useState('management');
  const [theme, setTheme] = useState('light');
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Dec 16, 2024');
  const [currentRole, setCurrentRole] = useState('admin');

  // Core Data with LocalStorage Persistence & Real-time Fallback
  const [bookings, setBookings] = useState(() => getStoredData('bookings', INITIAL_BOOKINGS));
  const [drivers, setDrivers] = useState(() => getStoredData('drivers', INITIAL_DRIVERS));
  const [routes, setRoutes] = useState(() => getStoredData('routes', INITIAL_ROUTES));
  const [shuttles, setShuttles] = useState(() => getStoredData('shuttles', INITIAL_LIVE_SHUTTLES));
  const [analytics, setAnalytics] = useState(null);

  // Real-Time Simulation State
  const [isSimRunning, setIsSimRunning] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [simTime, setSimTime] = useState(() => {
    const d = new Date();
    return d.toTimeString().split(' ')[0];
  });
  const [activeEvents, setActiveEvents] = useState([
    'Shuttle NB-002-RF on schedule along Central Campus Express',
    'Shuttle MH-12-PQ-4412 arrived at Food Court (11 passengers)',
    'Real-time transit telemetry synchronized across all campus stops',
  ]);

  // Modals & Drawers
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [dutyDriver, setDutyDriver] = useState(null);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isComplexityOpen, setIsComplexityOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message) => {
    const id = String(Date.now() + Math.random());
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync Theme
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Sync state to LocalStorage
  useEffect(() => {
    setStoredData('bookings', bookings);
  }, [bookings]);

  useEffect(() => {
    setStoredData('drivers', drivers);
  }, [drivers]);

  useEffect(() => {
    setStoredData('routes', routes);
  }, [routes]);

  useEffect(() => {
    setStoredData('shuttles', shuttles);
  }, [shuttles]);

  // Real-Time Simulation Ticker (1 second heartbeat)
  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Update Clock
      const now = new Date();
      setSimTime(now.toTimeString().split(' ')[0]);

      if (!isSimRunning) return;

      // 2. Advance Shuttles along their routes
      setShuttles((prevShuttles) =>
        prevShuttles.map((shuttle) => {
          const route = routes.find((r) => r.id === shuttle.routeId);
          const stops = route?.stops || ['Main Gate', 'Central Library'];
          const step = 0.025 * simSpeed;
          let newProgress = shuttle.progressToNext + step;
          let newStopIndex = shuttle.currentStopIndex;

          if (newProgress >= 1.0) {
            newProgress = 0;
            newStopIndex = (newStopIndex + 1) % stops.length;
            const reachedStop = stops[newStopIndex];

            // Add broadcast event
            const eventMsg = `Shuttle ${shuttle.vehicleNumber} arrived at ${reachedStop}`;
            setActiveEvents((prevEvts) => [eventMsg, ...prevEvts.slice(0, 7)]);
          }

          return {
            ...shuttle,
            currentStopIndex: newStopIndex,
            progressToNext: newProgress,
            speedKmh: Math.floor(20 + Math.random() * 12),
          };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [isSimRunning, simSpeed, routes]);

  // Initial Load & Background Health Check against Java REST server
  const loadBackendData = async () => {
    try {
      const isUp = await api.checkHealth();
      setIsBackendConnected(isUp);

      if (isUp) {
        const [bList, dList, rList, aData] = await Promise.all([
          api.getBookings(),
          api.getDrivers(),
          api.getRoutes(),
          api.getAnalytics(),
        ]);
        if (bList && bList.length > 0) setBookings(bList);
        if (dList && dList.length > 0) setDrivers(dList);
        if (rList && rList.length > 0) setRoutes(rList);
        if (aData) setAnalytics(aData);
      }
    } catch {
      setIsBackendConnected(false);
    }
  };

  useEffect(() => {
    loadBackendData();
    const interval = setInterval(loadBackendData, 6000);
    return () => clearInterval(interval);
  }, []);

  // Update Booking Status
  const handleUpdateBookingStatus = async (id, status, notes) => {
    try {
      if (isBackendConnected) {
        const updated = await api.updateBookingStatus(id, status, notes);
        setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
        if (selectedBooking && selectedBooking.id === id) setSelectedBooking(updated);
      } else {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status, notes: notes || b.notes } : b))
        );
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking({ ...selectedBooking, status, notes: notes || selectedBooking.notes });
        }
      }
      addToast('success', `Booking #${id} updated to ${status}`);
      setActiveEvents((prev) => [`Dispatch updated Booking #${id} to ${status}`, ...prev.slice(0, 7)]);
    } catch (err) {
      addToast('error', `Failed to update status: ${err.message}`);
    }
  };

  // Save Booking Edit (Admin Full Edit)
  const handleSaveBookingEdit = async (updatedData) => {
    if (!editingBooking) return;
    const id = editingBooking.id;

    try {
      if (isBackendConnected) {
        const updated = await api.updateBooking(id, updatedData);
        setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
        if (selectedBooking && selectedBooking.id === id) setSelectedBooking(updated);
      } else {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, ...updatedData } : b))
        );
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking({ ...selectedBooking, ...updatedData });
        }
      }
      setEditingBooking(null);
      addToast('success', `Booking #${id} successfully modified by admin`);
      setActiveEvents((prev) => [`Admin updated route/driver for Booking #${id}`, ...prev.slice(0, 7)]);
    } catch (err) {
      addToast('error', `Failed to edit booking: ${err.message}`);
    }
  };

  // Delete / Cancel Booking
  const handleDeleteBooking = async (id) => {
    try {
      if (isBackendConnected) {
        await api.deleteBooking(id);
      }
      setBookings((prev) => prev.filter((b) => b.id !== id));
      if (selectedBooking && selectedBooking.id === id) setSelectedBooking(null);
      addToast('info', `Booking #${id} removed from dispatch schedule`);
    } catch (err) {
      addToast('error', `Failed to delete booking: ${err.message}`);
    }
  };

  // Create Booking (Student/Staff or Admin)
  const handleCreateBooking = async (newBooking) => {
    try {
      if (isBackendConnected) {
        const created = await api.createBooking(newBooking);
        setBookings((prev) => [created, ...prev]);
        addToast('success', `Ride booked! Pass issued with ID: #${created.id}`);
        setActiveEvents((prev) => [`New ride #${created.id} booked: ${created.fromLocation} → ${created.toLocation}`, ...prev.slice(0, 7)]);
      } else {
        const id = newBooking.id || String(Math.floor(Math.random() * 900000 + 100000));
        const created = { ...newBooking, id };
        setBookings((prev) => [created, ...prev]);
        addToast('success', `Ride #${id} scheduled successfully!`);
        setActiveEvents((prev) => [`New ride #${id} booked: ${created.fromLocation} → ${created.toLocation}`, ...prev.slice(0, 7)]);
      }
    } catch (err) {
      addToast('error', `Failed to create booking: ${err.message}`);
    }
  };

  // Driver Duty Actions
  const handleDutyAction = async (driverId, action) => {
    try {
      const targetDriver = drivers.find((d) => d.id === driverId);
      const hour = action === 'START_DUTY' ? 8.0 : 18.0;

      if (isBackendConnected) {
        const updated = await api.updateDriverDuty(driverId, action, hour);
        setDrivers((prev) => prev.map((d) => (d.id === driverId ? updated : d)));
      } else if (targetDriver) {
        setDrivers((prev) =>
          prev.map((d) =>
            d.id === driverId
              ? { ...d, status: action === 'START_DUTY' ? 'Online' : 'Offline' }
              : d
          )
        );
      }
      addToast(
        'info',
        `${targetDriver?.name || 'Driver'} duty updated: ${action === 'START_DUTY' ? 'Online' : 'Shift Ended'}`
      );
    } catch (err) {
      addToast('error', `Duty change failed: ${err.message}`);
    }
  };

  // Add Driver Break
  const handleAddBreak = async (driverId, startHour, endHour, label) => {
    try {
      if (isBackendConnected) {
        const updated = await api.addDriverBreak(driverId, startHour, endHour, label);
        setDrivers((prev) => prev.map((d) => (d.id === driverId ? updated : d)));
      } else {
        setDrivers((prev) =>
          prev.map((d) =>
            d.id === driverId
              ? {
                  ...d,
                  status: 'On Break',
                  blocks: [
                    ...d.blocks,
                    {
                      id: `blk-${Date.now()}`,
                      type: 'BREAK',
                      startHour,
                      endHour,
                      label,
                      pickups: 0,
                      drops: 0,
                      vehicleNumber: d.vehicleNumber,
                    },
                  ],
                }
              : d
          )
        );
      }
      addToast('success', `Break scheduled for ${startHour}:00 - ${endHour}:00`);
    } catch (err) {
      addToast('error', `Failed to add break: ${err.message}`);
    }
  };

  // Create Route
  const handleCreateRoute = async (routeData) => {
    try {
      if (isBackendConnected) {
        const created = await api.createRoute(routeData);
        setRoutes((prev) => [...prev, created]);
        addToast('success', `Route ${created.name} (${created.code}) created!`);
      } else {
        const id = `rt-${Date.now()}`;
        const created = { ...routeData, id, color: '#06b6d4' };
        setRoutes((prev) => [...prev, created]);
        addToast('success', `New route created (Local mode)`);
      }
    } catch (err) {
      addToast('error', `Failed to create route: ${err.message}`);
    }
  };

  const cycleSimSpeed = () => {
    setSimSpeed((prev) => (prev === 1 ? 2 : prev === 2 ? 5 : 1));
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isBackendConnected={isBackendConnected}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenComplexity={() => setIsComplexityOpen(true)}
        onOpenNewBooking={() => setIsNewBookingOpen(true)}
        simTime={simTime}
        isSimRunning={isSimRunning}
        currentRole={currentRole}
        onChangeRole={(role) => setCurrentRole(role)}
      />

      {/* Main Container */}
      <main className="main-content">
        {activeTab === 'management' && (
          <>
            {/* Live GPS Telemetry Radar Widget */}
            <LiveTransitMap
              shuttles={shuttles}
              routes={routes}
              bookings={bookings}
              simTime={simTime}
              isSimRunning={isSimRunning}
              simSpeed={simSpeed}
              onToggleSim={() => setIsSimRunning(!isSimRunning)}
              onCycleSpeed={cycleSimSpeed}
              activeEvents={activeEvents}
            />

            {/* Driver Availability Timeline (Screenshot page 12) */}
            <DriverTimeline
              drivers={drivers}
              selectedDate={selectedDate}
              onDutyAction={handleDutyAction}
              onOpenBreakModal={(driver) => setDutyDriver(driver)}
              onSelectBlock={(driver, block) => {
                addToast('info', `${driver.name}: ${block.label} (${block.startHour}:00 - ${block.endHour}:00)`);
              }}
            />

            {/* Booking Management Table (Screenshot page 12) with Edit & Inline Status */}
            <BookingManagementTable
              bookings={bookings}
              selectedDate={selectedDate}
              onViewBooking={(booking) => setSelectedBooking(booking)}
              onEditBooking={(booking) => setEditingBooking(booking)}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onDeleteBooking={handleDeleteBooking}
            />
          </>
        )}

        {activeTab === 'radar' && (
          <LiveTransitMap
            shuttles={shuttles}
            routes={routes}
            bookings={bookings}
            simTime={simTime}
            isSimRunning={isSimRunning}
            simSpeed={simSpeed}
            onToggleSim={() => setIsSimRunning(!isSimRunning)}
            onCycleSpeed={cycleSimSpeed}
            activeEvents={activeEvents}
          />
        )}

        {activeTab === 'performance' && (
          <AnalyticsView analytics={analytics} />
        )}

        {activeTab === 'routes' && (
          <RouteManagerView
            routes={routes}
            drivers={drivers}
            onCreateRoute={handleCreateRoute}
          />
        )}

        {activeTab === 'commuter' && (
          <CommuterPortalView
            bookings={bookings}
            routes={routes}
            shuttles={shuttles}
            onBookRide={handleCreateBooking}
            onCancelBooking={(id) => handleUpdateBookingStatus(id, 'Cancelled', 'Cancelled by commuter')}
          />
        )}
      </main>

      {/* Slide-over Inspection Drawer (Screenshot page 13) */}
      <BookingDetailsDrawer
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onUpdateStatus={handleUpdateBookingStatus}
        onEdit={(booking) => {
          setSelectedBooking(null);
          setEditingBooking(booking);
        }}
      />

      {/* Admin Booking Edit Modal */}
      <BookingEditModal
        booking={editingBooking}
        drivers={drivers}
        onClose={() => setEditingBooking(null)}
        onSave={handleSaveBookingEdit}
      />

      {/* Driver Duty Modal */}
      <DriverDutyModal
        driver={dutyDriver}
        onClose={() => setDutyDriver(null)}
        onAddBreak={handleAddBreak}
      />

      {/* New Booking Modal */}
      <NewBookingModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
        onCreate={handleCreateBooking}
      />

      {/* Complexity Analysis Modal */}
      <ComplexityModal
        isOpen={isComplexityOpen}
        onClose={() => setIsComplexityOpen(false)}
      />

      {/* Feedback Toast System */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

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
import { api } from './services/api.js';

export const App = () => {
  const [activeTab, setActiveTab] = useState('management');
  const [theme, setTheme] = useState('light');
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Dec 16, 2024');

  // State
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [analytics, setAnalytics] = useState(null);

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
    }, 4000);
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

  // Initial Load & Health Check
  const loadData = async () => {
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
        setBookings(bList);
        setDrivers(dList);
        setRoutes(rList);
        setAnalytics(aData);
      }
    } catch (err) {
      console.warn('Backend currently unreachable, retrying...');
      setIsBackendConnected(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update Booking Status
  const handleUpdateBookingStatus = async (id, status, notes) => {
    try {
      if (isBackendConnected) {
        const updated = await api.updateBookingStatus(id, status, notes);
        setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking(updated);
        }
      } else {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status, notes: notes || b.notes } : b))
        );
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking({ ...selectedBooking, status, notes: notes || selectedBooking.notes });
        }
      }
      addToast('success', `Booking #${id} updated to ${status}`);
    } catch (err) {
      addToast('error', `Failed to update status: ${err.message}`);
    }
  };

  // Save Booking Edit
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
      }
      setEditingBooking(null);
      addToast('success', `Booking #${id} successfully updated`);
    } catch (err) {
      addToast('error', `Failed to edit booking: ${err.message}`);
    }
  };

  // Create Booking
  const handleCreateBooking = async (newBooking) => {
    try {
      if (isBackendConnected) {
        const created = await api.createBooking(newBooking);
        setBookings((prev) => [created, ...prev]);
        addToast('success', `New booking created successfully! ID: #${created.id}`);
      } else {
        const id = String(Math.floor(Math.random() * 900000 + 100000));
        const created = { ...newBooking, id };
        setBookings((prev) => [created, ...prev]);
        addToast('success', `New booking #${id} scheduled (Local mode)`);
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
        const created = { ...routeData, id };
        setRoutes((prev) => [...prev, created]);
        addToast('success', `New route created (Local mode)`);
      }
    } catch (err) {
      addToast('error', `Failed to create route: ${err.message}`);
    }
  };

  return (
    <div className="app-container">
      {/* MoveInSync Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isBackendConnected={isBackendConnected}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenComplexity={() => setIsComplexityOpen(true)}
        onOpenNewBooking={() => setIsNewBookingOpen(true)}
      />

      {/* Main Container */}
      <main className="main-content">
        {activeTab === 'management' && (
          <>
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

            {/* Booking Management Table (Screenshot page 12) */}
            <BookingManagementTable
              bookings={bookings}
              selectedDate={selectedDate}
              onViewBooking={(booking) => setSelectedBooking(booking)}
              onEditBooking={(booking) => setEditingBooking(booking)}
            />
          </>
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
            onBookRide={handleCreateBooking}
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

      {/* Modals */}
      <BookingEditModal
        booking={editingBooking}
        onClose={() => setEditingBooking(null)}
        onSave={handleSaveBookingEdit}
      />

      <DriverDutyModal
        driver={dutyDriver}
        onClose={() => setDutyDriver(null)}
        onAddBreak={handleAddBreak}
      />

      <NewBookingModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
        onCreate={handleCreateBooking}
      />

      <ComplexityModal
        isOpen={isComplexityOpen}
        onClose={() => setIsComplexityOpen(false)}
      />

      {/* Feedback Toast System */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

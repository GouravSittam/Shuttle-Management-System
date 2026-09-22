import React, { useState } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight, Eye, Filter, ArrowUpDown } from 'lucide-react';
import JellyRadio from './JellyRadio';

const STATUS_FILTERS = [
  'All',
  'Accepted',
  'Waiting',
  'Requested',
  'On Going',
  'Completed',
  'Dropped',
  'Declined',
  'No Show',
  'Cancelled',
];

export const BookingManagementTable = ({
  bookings,
  selectedDate,
  onViewBooking,
  onEditBooking,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter logic
  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.fromLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.toLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || b.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);

  const getStatusBadgeClass = (status) => {
    const s = status.toLowerCase().replace(/[\s-]/g, '');
    return `status-badge ${s}`;
  };

  return (
    <section className="card-section">
      {/* Header with Search and Date Filter */}
      <div className="card-header-bar">
        <h2 className="card-title">Booking Management</h2>

        <div className="filter-toolbar">
          <div className="search-input-box">
            <Search size={15} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search Emp, ID, Booking ID, Route..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="date-badge-box">
            <Calendar size={15} color="var(--brand-primary)" />
            <span>{selectedDate}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs with JellyRadio */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          padding: '8px 20px',
          background: 'var(--bg-card-subtle)',
          borderBottom: '1px solid var(--border-light)',
          overflowX: 'auto',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          <Filter size={13} />
          STATUS:
        </span>
        <JellyRadio
          items={STATUS_FILTERS}
          value={statusFilter}
          onChange={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
          size="sm"
          gap={6}
          radius={14}
          chipColor="var(--bg-card)"
          activeColor="var(--brand-blue)"
          textColor="var(--text-secondary)"
          activeTextColor="#ffffff"
          swell={0.16}
          barge={4}
          jelly={1}
          bounce={0.24}
        />
      </div>

      {/* Table Wrapper */}
      <div className="table-wrapper">
        <table className="booking-table">
          <thead>
            <tr>
              <th>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Booking ID</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Employee</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Status</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th>From</th>
              <th>To</th>
              <th>Vehicle</th>
              <th>Requested Pickup Time</th>
              <th>Pickup Time</th>
              <th>Planned Drop</th>
              <th>Actual Drop</th>
              <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={11} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  No bookings found for the selected criteria.
                </td>
              </tr>
            ) : (
              paginated.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-blue)' }}>
                      #{booking.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{booking.employeeName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {booking.employeeId}
                    </div>
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(booking.status)}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{booking.fromLocation}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{booking.toLocation}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'var(--bg-hover)', padding: '2px 6px', borderRadius: '4px' }}>
                      {booking.vehicleNumber}
                    </span>
                  </td>
                  <td>{booking.requestedPickupTime}</td>
                  <td>
                    {booking.pickupTime === '-' ? (
                      <span style={{ color: 'var(--text-muted)' }}>—</span>
                    ) : (
                      <span style={{ fontWeight: 600 }}>{booking.pickupTime}</span>
                    )}
                  </td>
                  <td>{booking.plannedDropTime}</td>
                  <td>
                    {booking.actualDropTime === '-' ? (
                      <span style={{ color: 'var(--text-muted)' }}>—</span>
                    ) : (
                      <span style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>{booking.actualDropTime}</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="btn-view"
                      onClick={() => onViewBooking(booking)}
                      title={`View details for booking #${booking.id}`}
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar matching Screenshot page 12 */}
      <div className="pagination-bar">
        <div>
          Showing {filtered.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + pageSize, filtered.length)} of {filtered.length} items
        </div>

        <div className="pagination-controls">
          <button
            type="button"
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            style={{ opacity: currentPage === 1 ? 0.4 : 1 }}
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
            if (totalPages > 6 && Math.abs(pg - currentPage) > 2 && pg !== 1 && pg !== totalPages) {
              if (pg === 2 || pg === totalPages - 1) return <span key={pg} style={{ padding: '0 4px', color: 'var(--text-muted)' }}>...</span>;
              return null;
            }

            return (
              <button
                key={pg}
                type="button"
                className={`page-btn ${currentPage === pg ? 'active' : ''}`}
                onClick={() => setCurrentPage(pg)}
              >
                {pg}
              </button>
            );
          })}

          <button
            type="button"
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            style={{ opacity: currentPage === totalPages ? 0.4 : 1 }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

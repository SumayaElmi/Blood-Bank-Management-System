import React, { useEffect, useState } from 'react';
import { RiAddLine, RiCheckLine, RiCloseLine, RiDeleteBinLine } from 'react-icons/ri';
import { FaUserCircle } from 'react-icons/fa';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const [donorId, setDonorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/appointments');
      setAppointments(Array.isArray(res.data) ? res.data : (res.data?.content || []));
    } catch (err) {
      console.error(err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDonors = async () => {
    try {
      const res = await api.get('/donors');
      const data = Array.isArray(res.data) ? res.data : (res.data?.content || []);
      setDonors(data);
      if (data.length > 0 && data[0]) {
        setDonorId(data[0].id);
      }
    } catch (err) {
      console.error("Error fetching donors:", err);
      setDonors([]);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchDonors();
  }, []);

  const filtered = Array.isArray(appointments) ? appointments.filter((app) => {
    if (!app) return false;
    if (dateFilter === 'today') return app.appointmentDate === today;
    if (dateFilter === 'upcoming') return app.appointmentDate >= today && (app.status === 'Scheduled' || app.status === 'Approved');
    if (dateFilter === 'completed') return app.status === 'Completed';
    return true;
  }).sort((a, b) => {
    const d = (a?.appointmentDate || '').localeCompare(b?.appointmentDate || '');
    return d !== 0 ? d : (a?.appointmentTime || '').localeCompare(b?.appointmentTime || '');
  }) : [];

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    setError('');

    if (!donorId || !appointmentDate || !appointmentTime) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!remarks || remarks.trim() === '') {
      setError('Please enter remarks.');
      return;
    }

    if (/^\d+$/.test(remarks.trim())) {
      setError('Remarks cannot be only numbers. Please enter text.');
      return;
    }

    try {
      const selectedDonor = donors.find((d) => d && Number(d.id) === Number(donorId));
      if (!selectedDonor) {
        setError('Please select a valid donor.');
        return;
      }

      await api.post('/appointments', {
        donor: selectedDonor,
        appointmentDate,
        appointmentTime: appointmentTime.length === 5 ? appointmentTime + ':00' : appointmentTime,
        remarks: remarks.trim(),
        status: 'Scheduled',
      });

      setShowAddModal(false);
      setError('');
      setRemarks('');
      setAppointmentDate('');
      setAppointmentTime('');
      fetchAppointments();
    } catch (err) {
      console.error(err);
      const serverMessage = err.response?.data?.message || err.response?.data?.error || err.response?.data;
      setError(typeof serverMessage === 'string' && serverMessage.trim() !== '' ? serverMessage : 'Failed to book appointment.');
    }
  };

  // Accept -> Wuxuu si toos ah status-ka uga dhigayaa Completed
  const handleAcceptAppointment = async (appointment) => {
    try {
      await api.put(`/appointments/${appointment.id}`, {
        ...appointment,
        status: 'Completed'
      });
      
      alert('Waa la aqbalay! Status-ka waxaa loo beddelay Completed.');
      fetchAppointments();
    } catch (err) {
      console.error("Error accepting appointment:", err);
      const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      alert(`Khalad: ${serverMsg}`);
    }
  };

  // Reject -> Wuxuu status-ka ka dhigayaa Rejected
  const handleRejectAppointment = async (appointment) => {
    try {
      await api.put(`/appointments/${appointment.id}`, {
        ...appointment,
        status: 'Rejected'
      });
      alert('Ballantii waa la diiday (Rejected).');
      fetchAppointments();
    } catch (err) {
      console.error("Error rejecting appointment:", err);
      alert('Failed to reject appointment.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this appointment?')) {
      try {
        await api.delete(`/appointments/${id}`);
        fetchAppointments();
      } catch {
        alert('Failed to delete appointment.');
      }
    }
  };

  const getStatusBadge = (s) => {
    const map = { Completed: 'success', Cancelled: 'danger', Approved: 'success', Rejected: 'danger', Scheduled: 'info' };
    return <span className={`badge ${map[s] || 'info'}`}>{s || 'Scheduled'}</span>;
  };

  return (
    <div>
      <PageHeader
        title="Donation Appointments"
        subtitle="Manage calendar slots and donor attendance"
        breadcrumbs={[{ label: 'Home', to: '/dashboard' }, { label: 'Appointments' }]}
        actions={
          <button type="button" onClick={() => setShowAddModal(true)} className="btn-primary">
            <RiAddLine size={16} /> Schedule Appointment
          </button>
        }
      />

      <div className="card">
        <div className="filters-bar" style={{ marginBottom: '16px' }}>
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
            <option value="all">All Appointments</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading appointments..." />
        ) : (
          <div className="nowa-table-container">
            <table className="nowa-table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Blood Group</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Remarks</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="7" className="text-center">No appointments found.</td></tr>
                ) : (
                  filtered.map((app) => (
                    <tr key={app?.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <FaUserCircle size={32} style={{ color: "#2563EB", flexShrink: 0 }} />
                          <span style={{ fontWeight: 500 }}>{app?.donor?.fullName || 'N/A'}</span>
                        </div>
                      </td>
                      <td><span className="badge info">{app?.donor?.bloodGroup?.groupName || 'N/A'}</span></td>
                      <td>{app?.appointmentDate}</td>
                      <td>{app?.appointmentTime?.substring(0, 5)}</td>
                      <td>{app?.remarks || '—'}</td>
                      <td>{getStatusBadge(app?.status)}</td>
                      <td>
                        <div className="action-btn-group" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          
                          {app?.status !== 'Completed' && app?.status !== 'Rejected' && (
                            <>
                              <button 
                                type="button" 
                                onClick={() => handleAcceptAppointment(app)} 
                                title="Accept & Complete"
                                style={{ background: '#dcfce7', color: '#16a34a', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <RiCheckLine size={14} /> Accept
                              </button>

                              <button 
                                type="button" 
                                onClick={() => handleRejectAppointment(app)} 
                                title="Reject"
                                style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <RiCloseLine size={14} /> Reject
                              </button>
                            </>
                          )}

                          <button type="button" onClick={() => handleDelete(app?.id)} className="icon-btn danger" title="Delete" style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <RiDeleteBinLine size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: '#fff', padding: '24px', borderRadius: '8px', width: '450px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Schedule Donation Appointment</h2>
              <button type="button" className="modal-close-btn" onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            {error && <div className="alert alert-danger" style={{ color: 'red', margin: '10px 0', padding: '8px', background: '#ffe6e6', borderRadius: '4px' }}>{error}</div>}
            <form onSubmit={handleAddAppointment}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Select Donor *</label>
                <select value={donorId} onChange={(e) => setDonorId(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                  <option value="">-- Select Donor --</option>
                  {donors.map((d) => (
                    <option key={d?.id} value={d?.id}>{d?.fullName} ({d?.bloodGroup?.groupName || '?'})</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Date *</label>
                  <input type="date" value={appointmentDate} min={today} onChange={(e) => setAppointmentDate(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Time *</label>
                  <input type="time" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Remarks *</label>
                <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows="3" required placeholder="Enter remarks..." style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)} style={{ padding: '8px 16px', background: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Book Slot</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
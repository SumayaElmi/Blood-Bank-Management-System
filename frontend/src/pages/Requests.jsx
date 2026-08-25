import React, { useEffect, useState } from 'react';
import { RiAddLine, RiCheckLine, RiCloseLine } from 'react-icons/ri';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';

const RequestForm = ({ 
  formData, 
  hospitals, 
  bloodGroups, 
  onChange, 
  onSubmit, 
  onCancel 
}) => (
  <form onSubmit={onSubmit}>
    <div className="form-group">
      <label>Hospital *</label>
      <select 
        value={formData.hospitalId} 
        onChange={(e) => onChange('hospitalId', e.target.value)} 
        required
      >
        {hospitals.map((h) => (
          <option key={h.id} value={h.id}>{h.hospitalName}</option>
        ))}
      </select>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      <div className="form-group">
        <label>Blood Group *</label>
        <select 
          value={formData.bloodGroupId} 
          onChange={(e) => onChange('bloodGroupId', e.target.value)} 
          required
        >
          {bloodGroups.map((bg) => (
            <option key={bg.id} value={bg.id}>{bg.groupName}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Units Needed *</label>
        <input 
          type="number" 
          step="0.1" 
          value={formData.requestedUnits} 
          onChange={(e) => onChange('requestedUnits', e.target.value)} 
          required 
        />
      </div>
    </div>
    <div className="form-group">
      <label>Priority</label>
      <select 
        value={formData.priority} 
        onChange={(e) => onChange('priority', e.target.value)}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Urgent">Urgent</option>
      </select>
    </div>
    <div className="form-group">
      <label>Contact Representative *</label>
      <input 
        type="text" 
        value={formData.requestedBy} 
        onChange={(e) => onChange('requestedBy', e.target.value)} 
        placeholder="Dr. Smith" 
        required 
      />
    </div>
    <div className="form-group">
      <label>Remarks</label>
      <textarea 
        value={formData.remarks} 
        onChange={(e) => onChange('remarks', e.target.value)} 
        rows="3" 
      />
    </div>
    <div className="form-actions">
      <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
      <button type="submit" className="btn-primary">Submit Request</button>
    </div>
  </form>
);

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [bloodGroups, setBloodGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    hospitalId: '',
    bloodGroupId: '',
    requestedUnits: '',
    priority: 'Medium',
    requestedBy: '',
    remarks: '',
  });

  const [error, setError] = useState('');

  const getAuthConfig = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/requests', getAuthConfig());
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitalsAndGroups = async () => {
    try {
      const hospRes = await api.get('/hospitals', getAuthConfig());
      const active = hospRes.data.filter((h) => h.status);
      setHospitals(active);

      const bgRes = await api.get('/blood-groups', getAuthConfig());
      setBloodGroups(bgRes.data);

      if (active.length > 0 || bgRes.data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          hospitalId: active.length > 0 ? active[0].id : '',
          bloodGroupId: bgRes.data.length > 0 ? bgRes.data[0].id : '',
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchHospitalsAndGroups();
  }, []);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const filtered = requests.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  const handleAddRequest = async (e) => {
    e.preventDefault();
    if (!formData.hospitalId || !formData.bloodGroupId || !formData.requestedUnits || !formData.requestedBy) {
      setError('Please fill in all required fields.');
      return;
    }
    try {
      const selectedHosp = hospitals.find((h) => h.id === parseInt(formData.hospitalId));
      const selectedBg = bloodGroups.find((bg) => bg.id === parseInt(formData.bloodGroupId));
      
      await api.post('/requests', {
        hospital: selectedHosp,
        priority: formData.priority,
        requestedBy: formData.requestedBy,
        remarks: formData.remarks,
        requestDate: new Date().toISOString().split('T')[0],
        items: [{ bloodGroup: selectedBg, requestedUnits: parseFloat(formData.requestedUnits) }],
      }, getAuthConfig());

      setShowAddModal(false);
      setError('');
      fetchRequests();
    } catch {
      setError('Failed to create blood request.');
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/requests/${id}/approve`, {}, getAuthConfig());
      fetchRequests();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || err.message;
      alert("Error: " + JSON.stringify(errorMsg));
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Reject this blood request?')) {
      try {
        await api.post(`/requests/${id}/reject`, {}, getAuthConfig());
        fetchRequests();
      } catch {
        alert('Failed to reject request.');
      }
    }
  };

  const getPriorityBadge = (prio) => {
    const map = { Urgent: 'danger', High: 'warning', Medium: 'info' };
    return <span className={`badge ${map[prio] || 'success'}`}>{prio}</span>;
  };

  const getStatusBadge = (s) => {
    const statusVal = s || 'Pending';
    const map = { Approved: 'success', Rejected: 'danger', Pending: 'warning' };
    return <span className={`badge ${map[statusVal] || 'warning'}`}>{statusVal}</span>;
  };

  const isPending = (status) => {
    if (!status) return true;
    return status.toLowerCase() === 'pending';
  };

  return (
    <div>
      <PageHeader
        title="Blood Requests"
        subtitle="Approve or reject hospital blood requests"
        breadcrumbs={[{ label: 'Home', to: '/dashboard' }, { label: 'Requests' }]}
        actions={
          <button type="button" onClick={() => setShowAddModal(true)} className="btn-primary" disabled={hospitals.length === 0}>
            <RiAddLine size={16} /> Create Request
          </button>
        }
      />

      {hospitals.length === 0 && (
        <div className="alert alert-danger">Register at least one active hospital before creating blood requests.</div>
      )}

      <div className="card">
        <div className="filters-bar">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading requests..." />
        ) : (
          <div className="nowa-table-container">
            <table className="nowa-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Hospital</th>
                  <th>Date</th>
                  <th>Priority</th>
                  <th>Details</th>
                  <th>Requested By</th>
                  <th>Status</th>
                  <th>Approved By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="9" className="text-center">No requests found.</td></tr>
                ) : (
                  filtered.map((req) => (
                    <tr key={req.id}>
                      <td><strong>#{req.id}</strong></td>
                      <td>{req.hospital?.hospitalName || 'Unknown'}</td>
                      <td>{req.requestDate ? new Date(req.requestDate).toLocaleDateString() : '—'}</td>
                      <td>{getPriorityBadge(req.priority)}</td>
                      <td>
                        {req.items?.map((item, idx) => (
                          <div key={idx} style={{ fontSize: '13px' }}>
                            <strong>{item.bloodGroup?.groupName || 'N/A'}</strong>: {item.requestedUnits?.toFixed(2)} units
                            {item.issuedUnits > 0 && (
                              <span style={{ color: 'var(--success-color)', marginLeft: '6px' }}>
                                ({item.issuedUnits.toFixed(2)} issued)
                              </span>
                            )}
                          </div>
                        ))}
                      </td>
                      <td>{req.requestedBy}</td>
                      <td>{getStatusBadge(req.status)}</td>
                      <td>{req.approvedBy?.fullName || '—'}</td>
                      <td>
                        {isPending(req.status) ? (
                          <div className="action-btn-group">
                            <button type="button" onClick={() => handleApprove(req.id)} className="icon-btn success" title="Approve">
                              <RiCheckLine size={16} />
                            </button>
                            <button type="button" onClick={() => handleReject(req.id)} className="icon-btn danger" title="Reject">
                              <RiCloseLine size={16} />
                            </button>
                          </div>
                        ) : (
                          <span className="badge info">Closed</span>
                        )}
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
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create Blood Request</h2>
              <button type="button" className="modal-close-btn" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <RequestForm 
              formData={formData}
              hospitals={hospitals}
              bloodGroups={bloodGroups}
              onChange={handleFormChange}
              onSubmit={handleAddRequest}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
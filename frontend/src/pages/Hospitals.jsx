import React, { useEffect, useState } from 'react';
import { RiAddLine, RiEditLine, RiSearchLine } from 'react-icons/ri';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';

// HospitalForm waxaa loo soo raray banaanka si uusan u lumin focus-ka markaad wax qorayso
const HospitalForm = ({ formData, onChange, onSubmit, submitLabel, onCancel }) => (
  <form onSubmit={onSubmit}>
    <div className="form-group">
      <label>Hospital Name *</label>
      <input 
        type="text" 
        value={formData.hospitalName} 
        onChange={(e) => onChange('hospitalName', e.target.value)} 
        required 
      />
    </div>
    <div className="form-group">
      <label>Contact Person</label>
      <input 
        type="text" 
        value={formData.contactPerson} 
        onChange={(e) => onChange('contactPerson', e.target.value)} 
      />
    </div>
    <div className="form-group">
      <label>Phone Number *</label>
      <input 
        type="text" 
        value={formData.phone} 
        onChange={(e) => onChange('phone', e.target.value)} 
        required 
      />
    </div>
    <div className="form-group">
      <label>Email Address</label>
      <input 
        type="email" 
        value={formData.email} 
        onChange={(e) => onChange('email', e.target.value)} 
      />
    </div>
    <div className="form-group">
      <label>Address</label>
      <textarea 
        value={formData.address} 
        onChange={(e) => onChange('address', e.target.value)} 
        rows="3" 
      />
    </div>
    <div className="form-group">
      <label>Status</label>
      <select 
        value={formData.status} 
        onChange={(e) => onChange('status', e.target.value === 'true')}
      >
        <option value="true">Active Partner</option>
        <option value="false">Suspended</option>
      </select>
    </div>
    <div className="form-actions">
      <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
      <button type="submit" className="btn-primary">{submitLabel}</button>
    </div>
  </form>
);

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentHospital, setCurrentHospital] = useState(null);

  // Isticmaalka hal Object oo state ah si foomku u noqdo mid degan
  const [formData, setFormData] = useState({
    hospitalName: '',
    phone: '',
    email: '',
    address: '',
    contactPerson: '',
    status: true,
  });

  const [error, setError] = useState('');

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hospitals');
      setHospitals(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHospitals(); }, []);

  const resetForm = () => {
    setFormData({
      hospitalName: '',
      phone: '',
      email: '',
      address: '',
      contactPerson: '',
      status: true,
    });
    setError('');
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (hosp) => {
    setCurrentHospital(hosp);
    setFormData({
      hospitalName: hosp.hospitalName || '',
      phone: hosp.phone || '',
      email: hosp.email || '',
      address: hosp.address || '',
      contactPerson: hosp.contactPerson || '',
      status: hosp.status ?? true,
    });
    setError('');
    setShowEditModal(true);
  };

  const handleSave = async (e, isEdit) => {
    e.preventDefault();
    if (!formData.hospitalName || !formData.phone) {
      setError('Please fill in required fields.');
      return;
    }
    try {
      if (isEdit) {
        await api.put(`/hospitals/${currentHospital.id}`, formData);
        setShowEditModal(false);
      } else {
        await api.post('/hospitals', formData);
        setShowAddModal(false);
      }
      fetchHospitals();
    } catch {
      setError('Failed to save hospital record.');
    }
  };

  const toggleHospitalStatus = async (hospital) => {
    try {
      await api.put(`/hospitals/${hospital.id}`, { ...hospital, status: !hospital.status });
      fetchHospitals();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = hospitals.filter((h) =>
    !search || h.hospitalName?.toLowerCase().includes(search.toLowerCase()) ||
    h.hospitalCode?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Hospital Directory"
        subtitle="Registered partner hospitals and clinic centers"
        breadcrumbs={[{ label: 'Home', to: '/dashboard' }, { label: 'Hospitals' }]}
        actions={
          <button type="button" onClick={handleOpenAdd} className="btn-primary">
            <RiAddLine size={16} /> Add Hospital
          </button>
        }
      />

      <div className="card">
        <div className="filters-bar">
          <div className="search-input-wrap">
            <RiSearchLine className="search-icon" size={16} />
            <input type="text" placeholder="Search hospitals..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading hospitals..." />
        ) : (
          <div className="nowa-table-container">
            <table className="nowa-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Hospital Name</th>
                  <th>Contact Person</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="7" className="text-center">No hospitals found.</td></tr>
                ) : (
                  filtered.map((hosp) => (
                    <tr key={hosp.id}>
                      <td><strong>{hosp.hospitalCode}</strong></td>
                      <td>{hosp.hospitalName}</td>
                      <td>{hosp.contactPerson || 'N/A'}</td>
                      <td>{hosp.phone}</td>
                      <td>{hosp.email || 'N/A'}</td>
                      <td>
                        <span className={`badge ${hosp.status ? 'success' : 'danger'}`}>
                          {hosp.status ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td>
                        <div className="action-btn-group">
                          <button type="button" onClick={() => handleOpenEdit(hosp)} className="icon-btn" title="Edit">
                            <RiEditLine size={16} />
                          </button>
                          <button type="button" onClick={() => toggleHospitalStatus(hosp)} className="btn-secondary btn-sm">
                            {hosp.status ? 'Suspend' : 'Activate'}
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
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Hospital</h2>
              <button type="button" className="modal-close-btn" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <HospitalForm 
              formData={formData}
              onChange={handleFormChange}
              onSubmit={(e) => handleSave(e, false)} 
              submitLabel="Save Partner" 
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Hospital</h2>
              <button type="button" className="modal-close-btn" onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <HospitalForm 
              formData={formData}
              onChange={handleFormChange}
              onSubmit={(e) => handleSave(e, true)} 
              submitLabel="Save Changes" 
              onCancel={() => setShowEditModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Hospitals;
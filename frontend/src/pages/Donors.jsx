import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { RiAddLine, RiUserLine, RiDeleteBinLine } from 'react-icons/ri';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { paginate, totalPages } from '../utils/pagination';

const PAGE_SIZE = 8;

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [bloodGroups, setBloodGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form States
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [bloodGroupId, setBloodGroupId] = useState('');
  const [error, setError] = useState('');

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/donors');
      setDonors(Array.isArray(res.data) ? res.data : (res.data?.content || []));
    } catch (err) {
      console.error("Error fetching donors:", err);
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBloodGroups = async () => {
    try {
      const res = await api.get('/blood-groups');
      setBloodGroups(Array.isArray(res.data) ? res.data : (res.data?.content || []));
    } catch (err) {
      console.error("Error fetching blood groups:", err);
      setBloodGroups([]);
    }
  };

  useEffect(() => {
    fetchDonors();
    fetchBloodGroups();
  }, []);

  const handleAddDonor = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const payload = {
        fullName: fullName.trim(),
        gender,
        age: Number(age),
        phone: phone.trim(),
        email: email.trim() || null,
        address: address.trim() || null,
        bloodGroup: { id: Number(bloodGroupId) }
      };

      await api.post('/donors', payload);
      setShowAddModal(false);
      setFullName('');
      setGender('');
      setAge('');
      setPhone('');
      setEmail('');
      setAddress('');
      setBloodGroupId('');
      await fetchDonors();
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(`Khalad: ${serverMsg}`);
    }
  };

  const handleDeleteDonor = async (id) => {
    if (window.confirm("Ma hubtaa inaad tirtirto donor-kan?")) {
      try {
        await api.delete(`/donors/${id}`);
        await fetchDonors();
      } catch (err) {
        console.error("Error deleting donor:", err);
        alert("Waa la waayay ama waxaa jira xog ku xiran donor-kan oo diideysa tirtiristiisa.");
      }
    }
  };

  const pages = totalPages(donors.length, PAGE_SIZE);
  const pagedDonors = paginate(donors, currentPage, PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="Donor Management"
        subtitle="Manage blood donors and their information"
        breadcrumbs={[{ label: 'Home', to: '/dashboard' }, { label: 'Donors' }]}
        actions={
          <button type="button" onClick={() => setShowAddModal(true)} className="btn-primary" style={{ cursor: 'pointer' }}>
            <RiAddLine size={16} /> Add Donor
          </button>
        }
      />

      <div className="card">
        {loading ? (
          <LoadingSpinner message="Loading donors..." />
        ) : (
          <>
            <div className="nowa-table-container">
              <table className="nowa-table">
                <thead>
                  <tr>
                    <th>Donor Code</th>
                    <th>Full Name</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>Blood Group</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedDonors.length === 0 ? (
                    <tr><td colSpan="8" className="text-center">No donors found.</td></tr>
                  ) : (
                    pagedDonors.map((donor) => (
                      <tr key={donor.id}>
                        <td><strong>{donor.donorCode}</strong></td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ 
                              background: '#e0f2fe', 
                              color: '#0284c7', 
                              width: '30px',
                              height: '30px',
                              borderRadius: '50%', 
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <RiUserLine size={16} />
                            </span>
                            {donor.fullName}
                          </span>
                        </td>
                        <td>{donor.gender}</td>
                        <td>{donor.age}</td>
                        <td>{donor.bloodGroup?.groupName || 'N/A'}</td>
                        <td>{donor.phone}</td>
                        <td>{donor.status}</td>
                        <td className="text-center">
                          <button 
                            type="button" 
                            onClick={() => handleDeleteDonor(donor.id)} 
                            style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}
                            title="Delete Donor"
                          >
                            <RiDeleteBinLine size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={pages}
              onPageChange={setCurrentPage}
              totalItems={donors.length}
              pageSize={PAGE_SIZE}
            />
          </>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Donor</h2>
              <button type="button" className="modal-close-btn" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            {error && <div className="alert alert-danger" style={{ color: 'red', margin: '10px 0', padding: '8px', background: '#ffe6e6', borderRadius: '4px' }}>{error}</div>}
            <form onSubmit={handleAddDonor}>
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Letters only" />
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                  <option value="">-- Select Gender --</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="form-group">
                <label>Age (18 - 65) *</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required min="18" max="65" />
              </div>
              <div className="form-group">
                <label>Blood Group *</label>
                <select value={bloodGroupId} onChange={(e) => setBloodGroupId(e.target.value)} required>
                  <option value="">-- Select Blood Group --</option>
                  {bloodGroups.map((bg) => (
                    <option key={bg.id} value={bg.id}>{bg.groupName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="7 to 15 digits" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Optional" />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows="2" placeholder="Optional" />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel / Xir</button>
                <button type="submit" className="btn-primary">Save Donor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donors;
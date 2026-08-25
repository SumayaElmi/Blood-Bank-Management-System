import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { RiAddLine, RiUserLine, RiDeleteBinLine } from 'react-icons/ri';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { paginate, totalPages } from '../utils/pagination';

const PAGE_SIZE = 8;

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form States for Donation
  const [donorId, setDonorId] = useState('');
  const [donationDate, setDonationDate] = useState('');
  const [units, setUnits] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/donations');
      setDonations(Array.isArray(res.data) ? res.data : (res.data?.content || []));
    } catch (err) {
      console.error("Error fetching donations:", err);
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDonors = async () => {
    try {
      const res = await api.get('/donors');
      setDonors(Array.isArray(res.data) ? res.data : (res.data?.content || []));
    } catch (err) {
      console.error("Error fetching donors:", err);
      setDonors([]);
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchDonors();
  }, []);

  const resetForm = () => {
    setDonorId('');
    setDonationDate('');
    setUnits('');
    setDoctorName('');
    setRemarks('');
    setError('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleAddDonation = async (e) => {
    e.preventDefault();
    setError('');

    // Hubinta in Remarks aanay madhnayn ama ayan ahayn tirooyin saafi ah (Integer)
    if (!remarks || remarks.trim() === '') {
      setError('Remarks cannot be blank.');
      return;
    }

    if (/^\d+$/.test(remarks.trim())) {
      setError('Remarks cannot be only numbers. Please enter text (string).');
      return;
    }

    try {
      const payload = {
        donor: { id: Number(donorId) },
        donationDate,
        units: Number(units),
        doctorName: doctorName.trim(),
        remarks: remarks.trim()
      };

      await api.post('/donations', payload);
      setShowAddModal(false);
      resetForm();
      await fetchDonations();
      alert('Tabarucaadagu si guul leh ayuu u kaydsamay!');
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message);
      const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(`Khalad: ${typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg)}`);
    }
  };

  const handleDeleteDonation = async (id) => {
    if (window.confirm("Ma hubtaa inaad tirtirto diiwaankan tabarucaad?")) {
      try {
        await api.delete(`/donations/${id}`);
        await fetchDonations();
      } catch (err) {
        console.error("Error deleting donation:", err);
        alert("Waa la waayay ama waxaa jira xog ku xiran diiwaankan oo diideysa tirtiristiisa.");
      }
    }
  };

  const pages = totalPages(donations.length, PAGE_SIZE);
  const pagedDonations = paginate(donations, currentPage, PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="Donation History"
        subtitle="Manage and view blood donation records"
        breadcrumbs={[{ label: 'Home', to: '/dashboard' }, { label: 'Donation History' }]}
        actions={
          <button type="button" onClick={handleOpenAdd} className="btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RiAddLine size={18} /> Add Donation
          </button>
        }
      />

      <div className="card">
        {loading ? (
          <LoadingSpinner message="Loading donations..." />
        ) : (
          <>
            <div className="nowa-table-container">
              <table className="nowa-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Donor Name</th>
                    <th>Donation Date</th>
                    <th>Units</th>
                    <th>Doctor Name</th>
                    <th>Remarks</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedDonations.length === 0 ? (
                    <tr><td colSpan="7" className="text-center">No donation records found.</td></tr>
                  ) : (
                    pagedDonations.map((item) => (
                      <tr key={item.id}>
                        <td><strong>{item.id}</strong></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: '#e0f2fe',
                              color: '#0284c7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <RiUserLine size={18} />
                            </div>
                            <span style={{ fontWeight: 500 }}>{item.donor?.fullName || 'N/A'}</span>
                          </div>
                        </td>
                        <td>{item.donationDate}</td>
                        <td>{item.units}</td>
                        <td>{item.doctorName}</td>
                        <td>{item.remarks}</td>
                        <td className="text-center">
                          <button 
                            type="button" 
                            onClick={() => handleDeleteDonation(item.id)} 
                            style={{ 
                              background: '#fee2e2', 
                              color: '#dc2626', 
                              border: 'none', 
                              padding: '6px 10px', 
                              borderRadius: '4px', 
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Delete Donation"
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
              totalItems={donations.length}
              pageSize={PAGE_SIZE}
            />
          </>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: '#fff', padding: '24px', borderRadius: '8px', width: '450px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Add Donation</h2>
              <button type="button" className="modal-close-btn" onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            {error && <div className="alert alert-danger" style={{ color: 'red', margin: '10px 0', padding: '8px', background: '#ffe6e6', borderRadius: '4px' }}>{error}</div>}
            <form onSubmit={handleAddDonation}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Donor *</label>
                <select value={donorId} onChange={(e) => setDonorId(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                  <option value="">-- Select Donor --</option>
                  {donors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} ({d.donorCode}) - {d.bloodGroup?.groupName || 'N/A'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Donation Date *</label>
                <input type="date" value={donationDate} onChange={(e) => setDonationDate(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Units *</label>
                <input type="number" step="0.01" value={units} onChange={(e) => setUnits(e.target.value)} required placeholder="e.g. 1.00" style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Doctor Name *</label>
                <input type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} required placeholder="Enter doctor name" style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Remarks * (Text only, not numbers/integer)</label>
                <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows="2" required placeholder="Enter remarks (text)" style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)} style={{ padding: '8px 16px', background: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save Donation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donations;
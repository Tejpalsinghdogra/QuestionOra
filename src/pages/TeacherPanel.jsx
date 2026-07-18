import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/panels.css';

function TeacherPanel() {
  const [activeTab, setActiveTab] = useState('upload');
  const [infoMsg, setInfoMsg] = useState('');
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Upload form state
  const [form, setForm] = useState({
    title: '', department: 'BtechCSE', semester: 'Sem-1',
    year: new Date().getFullYear(), type: 'MSE', file: null,
  });
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle', 'uploading', 'uploaded'
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  // Edit modal state
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Replace file modal state
  const [replaceModal, setReplaceModal] = useState(null);
  const [replaceFile, setReplaceFile] = useState(null);

  // Delete confirm modal
  const [deleteModal, setDeleteModal] = useState(null);

  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const fetchMyPapers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/papers/my-papers', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setPapers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== 'upload') fetchMyPapers();
  }, [activeTab]);

  // ===== UPLOAD =====
  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadStatus('uploading');
    setInfoMsg('');

    if (!token) { setInfoMsg('Please log in again.'); setUploadStatus('idle'); return; }

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));

    try {
      const res = await fetch('/api/papers/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        setInfoMsg(`Upload failed with status: ${res.status}`);
        setUploadStatus('idle');
        return;
      }
      
      if (res.ok) {
        setInfoMsg('Paper uploaded successfully!');
        setUploadStatus('uploaded');
        setForm({
          title: '', department: 'BtechCSE', semester: 'Sem-1',
          year: new Date().getFullYear(), type: 'MSE', file: null,
        });
        setFileInputKey(Date.now());
        
        setTimeout(() => {
          setUploadStatus('idle');
          setInfoMsg('');
        }, 5000);
      } else {
        setInfoMsg(data.message || 'Upload failed');
        setUploadStatus('idle');
      }
    } catch (err) {
      console.error(err);
      setInfoMsg('Server error during upload');
      setUploadStatus('idle');
    }
  };

  // ===== EDIT =====
  const openEdit = (paper) => {
    setEditForm({
      title: paper.title, department: paper.department,
      semester: paper.semester, year: paper.year, type: paper.type,
    });
    setEditModal(paper._id);
  };

  const handleEdit = async () => {
    try {
      const res = await fetch(`/api/papers/${editModal}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        setEditModal(null);
        fetchMyPapers();
        setInfoMsg('Paper updated successfully!');
      } else {
        setInfoMsg(data.message || 'Edit failed');
      }
    } catch (err) {
      console.error(err);
      setInfoMsg('Server error editing paper');
    }
  };

  // ===== REPLACE FILE =====
  const handleReplace = async () => {
    if (!replaceFile) { setInfoMsg('Please select a file'); return; }
    const formData = new FormData();
    formData.append('file', replaceFile);

    try {
      const res = await fetch(`/api/papers/${replaceModal}/replace-file`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setReplaceModal(null);
        setReplaceFile(null);
        fetchMyPapers();
        setInfoMsg('File replaced successfully!');
      } else {
        setInfoMsg(data.message || 'Replace failed');
      }
    } catch (err) {
      console.error(err);
      setInfoMsg('Server error replacing file');
    }
  };

  // ===== DELETE =====
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/papers/${deleteModal}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setDeleteModal(null);
        fetchMyPapers();
        setInfoMsg('Paper deleted successfully!');
      } else {
        setInfoMsg(data.message || 'Delete failed');
      }
    } catch (err) {
      console.error(err);
      setInfoMsg('Server error deleting paper');
    }
  };

  const statusBadge = (status) => {
    const s = status || 'active';
    return <span className={`badge badge-${s}`}>{s}</span>;
  };

  // Count notifications (rejected/removed papers)
  const notifications = papers.filter(p => p.status === 'rejected' || p.status === 'removed').length;

  return (
    <div className="panel-wrapper">
      <div className="panel-header">
        <h1>Teacher Panel</h1>
        <p>Manage your question paper uploads</p>
        <div className="panel-header-actions">
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="panel-tabs">
        <button className={`panel-tab ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => { setActiveTab('upload'); setInfoMsg(''); }}>Upload Paper</button>
        <button className={`panel-tab ${activeTab === 'papers' ? 'active' : ''}`} onClick={() => { setActiveTab('papers'); setInfoMsg(''); }}>
          My Papers
          {notifications > 0 && <span className="tab-badge">{notifications}</span>}
        </button>
        <button className={`panel-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => { setActiveTab('history'); setInfoMsg(''); }}>Upload History</button>
      </div>

      <div className="tab-content">
        {/* ===== UPLOAD TAB ===== */}
        {activeTab === 'upload' && (
          <div className="form-card">
            <h3>Upload Question Paper</h3>
            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label>Title (e.g. DAA 2024 MSE)</label>
                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                  <option value="BtechCSE">B.Tech CSE</option>
                  <option value="Bca">BCA</option>
                  <option value="BscIt">B.Sc IT</option>
                  <option value="BtechCE">B.Tech CE</option>
                  <option value="BtechECE">B.Tech ECE</option>
                  <option value="BtechAE">B.Tech Aerospace</option>
                  <option value="BtechMAE">B.Tech Mechanical</option>
                  <option value="BtechRAE">B.Tech Robotics</option>
                  <option value="BtechECTwoE">B.Tech Electronics & Computer</option>
                  <option value="BscDM">B.Sc Digital Marketing</option>
                  <option value="clayout6">B.Sc Animation</option>
                  <option value="clayout8">B.Sc DM (Layout 8)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Semester</label>
                <select value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })}>
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={`Sem-${n}`}>Semester-{n}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Year</label>
                <input type="number" required value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="MSE">MSE</option>
                  <option value="ESE">ESE</option>
                </select>
              </div>
              <div className="form-group">
                <label>Upload File (PDF / Image)</label>
                <input key={fileInputKey} type="file" accept=".pdf,image/*" required onChange={e => setForm({ ...form, file: e.target.files[0] })} />
              </div>
              <button type="submit" className="btn-primary" disabled={uploadStatus === 'uploading'}>
                {uploadStatus === 'uploading' ? 'Uploading...' : uploadStatus === 'uploaded' ? 'Uploaded' : 'Upload Paper'}
              </button>
            </form>
            {infoMsg && <p className={`info-msg ${uploadStatus === 'uploaded' ? 'success' : 'error'}`}>{infoMsg}</p>}
          </div>
        )}

        {/* ===== MY PAPERS TAB ===== */}
        {activeTab === 'papers' && (
          <>
            {loading ? (
              <p className="loading-text">Loading your papers...</p>
            ) : papers.length === 0 ? (
              <div className="empty-state"><p>You haven't uploaded any papers yet.</p></div>
            ) : (
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Dept</th>
                      <th>Sem</th>
                      <th>Year</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {papers.map(p => (
                      <tr key={p._id}>
                        <td>{p.title}</td>
                        <td>{p.department}</td>
                        <td>{p.semester}</td>
                        <td>{p.year}</td>
                        <td>{p.type}</td>
                        <td>
                          {statusBadge(p.status)}
                          {p.statusMessage && <span className="status-tooltip">{p.statusMessage}</span>}
                        </td>
                        <td>
                          <button className="action-btn edit" onClick={() => openEdit(p)}>Edit</button>
                          <button className="action-btn replace" onClick={() => { setReplaceModal(p._id); setReplaceFile(null); }}>Replace</button>
                          <button className="action-btn delete" onClick={() => setDeleteModal(p._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="info-msg">{infoMsg}</p>
          </>
        )}

        {/* ===== HISTORY TAB ===== */}
        {activeTab === 'history' && (
          <>
            {loading ? (
              <p className="loading-text">Loading history...</p>
            ) : papers.length === 0 ? (
              <div className="empty-state"><p>No upload history found.</p></div>
            ) : (
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Department</th>
                      <th>Uploaded On</th>
                      <th>Status</th>
                      <th>Downloads</th>
                    </tr>
                  </thead>
                  <tbody>
                    {papers.map(p => (
                      <tr key={p._id}>
                        <td>{p.title}</td>
                        <td>{p.department}</td>
                        <td>{new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                        <td>
                          {statusBadge(p.status)}
                          {p.statusMessage && <span className="status-tooltip">{p.statusMessage}</span>}
                        </td>
                        <td>{p.downloads || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* ===== EDIT MODAL ===== */}
      {editModal && (
        <div className="modal-overlay" onClick={() => setEditModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Edit Paper Metadata</h3>
            <div className="form-group">
              <label>Title</label>
              <input value={editForm.title || ''} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Department</label>
              <select value={editForm.department || ''} onChange={e => setEditForm({ ...editForm, department: e.target.value })}>
                <option value="BtechCSE">B.Tech CSE</option>
                <option value="BCA">BCA</option>
                <option value="BBA">BBA</option>
                <option value="BscIT">B.Sc IT</option>
                <option value="BtechCE">B.Tech CE</option>
                <option value="BtechECE">B.Tech ECE</option>
              </select>
            </div>
            <div className="form-group">
              <label>Semester</label>
              <select value={editForm.semester || ''} onChange={e => setEditForm({ ...editForm, semester: e.target.value })}>
                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={`Sem-${n}`}>Semester-{n}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Year</label>
              <input type="number" value={editForm.year || ''} onChange={e => setEditForm({ ...editForm, year: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select value={editForm.type || ''} onChange={e => setEditForm({ ...editForm, type: e.target.value })}>
                <option value="MSE">MSE</option>
                <option value="ESE">ESE</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setEditModal(null)}>Cancel</button>
              <button className="btn-confirm" onClick={handleEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== REPLACE FILE MODAL ===== */}
      {replaceModal && (
        <div className="modal-overlay" onClick={() => setReplaceModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Replace Paper File</h3>
            <p style={{ fontFamily: 'Poppins', fontSize: '13px', color: '#546E7A', marginBottom: '15px' }}>
              Upload a new PDF or image to replace the current file.
            </p>
            <div className="form-group">
              <label>New File</label>
              <input type="file" accept=".pdf,image/*" onChange={e => setReplaceFile(e.target.files[0])} />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setReplaceModal(null)}>Cancel</button>
              <button className="btn-confirm" onClick={handleReplace}>Replace File</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRM MODAL ===== */}
      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Delete Paper</h3>
            <p style={{ fontFamily: 'Poppins', fontSize: '14px', color: '#546E7A' }}>
              Are you sure you want to permanently delete this paper? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteModal(null)}>Cancel</button>
              <button className="btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherPanel;

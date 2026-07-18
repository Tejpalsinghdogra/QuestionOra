import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/panels.css';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [infoMsg, setInfoMsg] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Data states
  const [stats, setStats] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [papers, setPapers] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // Appoint teacher
  const [appointEmail, setAppointEmail] = useState('');

  // Status change modal
  const [statusModal, setStatusModal] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: 'rejected', statusMessage: '' });

  // Delete modal
  const [deleteModal, setDeleteModal] = useState(null);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  // ===== FETCH FUNCTIONS =====
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', { headers });
      if (res.ok) setStats(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/teachers', { headers });
      if (res.ok) setTeachers(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/all-papers', { headers });
      if (res.ok) setPapers(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchAuditLog = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/audit-log', { headers });
      if (res.ok) setAuditLog(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reports', { headers });
      if (res.ok) setReports(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    setInfoMsg('');
    if (activeTab === 'dashboard') fetchStats();
    if (activeTab === 'teachers') fetchTeachers();
    if (activeTab === 'papers') fetchPapers();
    if (activeTab === 'audit') fetchAuditLog();
    if (activeTab === 'reports') fetchReports();
  }, [activeTab]);

  // ===== APPOINT TEACHER =====
  const handleAppoint = async (e) => {
    e.preventDefault();
    setInfoMsg('Processing...');
    try {
      const res = await fetch('/api/admin/appoint-teacher', {
        method: 'POST', headers,
        body: JSON.stringify({ email: appointEmail }),
      });
      const data = await res.json();
      setInfoMsg(data.message);
      if (res.ok) { setAppointEmail(''); fetchTeachers(); }
    } catch (err) { setInfoMsg('Server error'); }
  };

  // ===== TOGGLE TEACHER =====
  const handleToggle = async (id) => {
    try {
      const res = await fetch(`/api/admin/toggle-teacher/${id}`, { method: 'PUT', headers });
      const data = await res.json();
      if (res.ok) {
        setInfoMsg(data.message);
        fetchTeachers();
      }
    } catch (err) { setInfoMsg('Server error'); }
  };

  // ===== CHANGE PAPER STATUS =====
  const handleStatusChange = async () => {
    try {
      const res = await fetch(`/api/admin/paper/${statusModal}/status`, {
        method: 'PUT', headers,
        body: JSON.stringify(statusForm),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusModal(null);
        setInfoMsg(data.message);
        fetchPapers();
      } else {
        setInfoMsg(data.message || 'Failed');
      }
    } catch (err) { setInfoMsg('Server error'); }
  };

  // ===== DELETE PAPER =====
  const handleDeletePaper = async () => {
    try {
      const res = await fetch(`/api/admin/paper/${deleteModal}`, { method: 'DELETE', headers });
      const data = await res.json();
      if (res.ok) {
        setDeleteModal(null);
        setInfoMsg(data.message);
        fetchPapers();
      }
    } catch (err) { setInfoMsg('Server error'); }
  };

  // ===== RESOLVE REPORT =====
  const handleResolve = async (id) => {
    try {
      const res = await fetch(`/api/admin/report/${id}/resolve`, { method: 'PUT', headers });
      if (res.ok) { setInfoMsg('Report resolved'); fetchReports(); }
    } catch (err) { setInfoMsg('Server error'); }
  };

  const pendingReports = reports.filter(r => r.status === 'pending').length;

  return (
    <div className="panel-wrapper">
      <div className="panel-header">
        <h1>Admin Panel</h1>
        <p>Manage teachers, papers, and platform activity</p>
        <div className="panel-header-actions">
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="panel-tabs">
        <button className={`panel-tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button className={`panel-tab ${activeTab === 'teachers' ? 'active' : ''}`} onClick={() => setActiveTab('teachers')}>Teachers</button>
        <button className={`panel-tab ${activeTab === 'papers' ? 'active' : ''}`} onClick={() => setActiveTab('papers')}>Papers</button>
        <button className={`panel-tab ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>Audit Log</button>
        <button className={`panel-tab ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
          Reports
          {pendingReports > 0 && <span className="tab-badge">{pendingReports}</span>}
        </button>
      </div>

      <div className="tab-content">
        {/* ===== DASHBOARD TAB ===== */}
        {activeTab === 'dashboard' && (
          <>
            {!stats ? (
              <p className="loading-text">Loading stats...</p>
            ) : (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">{stats.totalPapers}</div>
                    <div className="stat-label">Total Papers</div>
                  </div>
                  <div className="stat-card accent">
                    <div className="stat-value">{stats.activePapers}</div>
                    <div className="stat-label">Active Papers</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{stats.totalDownloads}</div>
                    <div className="stat-label">Total Downloads</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{stats.totalTeachers}</div>
                    <div className="stat-label">Total Teachers</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{stats.totalUsers}</div>
                    <div className="stat-label">Total Users</div>
                  </div>
                  <div className="stat-card warn">
                    <div className="stat-value">{stats.pendingReports}</div>
                    <div className="stat-label">Pending Reports</div>
                  </div>
                </div>

                {stats.papersPerDepartment && stats.papersPerDepartment.length > 0 && (
                  <>
                    <h3 style={{ fontFamily: 'Poppins', color: '#002B5B', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Papers by Department</h3>
                    <div className="dept-list">
                      {stats.papersPerDepartment.map((d, i) => {
                        const maxCount = stats.papersPerDepartment[0].count;
                        const pct = maxCount > 0 ? Math.round((d.count / maxCount) * 100) : 0;
                        return (
                          <div className="dept-bar-row" key={i}>
                            <div className="dept-bar-label">{d.department}</div>
                            <div className="dept-bar-track">
                              <div className="dept-bar-fill" style={{ width: `${pct}%` }}>
                                <span>{d.count}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* ===== TEACHERS TAB ===== */}
        {activeTab === 'teachers' && (
          <>
            <div className="form-card" style={{ marginBottom: '30px' }}>
              <h3>Appoint New Teacher</h3>
              <form onSubmit={handleAppoint}>
                <div className="form-group">
                  <label>User's Email Address</label>
                  <input type="email" required value={appointEmail} onChange={e => setAppointEmail(e.target.value)} placeholder="Enter registered email..." />
                </div>
                <button type="submit" className="btn-primary">Appoint as Teacher</button>
              </form>
              <p className="info-msg">{infoMsg}</p>
            </div>

            {loading ? (
              <p className="loading-text">Loading teachers...</p>
            ) : teachers.length === 0 ? (
              <div className="empty-state"><p>No teachers appointed yet.</p></div>
            ) : (
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map(t => (
                      <tr key={t._id}>
                        <td>{t.name}</td>
                        <td>{t.email}</td>
                        <td>
                          <span className={`badge ${t.isActive !== false ? 'badge-active' : 'badge-inactive'}`}>
                            {t.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td>
                          <button
                            className={`action-btn ${t.isActive !== false ? 'toggle-off' : 'toggle-on'}`}
                            onClick={() => handleToggle(t._id)}
                          >
                            {t.isActive !== false ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ===== PAPERS TAB ===== */}
        {activeTab === 'papers' && (
          <>
            {loading ? (
              <p className="loading-text">Loading papers...</p>
            ) : papers.length === 0 ? (
              <div className="empty-state"><p>No papers uploaded yet.</p></div>
            ) : (
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Dept</th>
                      <th>Sem</th>
                      <th>Uploader</th>
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
                        <td>{p.uploadedBy ? p.uploadedBy.name : 'N/A'}</td>
                        <td>
                          <span className={`badge badge-${p.status || 'active'}`}>{p.status || 'active'}</span>
                          {p.statusMessage && <span className="status-tooltip">{p.statusMessage}</span>}
                        </td>
                        <td>
                          <a href={p.fileUrl} target="_blank" rel="noopener noreferrer">
                            <button className="action-btn edit">View</button>
                          </a>
                          <button className="action-btn status-change" onClick={() => { setStatusModal(p._id); setStatusForm({ status: 'rejected', statusMessage: '' }); }}>Status</button>
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

        {/* ===== AUDIT LOG TAB ===== */}
        {activeTab === 'audit' && (
          <>
            {loading ? (
              <p className="loading-text">Loading audit log...</p>
            ) : auditLog.length === 0 ? (
              <div className="empty-state"><p>No audit data available.</p></div>
            ) : (
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Dept</th>
                      <th>Sem</th>
                      <th>Uploader</th>
                      <th>Uploaded At</th>
                      <th>Status</th>
                      <th>Downloads</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLog.map(entry => (
                      <tr key={entry._id}>
                        <td>{entry.title}</td>
                        <td>{entry.department}</td>
                        <td>{entry.semester}</td>
                        <td>{entry.uploadedBy.name}<br /><span style={{ fontSize: '11px', color: '#90A4AE' }}>{entry.uploadedBy.email}</span></td>
                        <td>{new Date(entry.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                        <td><span className={`badge badge-${entry.status}`}>{entry.status}</span></td>
                        <td>{entry.downloads}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ===== REPORTS TAB ===== */}
        {activeTab === 'reports' && (
          <>
            {loading ? (
              <p className="loading-text">Loading reports...</p>
            ) : reports.length === 0 ? (
              <div className="empty-state"><p>No reports submitted.</p></div>
            ) : (
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Paper</th>
                      <th>Reported By</th>
                      <th>Reason</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map(r => (
                      <tr key={r._id}>
                        <td>{r.paperId ? r.paperId.title : 'Deleted Paper'}</td>
                        <td>{r.reportedBy ? r.reportedBy.name : 'Anonymous'}</td>
                        <td>{r.reason}</td>
                        <td>{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                        <td>
                          {r.status === 'pending' && (
                            <button className="action-btn resolve" onClick={() => handleResolve(r._id)}>Resolve</button>
                          )}
                          {r.paperId && (
                            <a href={r.paperId.fileUrl} target="_blank" rel="noopener noreferrer">
                              <button className="action-btn edit">View</button>
                            </a>
                          )}
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
      </div>

      {/* ===== STATUS CHANGE MODAL ===== */}
      {statusModal && (
        <div className="modal-overlay" onClick={() => setStatusModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Change Paper Status</h3>
            <div className="form-group">
              <label>New Status</label>
              <select value={statusForm.status} onChange={e => setStatusForm({ ...statusForm, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="rejected">Rejected</option>
                <option value="removed">Removed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Reason / Message (optional)</label>
              <textarea value={statusForm.statusMessage} onChange={e => setStatusForm({ ...statusForm, statusMessage: e.target.value })} placeholder="Reason for status change..." />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setStatusModal(null)}>Cancel</button>
              <button className="btn-confirm" onClick={handleStatusChange}>Update Status</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRM MODAL ===== */}
      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Delete Paper Permanently</h3>
            <p style={{ fontFamily: 'Poppins', fontSize: '14px', color: '#546E7A' }}>
              This will permanently remove this paper from the database. This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteModal(null)}>Cancel</button>
              <button className="btn-danger" onClick={handleDeletePaper}>Delete Permanently</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;

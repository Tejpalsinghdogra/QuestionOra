import express from 'express';
import User from '../models/User.js';
import Paper, { getPaperModel, getBlockForDepartment, findPaperById } from '../models/Paper.js';
import Report from '../models/Report.js';
import authMiddleware, { checkRole } from '../middleware/authMiddleware.js';
import { deleteFromCloudinary } from './papers.js';

const router = express.Router();

// @route   POST /api/admin/appoint-teacher
// @desc    Appoint a new teacher by email
// @access  Private (Admin only)
router.post('/appoint-teacher', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'teacher') {
      return res.status(400).json({ message: 'User is already a teacher' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot change an admin role here' });
    }

    user.role = 'teacher';
    await user.save();

    res.json({ message: `Successfully appointed ${user.name} (${user.email}) as a teacher` });
  } catch (error) {
    console.error('Error appointing teacher:', error);
    res.status(500).json({ message: 'Server error appointing teacher' });
  }
});

// @route   GET /api/admin/teachers
// @desc    Get all teachers
// @access  Private (Admin only)
router.get('/teachers', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password').sort({ createdAt: -1 });
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Server error fetching teachers' });
  }
});

// @route   PUT /api/admin/toggle-teacher/:id
// @desc    Activate or deactivate a teacher account
// @access  Private (Admin only)
router.put('/toggle-teacher/:id', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'teacher') {
      return res.status(400).json({ message: 'Can only toggle teacher accounts' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `Teacher ${user.name} has been ${user.isActive ? 'activated' : 'deactivated'}`,
      isActive: user.isActive,
    });
  } catch (error) {
    console.error('Error toggling teacher:', error);
    res.status(500).json({ message: 'Server error toggling teacher status' });
  }
});

// @route   GET /api/admin/all-papers
// @desc    Get all papers with uploader info
// @access  Private (Admin only)
router.get('/all-papers', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    const blocks = ['Block-A', 'Block-B', 'Block-C', 'Block-General'];
    let allPapers = [];
    for (const block of blocks) {
      const Model = getPaperModel(block);
      const papers = await Model.find()
        .populate({ path: 'uploadedBy', select: 'name email', model: User });
      allPapers = allPapers.concat(papers);
    }
    allPapers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(allPapers);
  } catch (error) {
    console.error('Error fetching all papers:', error);
    res.status(500).json({ message: 'Server error fetching papers' });
  }
});

// @route   PUT /api/admin/paper/:id/status
// @desc    Set paper status (reject/remove with a message)
// @access  Private (Admin only)
router.put('/paper/:id/status', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    const { status, statusMessage } = req.body;

    if (!status || !['active', 'rejected', 'removed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be active, rejected, or removed.' });
    }

    const result = await findPaperById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Paper not found' });
    }
    const { paper } = result;

    paper.status = status;
    paper.statusMessage = statusMessage || '';
    const updated = await paper.save();

    res.json({ message: `Paper status updated to "${status}"`, paper: updated });
  } catch (error) {
    console.error('Error updating paper status:', error);
    res.status(500).json({ message: 'Server error updating paper status' });
  }
});

// @route   DELETE /api/admin/paper/:id
// @desc    Hard-delete any paper
// @access  Private (Admin only)
router.delete('/paper/:id', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    const result = await findPaperById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Paper not found' });
    }
    const { paper, Model } = result;

    // Delete file from Cloudinary
    await deleteFromCloudinary(paper.fileUrl);

    await Model.deleteOne({ _id: req.params.id });
    res.json({ message: 'Paper permanently deleted' });
  } catch (error) {
    console.error('Error deleting paper:', error);
    res.status(500).json({ message: 'Server error deleting paper' });
  }
});

// @route   GET /api/admin/audit-log
// @desc    Full audit log of all uploads
// @access  Private (Admin only)
router.get('/audit-log', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    const blocks = ['Block-A', 'Block-B', 'Block-C', 'Block-General'];
    let papers = [];
    for (const block of blocks) {
      const Model = getPaperModel(block);
      const docs = await Model.find()
        .populate({ path: 'uploadedBy', select: 'name email', model: User });
      papers = papers.concat(docs);
    }
    papers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const log = papers.map(p => ({
      _id: p._id,
      title: p.title,
      department: p.department,
      semester: p.semester,
      year: p.year,
      type: p.type,
      status: p.status || 'active',
      uploadedBy: p.uploadedBy ? { name: p.uploadedBy.name, email: p.uploadedBy.email } : { name: 'Deleted User', email: 'N/A' },
      uploadedAt: p.createdAt,
      downloads: p.downloads || 0,
    }));

    res.json(log);
  } catch (error) {
    console.error('Error fetching audit log:', error);
    res.status(500).json({ message: 'Server error fetching audit log' });
  }
});

// @route   GET /api/admin/reports
// @desc    Get all pending reports
// @access  Private (Admin only)
router.get('/reports', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    const populatedReports = [];
    for (const report of reports) {
      const reportObj = report.toObject();
      if (report.paperId) {
        const paperResult = await findPaperById(report.paperId);
        if (paperResult) {
          reportObj.paperId = {
            _id: paperResult.paper._id,
            title: paperResult.paper.title,
            department: paperResult.paper.department,
            semester: paperResult.paper.semester,
            year: paperResult.paper.year,
            type: paperResult.paper.type,
            fileUrl: paperResult.paper.fileUrl,
            status: paperResult.paper.status
          };
        } else {
          reportObj.paperId = null;
        }
      }
      populatedReports.push(reportObj);
    }

    res.json(populatedReports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server error fetching reports' });
  }
});

// @route   PUT /api/admin/report/:id/resolve
// @desc    Mark a report as resolved
// @access  Private (Admin only)
router.put('/report/:id/resolve', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = 'resolved';
    await report.save();

    res.json({ message: 'Report resolved' });
  } catch (error) {
    console.error('Error resolving report:', error);
    res.status(500).json({ message: 'Server error resolving report' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get site-wide stats
// @access  Private (Admin only)
router.get('/stats', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    let totalPapers = 0;
    let activePapers = 0;
    let totalDownloads = 0;
    let papersPerDepartmentMap = {};

    const blocks = ['Block-A', 'Block-B', 'Block-C', 'Block-General'];
    for (const block of blocks) {
      const Model = getPaperModel(block);
      
      const count = await Model.countDocuments();
      totalPapers += count;
      
      const activeCount = await Model.countDocuments({ status: 'active' });
      activePapers += activeCount;

      const downloadAgg = await Model.aggregate([
        { $group: { _id: null, total: { $sum: '$downloads' } } }
      ]);
      if (downloadAgg.length > 0) {
        totalDownloads += downloadAgg[0].total;
      }

      const deptAgg = await Model.aggregate([
        { $group: { _id: '$department', count: { $sum: 1 } } }
      ]);
      for (const d of deptAgg) {
        papersPerDepartmentMap[d._id] = (papersPerDepartmentMap[d._id] || 0) + d.count;
      }
    }

    const papersPerDepartment = Object.entries(papersPerDepartmentMap)
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count);

    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    res.json({
      totalPapers,
      activePapers,
      totalTeachers,
      totalUsers,
      totalDownloads,
      pendingReports,
      papersPerDepartment,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
});

export default router;
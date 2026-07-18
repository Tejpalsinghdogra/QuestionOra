import express from 'express';
import Report from '../models/Report.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/reports
// @desc    Report/flag a paper
// @access  Private (any logged-in user)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { paperId, reason } = req.body;

    if (!paperId || !reason) {
      return res.status(400).json({ message: 'Please provide paperId and reason' });
    }

    const report = await Report.create({
      paperId,
      reportedBy: req.user._id,
      reason,
    });

    res.status(201).json({ message: 'Report submitted successfully', report });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Server error submitting report' });
  }
});

export default router;

import express from 'express';
import Feedback from '../models/Feedback.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/feedback
// @desc    Submit feedback
// @access  Private (logged-in users only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { rating, options, feedbackText } = req.body;

    if (!rating && (!options || options.length === 0)) {
      return res.status(400).json({ message: 'Please provide at least one field' });
    }

    const feedback = await Feedback.create({
      rating: rating ? Number(rating) : undefined,
      options: options || [],
      feedbackText: feedbackText || '',
      submittedBy: req.user._id,
    });

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Server error submitting feedback' });
  }
});

export default router;

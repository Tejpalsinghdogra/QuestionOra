import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import Paper, { getPaperModel, getBlockForDepartment, findPaperById } from '../models/Paper.js';
import authMiddleware, { checkRole } from '../middleware/authMiddleware.js';

dotenv.config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let dept = req.body.department;
    
    // If replacing file, look up department from the database using req.params.id
    if (!dept && req.params.id) {
      try {
        const result = await findPaperById(req.params.id);
        if (result) {
          dept = result.paper.department;
        }
      } catch (err) {
        console.error('Error fetching paper for dynamic folder resolution:', err);
      }
    }
    
    const block = getBlockForDepartment(dept);
    
    return {
      folder: `questionora_papers/${block}`,
      allowed_formats: ['pdf', 'jpg', 'jpeg', 'png'],
      resource_type: 'auto',
    };
  },
});

const upload = multer({ storage: storage });

// Helper to delete a file from Cloudinary given its URL
export const deleteFromCloudinary = async (fileUrl) => {
  try {
    if (!fileUrl) return;
    const uploadIndex = fileUrl.indexOf('/upload/');
    if (uploadIndex === -1) return;
    
    const afterUpload = fileUrl.substring(uploadIndex + 8);
    const parts = afterUpload.split('/');
    
    // Remove version string (e.g. 'v1234567')
    if (parts[0].startsWith('v') && !isNaN(parts[0].substring(1))) {
      parts.shift();
    }
    
    // Join and remove file extension for public_id
    const pathWithoutVersion = parts.join('/');
    const lastDotIndex = pathWithoutVersion.lastIndexOf('.');
    const publicId = lastDotIndex !== -1 ? pathWithoutVersion.substring(0, lastDotIndex) : pathWithoutVersion;
    
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Failed to delete from Cloudinary:', err);
  }
};

// @route   POST /api/papers/upload
// @desc    Upload a new paper
// @access  Private (Teacher/Admin only)
router.post('/upload', authMiddleware, checkRole('teacher', 'admin'), upload.single('file'), async (req, res) => {
  try {
    const { title, department, semester, year, type } = req.body;

    if (!req.file) {
      console.log('No file uploaded in req.file');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!title || !department || !semester || !year || !type) {
      console.log('Missing metadata fields. Body:', req.body);
      return res.status(400).json({ message: 'Please provide all metadata fields' });
    }


    const blockName = getBlockForDepartment(department);
    const PaperModel = getPaperModel(blockName);
    const paper = await PaperModel.create({
      title,
      department,
      semester,
      year,
      type,
      fileUrl: req.file.path,
      uploadedBy: req.user._id,
      block: blockName,
      modificationHistory: [{
        modifiedBy: req.user._id,
        changes: 'Initial upload'
      }]
    });

    res.status(201).json(paper);
  } catch (error) {
    console.error('Error uploading paper:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

// @route   GET /api/papers/my-papers
// @desc    Get papers uploaded by current teacher
// @access  Private (Teacher/Admin only)
router.get('/my-papers', authMiddleware, checkRole('teacher', 'admin'), async (req, res) => {
  try {
    const blocks = ['Block-A', 'Block-B', 'Block-C', 'Block-General'];
    let papers = [];
    for (const block of blocks) {
      const Model = getPaperModel(block);
      const docs = await Model.find({ uploadedBy: req.user._id })
        .populate({ path: 'uploadedBy', select: 'name email', model: mongoose.model('User') });
      papers = papers.concat(docs);
    }
    papers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(papers);
  } catch (error) {
    console.error('Error fetching teacher papers:', error);
    res.status(500).json({ message: 'Server error while fetching papers' });
  }
});

// @route   PUT /api/papers/:id
// @desc    Update paper metadata (only by owner)
// @access  Private (Teacher/Admin only)
router.put('/:id', authMiddleware, checkRole('teacher', 'admin'), async (req, res) => {
  try {
    const { title, department, semester, year, type } = req.body;
    
    const result = await findPaperById(req.params.id);
    
    if (!result || String(result.paper.uploadedBy) !== String(req.user._id)) {
      return res.status(404).json({ message: 'Paper not found or unauthorized' });
    }

    const { paper, Model, block } = result;

    const changes = [];
    if (title && title !== paper.title) changes.push(`title: ${paper.title} → ${title}`);
    if (department && department !== paper.department) changes.push(`department: ${paper.department} → ${department}`);
    if (semester && semester !== paper.semester) changes.push(`semester: ${paper.semester} → ${semester}`);
    if (year && year !== paper.year) changes.push(`year: ${paper.year} → ${year}`);
    if (type && type !== paper.type) changes.push(`type: ${paper.type} → ${type}`);

    if (changes.length === 0) {
      return res.status(400).json({ message: 'No changes detected' });
    }

    const newBlock = getBlockForDepartment(department || paper.department);

    // Update paper fields
    paper.title = title || paper.title;
    if (department) {
      paper.department = department;
      paper.block = newBlock;
    }
    paper.semester = semester || paper.semester;
    paper.year = year || paper.year;
    paper.type = type || paper.type;

    if (newBlock !== block) {
      // Document is changing collections/blocks
      // Delete from old collection
      await Model.deleteOne({ _id: paper._id });
      // Insert into new collection
      const NewModel = getPaperModel(newBlock);
      const newPaperDoc = new NewModel(paper.toObject());
      await newPaperDoc.save();
      res.json(newPaperDoc);
    } else {
      // Save in same collection
      await paper.save();
      res.json(paper);
    }
  } catch (error) {
    console.error('Error updating paper:', error);
    res.status(500).json({ message: 'Server error while updating paper' });
  }
});

// @route   PUT /api/papers/:id/replace-file
// @desc    Replace paper file (only by owner)
// @access  Private (Teacher/Admin only)
router.put('/:id/replace-file', authMiddleware, checkRole('teacher', 'admin'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await findPaperById(req.params.id);
    
    if (!result || String(result.paper.uploadedBy) !== String(req.user._id)) {
      return res.status(404).json({ message: 'Paper not found or unauthorized' });
    }

    const { paper } = result;

    // Store old file URL for potential cleanup
    const oldFileUrl = paper.fileUrl;
    
    // Update paper with new file
    paper.fileUrl = req.file.path;

    await paper.save();
    
    // Delete the old file from Cloudinary to prevent resource leak
    await deleteFromCloudinary(oldFileUrl);
    
    res.json(paper);
  } catch (error) {
    console.error('Error replacing paper file:', error);
    res.status(500).json({ message: 'Server error while replacing file' });
  }
});

// @route   DELETE /api/papers/:id
// @desc    Delete paper (only by owner)
// @access  Private (Teacher/Admin only)
router.delete('/:id', authMiddleware, checkRole('teacher', 'admin'), async (req, res) => {
  try {
    const result = await findPaperById(req.params.id);
    
    if (!result || String(result.paper.uploadedBy) !== String(req.user._id)) {
      return res.status(404).json({ message: 'Paper not found or unauthorized' });
    }

    const { paper, Model } = result;

    // Delete file from Cloudinary to prevent resource leak
    await deleteFromCloudinary(paper.fileUrl);
    
    await Model.deleteOne({ _id: req.params.id });
    res.json({ message: 'Paper deleted successfully' });
  } catch (error) {
    console.error('Error deleting paper:', error);
    res.status(500).json({ message: 'Server error while deleting paper' });
  }
});

// @route   GET /api/papers
// @desc    Get papers based on query filters (approved only for public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { department, semester } = req.query;
    let query = { status: 'active' }; // Only show active papers publicly

    if (department) {
      query.department = department;
      const block = getBlockForDepartment(department);
      const Model = getPaperModel(block);
      if (semester && semester !== 'Sem-All') {
        query.semester = semester;
      }
      const papers = await Model.find(query).sort({ year: -1, createdAt: -1 });
      return res.json(papers);
    } else {
      // Query all blocks if no department is specified
      const blocks = ['Block-A', 'Block-B', 'Block-C', 'Block-General'];
      let allPapers = [];
      if (semester && semester !== 'Sem-All') {
        query.semester = semester;
      }
      for (const block of blocks) {
        const Model = getPaperModel(block);
        const papers = await Model.find(query);
        allPapers = allPapers.concat(papers);
      }
      // Sort by year descending, then by createdAt descending
      allPapers.sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      return res.json(allPapers);
    }
  } catch (error) {
    console.error('Error fetching papers:', error);
    res.status(500).json({ message: 'Server error while fetching papers' });
  }
});

// @route   GET /api/papers/:id/download
// @desc    Track download and return file URL
// @access  Private (Registered users only)
router.get('/:id/download', authMiddleware, async (req, res) => {
  try {
    const result = await findPaperById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Paper not found' });
    }
    const { paper } = result;
    
    paper.downloads = (paper.downloads || 0) + 1;
    await paper.save();
    // Force download by injecting fl_attachment:<safeTitle> into the Cloudinary URL
    let downloadUrl = paper.fileUrl;
    if (downloadUrl.includes('/upload/')) {
      const safeTitle = (paper.title || 'paper').replace(/[^a-zA-Z0-9]/g, '_');
      downloadUrl = downloadUrl.replace('/upload/', `/upload/fl_attachment:${safeTitle}/`);
    }
    
    res.json({ fileUrl: downloadUrl });
  } catch (error) {
    console.error('Error in download tracking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
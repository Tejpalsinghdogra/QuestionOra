import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables for the secondary connection
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const getPapersUri = (uri) => {
  if (!uri) return 'mongodb://localhost:27017/papers';
  const urlParts = uri.split('?');
  const basePath = urlParts[0];
  const queryParams = urlParts[1] ? `?${urlParts[1]}` : '';
  const lastSlashIndex = basePath.lastIndexOf('/');
  if (lastSlashIndex === -1) return uri;
  const host = basePath.substring(0, lastSlashIndex);
  return `${host}/papers${queryParams}`;
};

const papersUri = getPapersUri(process.env.MONGO_URI);
const connPapers = mongoose.createConnection(papersUri);

export const paperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['MSE', 'ESE'],
  },
  fileUrl: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'rejected', 'removed'],
    default: 'active',
  },
  statusMessage: {
    type: String,
    default: '',
  },
  downloads: {
    type: Number,
    default: 0,
  },
  block: {
    type: String,
    enum: ['Block-A', 'Block-B', 'Block-C', 'Block-General'],
    required: false,
  }
}, { timestamps: true });

// Helper to resolve Block name by Department
export const getBlockForDepartment = (dept) => {
  const department = (dept || '').toLowerCase();
  
  const blockBDepts = [
    'btechcse', 'bca', 'bscit', 'btechce', 'btechece', 'btehece',
    'btechae', 'btechmae', 'btechrae', 'btechectwoe', 'btechec2e', 'bscdm'
  ];
  
  const blockADepts = [
    'clayout6', 'clayout8', 'bcomds', 'bbadm', 'bba', 'bcom',
    'bscphysics', 'bscchemistry', 'bscmath', 'bscphysical',
    'bhmct', 'bschm', 'bscath', 'bajmc', 'bdes', 'bpes', 'ba'
  ];
  
  const blockCDepts = [
    'bscmls', 'bpt', 'bscnutrition', 'boptom', 'bscotat', 'bscmrit', 'bpharm'
  ];

  if (blockBDepts.includes(department)) return 'Block-B';
  if (blockADepts.includes(department)) return 'Block-A';
  if (blockCDepts.includes(department)) return 'Block-C';
  
  return 'Block-General';
};

// Dynamically fetch Model bound to a specific collection name on the papers connection
export const getPaperModel = (blockName) => {
  const collectionName = blockName || 'Block-General';
  
  if (connPapers.models[collectionName]) {
    return connPapers.models[collectionName];
  }
  
  return connPapers.model(collectionName, paperSchema, collectionName);
};

// Helper to lookup paper by ID across all block collections on the papers connection
export const findPaperById = async (id) => {
  const blocks = ['Block-A', 'Block-B', 'Block-C', 'Block-General'];
  for (const block of blocks) {
    const Model = getPaperModel(block);
    try {
      const paper = await Model.findById(id);
      if (paper) {
        return { paper, Model, block };
      }
    } catch (err) {
      // CastError or other database error (ignore and continue to next collection)
    }
  }
  return null;
};

const Paper = getPaperModel('paper');
export default Paper;
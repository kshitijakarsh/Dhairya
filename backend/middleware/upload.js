import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

// 🔹 Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'test_uploads', // Folder in Cloudinary
    format: file.mimetype.split('/')[1], // Auto-detect format
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  }),
});

// 🔹 Multer Configuration
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB per file
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

// 🔹 Middleware to Handle Uploads (Up to 5 Files)
export const uploadImages = (req, res, next) => {
  const uploadHandler = upload.array('images', 5); // Accepts up to 5 images

  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Multer Error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

export default upload;

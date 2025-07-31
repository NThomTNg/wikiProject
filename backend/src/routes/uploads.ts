import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files allowed'));
        }
    }
});

// Character image upload
router.post('/character', upload.single('image'), (req: Request, res: Response): void => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const filePath = `/uploads/${req.file.filename}`;
        console.log('Character image uploaded successfully:', filePath);
        
        res.json({ 
            message: 'Character image uploaded successfully',
            filePath: filePath,
            filename: req.file.filename
        });
    } catch (error) {
        console.error('Error uploading character image:', error);
        res.status(500).json({ error: 'Failed to upload character image' });
    }
});

// Religion image upload
router.post('/religion', upload.single('image'), (req: Request, res: Response): void => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const filePath = `/uploads/${req.file.filename}`;
        console.log('Religion image uploaded successfully:', filePath);
        
        res.json({ 
            message: 'Religion image uploaded successfully',
            filePath: filePath,
            filename: req.file.filename
        });
    } catch (error) {
        console.error('Error uploading religion image:', error);
        res.status(500).json({ error: 'Failed to upload religion image' });
    }
});

// Nation image upload
router.post('/nation', upload.single('image'), (req: Request, res: Response): void => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const filePath = `/uploads/${req.file.filename}`;
        console.log('Nation image uploaded successfully:', filePath);
        
        res.json({ 
            message: 'Nation image uploaded successfully',
            filePath: filePath,
            filename: req.file.filename
        });
    } catch (error) {
        console.error('Error uploading nation image:', error);
        res.status(500).json({ error: 'Failed to upload nation image' });
    }
});

export default router;
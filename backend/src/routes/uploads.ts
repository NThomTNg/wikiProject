import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure upload directories exist
const religionUploadDir = path.join(__dirname, '../../uploads/religions');
const characterUploadDir = path.join(__dirname, '../../uploads/characters');

if (!fs.existsSync(religionUploadDir)) {
    fs.mkdirSync(religionUploadDir, { recursive: true });
}

if (!fs.existsSync(characterUploadDir)) {
    fs.mkdirSync(characterUploadDir, { recursive: true });
}

// Common file filter
const fileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

// Religion upload configuration
const religionStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, religionUploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `religion-${uniqueSuffix}${ext}`);
    }
});

const religionUpload = multer({
    storage: religionStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

// Character upload configuration (exact same pattern)
const characterStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, characterUploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `character-${uniqueSuffix}${ext}`);
    }
});

const characterUpload = multer({
    storage: characterStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

// Religion upload endpoint (existing)
router.post('/religion', religionUpload.single('image'), (req: Request, res: Response): void => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const filePath = `/uploads/religions/${req.file.filename}`;
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

// Character upload endpoint (exact same pattern)
router.post('/character', characterUpload.single('image'), (req: Request, res: Response): void => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const filePath = `/uploads/characters/${req.file.filename}`;
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

export default router;
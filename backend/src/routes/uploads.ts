import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

console.log('Loading uploads.ts routes...');

const router = express.Router();

// Add test route to verify router is working
router.get('/test', (req: Request, res: Response) => {
    res.json({ 
        message: 'Upload routes are working!', 
        timestamp: new Date().toISOString(),
        availableRoutes: ['/character', '/religion', '/nation']
    });
});

const uploadsDir = path.join(__dirname, '../../uploads');
console.log('Upload directory:', uploadsDir);

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Storing file in directory:', uploadsDir);
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${extension}`;
        console.log('Generated filename:', filename);
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        console.log('Checking file type:', file.mimetype);
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files allowed'));
        }
    }
});

router.post('/character', upload.single('image'), (req: Request, res: Response): void => {
    try {
        console.log('Character image upload request received');
        console.log('Request body:', req.body);
        console.log('File info:', req.file ? {
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size
        } : 'No file');
        
        if (!req.file) {
            console.log('ERROR: No file in request');
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

router.post('/religion', upload.single('image'), (req: Request, res: Response): void => {
    try {
        console.log('Religion image upload request received');
        console.log('Request body:', req.body);
        console.log('File info:', req.file ? {
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size
        } : 'No file');
        
        if (!req.file) {
            console.log('ERROR: No file in request');
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

router.post('/nation', upload.single('image'), (req: Request, res: Response): void => {
    try {
        console.log('Nation image upload request received');
        console.log('Request body:', req.body);
        console.log('File info:', req.file ? {
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size
        } : 'No file');
        
        if (!req.file) {
            console.log('ERROR: No file in request');
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

console.log('Upload routes defined: /test, /character, /religion, /nation');
export default router;
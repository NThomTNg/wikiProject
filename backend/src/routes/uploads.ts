import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { BlobServiceClient } from '@azure/storage-blob';

console.log('Loading uploads.ts routes...');

const router = express.Router();

// Azure Blob Storage setup
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'wiki-images';

if (!connectionString) {
    console.error('AZURE_STORAGE_CONNECTION_STRING is not set in environment variables');
}

const blobServiceClient = connectionString
    ? BlobServiceClient.fromConnectionString(connectionString)
    : null;

async function uploadToBlob(fileBuffer: Buffer, originalName: string, mimeType: string): Promise<string> {
    if (!blobServiceClient) {
        throw new Error('Azure Blob Storage is not configured');
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Ensure container exists
    await containerClient.createIfNotExists({ access: 'blob' });

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(originalName);
    const blobName = `image-${uniqueSuffix}${extension}`;

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(fileBuffer, {
        blobHTTPHeaders: { blobContentType: mimeType }
    });

    return blockBlobClient.url;
}

// Use multer memory storage (keeps file in buffer, no disk write)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        console.log('Checking file type:', file.mimetype);
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files allowed'));
        }
    }
});

// Add test route to verify router is working
router.get('/test', (req: Request, res: Response) => {
    res.json({
        message: 'Upload routes are working!',
        timestamp: new Date().toISOString(),
        storageType: 'Azure Blob Storage',
        containerName: containerName,
        availableRoutes: ['/character', '/religion', '/nation']
    });
});

router.post('/character', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Character image upload request received');

        if (!req.file) {
            console.log('ERROR: No file in request');
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const blobUrl = await uploadToBlob(req.file.buffer, req.file.originalname, req.file.mimetype);
        console.log('Character image uploaded to blob:', blobUrl);

        res.json({
            message: 'Character image uploaded successfully',
            filePath: blobUrl,
            filename: req.file.originalname
        });
    } catch (error) {
        console.error('Error uploading character image:', error);
        res.status(500).json({ error: 'Failed to upload character image' });
    }
});

router.post('/religion', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Religion image upload request received');

        if (!req.file) {
            console.log('ERROR: No file in request');
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const blobUrl = await uploadToBlob(req.file.buffer, req.file.originalname, req.file.mimetype);
        console.log('Religion image uploaded to blob:', blobUrl);

        res.json({
            message: 'Religion image uploaded successfully',
            filePath: blobUrl,
            filename: req.file.originalname
        });
    } catch (error) {
        console.error('Error uploading religion image:', error);
        res.status(500).json({ error: 'Failed to upload religion image' });
    }
});

router.post('/nation', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Nation image upload request received');

        if (!req.file) {
            console.log('ERROR: No file in request');
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const blobUrl = await uploadToBlob(req.file.buffer, req.file.originalname, req.file.mimetype);
        console.log('Nation image uploaded to blob:', blobUrl);

        res.json({
            message: 'Nation image uploaded successfully',
            filePath: blobUrl,
            filename: req.file.originalname
        });
    } catch (error) {
        console.error('Error uploading nation image:', error);
        res.status(500).json({ error: 'Failed to upload nation image' });
    }
});

console.log('Upload routes defined: /test, /character, /religion, /nation');
export default router;

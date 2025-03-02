import express from 'express';
import cors from 'cors';
import characterRoutes from './routes/characters';
import nationRoutes from './routes/nations';
import locationRoutes from './routes/locations';
import religionRoutes from './routes/religions';
import eventRoutes from './routes/events';
import historyEntryRoutes from './routes/historyEntries';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

const app = express();
const PORT = process.env.PORT || 5000;

const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    console.log(`Creating uploads directory at: ${uploadsDir}`);
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const religionsUploadsDir = path.join(uploadsDir, 'religions');
if (!fs.existsSync(religionsUploadsDir)) {
    console.log(`Creating religions uploads directory at: ${religionsUploadsDir}`);
    fs.mkdirSync(religionsUploadsDir, { recursive: true });
}

const religionStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, religionsUploadsDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'religion-' + uniqueSuffix + ext);
    }
});

const religionUpload = multer({ 
    storage: religionStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Content-Type: ${req.headers['content-type']}`);
    next();
});

app.use(cors({
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    exposedHeaders: ['Content-Disposition']
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static(uploadsDir));
console.log(`Serving static files from: ${uploadsDir} at path /uploads`);

app.get('/api/test-file-serving', (req, res) => {
    res.json({
        uploadsDir,
        fullPath: path.join(process.cwd(), uploadsDir),
        files: fs
            .readdirSync(uploadsDir)
            .map(file => ({ 
                name: file, 
                url: `/uploads/${file}`,
                fullUrl: `http://localhost:5000/uploads/${file}`  
            }))
    });
});

app.use('/api/characters', characterRoutes);
app.use('/api/nations', nationRoutes);  
app.use('/api/locations', locationRoutes);
app.use('/api/religions', religionRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/historyEntries', historyEntryRoutes);

app.post('/api/upload/religion', religionUpload.single('image'), (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }
    
    const filePath = `/uploads/religions/${req.file.filename}`;
    res.json({ 
        success: true, 
        filePath: filePath,
        fileName: req.file.filename
    });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Global error:', err.stack);
    res.status(500).json({
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.use((req, res) => {
    console.log('404 - Route not found:', req.url);
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Current working directory: ${process.cwd()}`);
});
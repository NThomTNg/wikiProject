import express from 'express';
import cors from 'cors';
import path from 'path';
import characterRoutes from './routes/characters';
import religionRoutes from './routes/religions';
import uploadRoutes from './routes/uploads';

const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://fantasywiki-820eyqyzm-nthomasns-projects.vercel.app',
        'https://fantasywiki.vercel.app',
        'https://wiki-backend-production.up.railway.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/characters', characterRoutes);
app.use('/api/religions', religionRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'Fantasy Wiki Backend is running'
    });
});

app.use('*', (req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ 
        error: 'Route not found',
        method: req.method,
        path: req.originalUrl
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Upload routes available at /api/upload/religion and /api/upload/character`);
});

export default app;
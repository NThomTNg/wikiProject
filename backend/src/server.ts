import express from 'express';
import cors from 'cors';
import characterRoutes from './routes/characters';
import nationRoutes from './routes/nations';
import locationRoutes from './routes/locations';
import religionRoutes from './routes/religions';
import eventRoutes from './routes/events';
import historyEntryRoutes from './routes/historyEntries';

const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://localhost:3000',
        'https://fantasywiki-820eyqyzm-nthomasns-projects.vercel.app',
        'https://fantasywiki.vercel.app'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
}));

app.use(express.json());

app.use('/api/characters', characterRoutes);
app.use('/api/nations', nationRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/religions', religionRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/historyEntries', historyEntryRoutes);

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
});
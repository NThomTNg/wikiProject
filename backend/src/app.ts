import express from 'express';
import cors from 'cors';
import path from 'path';
import characterRoutes from './routes/characters';
import religionRoutes from './routes/religions';
import uploadRoutes from './routes/uploads';

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/characters', characterRoutes);
app.use('/api/religions', religionRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Upload routes available at /api/upload/religion and /api/upload/character`);
});

export default app;
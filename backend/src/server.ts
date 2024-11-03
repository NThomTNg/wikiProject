import express from 'express';
import cors from 'cors';
import characterRoutes from './routes/characters';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',  
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));

app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

app.use('/uploads', express.static(uploadDir));

app.use('/api/characters', characterRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';
import characterRoutes from './routes/characters';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/characters', characterRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import express from 'express';
import multer from 'multer';
import path from 'path';

import { 
    getCharacters, 
    getCharacterById, 
    addCharacter,
    deleteCharacter,
    updateCharacter
} from '../controllers/characterController';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage });

router.post('/', addCharacter); 
router.get('/', getCharacters);
router.get('/:id', getCharacterById);
router.delete('/:id', deleteCharacter);
router.put('/:id', updateCharacter);

export default router;

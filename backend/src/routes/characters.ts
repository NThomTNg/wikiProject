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

router.post('/', addCharacter); 
router.get('/', getCharacters);
router.get('/:id', getCharacterById);
router.delete('/:id', deleteCharacter);
router.put('/:id', updateCharacter);

export default router;

import express from 'express';
import {
    getNations,
    getNationById,
    addNation,
    updateNation,
    deleteNation
} from '../controllers/nationsController';

const router = express.Router();

router.get('/', getNations);
router.get('/:id', getNationById);
router.post('/', addNation);
router.put('/:id', updateNation);
router.delete('/:id', deleteNation);

export default router;

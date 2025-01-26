import express from 'express';
import {
    getNations,
    getNationById,
    addNation,
    deleteNation
} from '../controllers/nationsController';

const router = express.Router();

router.get('/', getNations);
router.get('/:id', getNationById);
router.post('/', addNation);
router.delete('/:id', deleteNation);

export default router;

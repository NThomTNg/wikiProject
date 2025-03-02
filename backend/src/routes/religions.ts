import express from 'express';
import {
    getReligions,
    getReligionById,
    addReligion,
    updateReligion,
    deleteReligion
} from '../controllers/religionsController';

const router = express.Router();

router.get('/', getReligions);
router.get('/:id', getReligionById);
router.post('/', addReligion);
router.put('/:id', updateReligion);
router.delete('/:id', deleteReligion);

export default router;

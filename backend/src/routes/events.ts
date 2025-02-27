import express from 'express';
import {
    getEvents,
    getEventById,
    addEvent,
    updateEvent,
    deleteEvent
} from '../controllers/eventsController';

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', addEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;

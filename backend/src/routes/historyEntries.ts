import express from 'express';
import {
  getHistoryEntries,
  getHistoryEntryById,
  addHistoryEntry,
  updateHistoryEntry,
  deleteHistoryEntry
} from '../controllers/historyEntriesController';

const router = express.Router();

router.get('/', getHistoryEntries);
router.get('/:id', getHistoryEntryById);
router.post('/', addHistoryEntry);
router.put('/:id', updateHistoryEntry);
router.delete('/:id', deleteHistoryEntry);

export default router;

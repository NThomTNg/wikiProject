import express from 'express';
import { 
    getLocations, 
    getLocationById, 
    createLocation, 
    deleteLocation 
} from '../controllers/locationsController';

const router = express.Router();

router.get('/', getLocations);
router.get('/:id', getLocationById);
router.post('/', createLocation);
router.delete('/:id', deleteLocation);

export default router;

import express from 'express';

import { getRooms, createRoom, deleteRoom, updateRoom } from '../controllers/rooms.js';

const router = express.Router();

router.get('/', getRooms);
router.post('/', createRoom);
router.delete('/:id', deleteRoom);
router.post('/updateRoom/:id', updateRoom);

export default router;
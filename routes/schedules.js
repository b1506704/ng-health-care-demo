import express from 'express';

import { getSchedules, createSchedule, deleteSchedule, updateSchedule } from '../controllers/schedules.js';

const router = express.Router();

router.get('/', getSchedules);
router.post('/', createSchedule);
router.delete('/:id', deleteSchedule);
router.post('/updateSchedule/:id', updateSchedule);

export default router;
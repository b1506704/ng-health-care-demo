import express from 'express';

import { getDoctors, createDoctor, deleteDoctor, updateDoctor } from '../controllers/doctors.js';

const router = express.Router();

router.get('/', getDoctors);
router.post('/', createDoctor);
router.delete('/:id', deleteDoctor);
router.post('/updateDoctor/:id', updateDoctor);

export default router;
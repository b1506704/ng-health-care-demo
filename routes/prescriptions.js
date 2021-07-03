import express from 'express';

import { getPrescriptions, createPrescription, deletePrescription, updatePrescription } from '../controllers/prescriptions.js';

const router = express.Router();

router.get('/', getPrescriptions);
router.post('/', createPrescription);
router.delete('/:id', deletePrescription);
router.post('/updatePrescription/:id', updatePrescription);

export default router;
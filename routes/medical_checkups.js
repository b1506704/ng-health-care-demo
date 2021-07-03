import express from 'express';

import { getMedicalCheckups, createMedicalCheckup, deleteMedicalCheckup, updateMedicalCheckup } from '../controllers/medical_checkups.js';

const router = express.Router();

router.get('/', getMedicalCheckups);
router.post('/', createMedicalCheckup);
router.delete('/:id', deleteMedicalCheckup);
router.post('/updateMedicalCheckup/:id', updateMedicalCheckup);

export default router;
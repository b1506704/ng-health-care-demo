import express from 'express';

import { getMedicines, createMedicine, deleteMedicine, updateMedicine } from '../controllers/medicines.js';

const router = express.Router();

router.get('/', getMedicines);
router.post('/', createMedicine);
router.delete('/:id', deleteMedicine);
router.post('/updateMedicine/:id', updateMedicine);

export default router;
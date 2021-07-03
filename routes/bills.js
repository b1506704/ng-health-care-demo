import express from 'express';

import { getBills, createBill, deleteBill, updateBill } from '../controllers/bills.js';

const router = express.Router();

router.get('/', getBills);
router.post('/', createBill);
router.delete('/:id', deleteBill);
router.post('/updateBill/:id', updateBill);

export default router;
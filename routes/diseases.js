import express from 'express';

import { getDiseases, createDisease, deleteDisease, updateDisease } from '../controllers/diseases.js';

const router = express.Router();

router.get('/', getDiseases);
router.post('/', createDisease);
router.delete('/:id', deleteDisease);
router.post('/updateDisease/:id', updateDisease);

export default router;
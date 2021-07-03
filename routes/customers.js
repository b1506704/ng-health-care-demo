import express from 'express';

import { getCustomers, createCustomer, deleteCustomer, updateCustomer } from '../controllers/customers.js';

const router = express.Router();

router.get('/', getCustomers);
router.post('/', createCustomer);
router.delete('/:id', deleteCustomer);
router.post('/updateCustomer/:id', updateCustomer);

export default router;
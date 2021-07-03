import express from 'express';

import { getImages, createImage, deleteImage, updateImage } from '../controllers/images.js';

const router = express.Router();

router.get('/', getImages);
router.post('/', createImage);
router.delete('/:id', deleteImage);
router.post('/updateImage/:id', updateImage);

export default router;
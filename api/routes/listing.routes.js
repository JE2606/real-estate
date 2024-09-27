import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings } from '../controllers/listing.controllers.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyUser, createListing);
router.delete('/delete/:id', verifyUser, deleteListing);
router.patch('/update/:id', verifyUser, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);

export default router;
import express from 'express';
import { deleteUser, updateUser,  getUserListings, getUser} from '../controllers/user.controllers.js';
import { verifyUser } from '../utils/verifyUser.js';


const router = express.Router();

router.patch('/update/:id', verifyUser, updateUser)
router.delete('/delete/:id', verifyUser, deleteUser)
router.get('/listings/:id', verifyUser, getUserListings)
router.get('/:id', verifyUser, getUser)

export default router;
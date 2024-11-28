import express from 'express';
import { auth } from '../middleware/auth.js';
import { paymentController } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/initiate', auth, paymentController.initiatePayment);
router.get('/history', auth, paymentController.getPaymentHistory);
router.patch('/status/:id', auth, paymentController.updatePaymentStatus);
router.get('/verification', auth, paymentController.getVerificationData);

export default router;
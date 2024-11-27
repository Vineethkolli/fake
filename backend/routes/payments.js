import express from 'express';
import { auth } from '../middleware/auth.js';
import { paymentController } from '../controllers/paymentController.js';

const router = express.Router();

router.get('/history', auth, paymentController.getPaymentHistory);
router.get('/status/:paymentId', auth, paymentController.getPaymentStatus);
router.post('/initiate', auth, paymentController.initiatePayment);
router.post('/verify', paymentController.verifyPayment);

export default router;

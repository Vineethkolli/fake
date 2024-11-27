import express from 'express';
import { paymentController } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/initiate', paymentController.initiatePayment);
router.get('/status/:paymentId', paymentController.getPaymentStatus);
router.post('/verify', paymentController.verifyPayment);
router.get('/history', paymentController.getPaymentHistory);

export default router;

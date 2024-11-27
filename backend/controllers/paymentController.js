import { paymentService } from '../services/paymentService.js';

export const paymentController = {
  initiatePayment: async (req, res) => {
    try {
      const { amount, registerId, name, phoneNumber } = req.body;

      if (!amount || !registerId || !name || !phoneNumber) {
        return res.status(400).json({
          message: 'All fields (amount, registerId, name, phoneNumber) are required',
          error: 'MISSING_REQUIRED_FIELDS',
        });
      }

      const paymentData = { amount, registerId, name, phoneNumber, ...req.body };
      const payment = await paymentService.initiatePayment(paymentData);

      res.status(201).json(payment);
    } catch (error) {
      console.error('Payment initiation error:', error);
      res.status(500).json({
        message: 'Payment initiation failed',
        error: error.message,
      });
    }
  },

  getPaymentStatus: async (req, res) => {
    try {
      const { paymentId } = req.params;

      if (!paymentId) {
        return res.status(400).json({
          message: 'Payment ID is required',
          error: 'MISSING_PAYMENT_ID',
        });
      }

      const payment = await paymentService.getPaymentStatus(paymentId);
      res.json(payment);
    } catch (error) {
      console.error('Payment status error:', error);
      res.status(500).json({
        message: 'Failed to get payment status',
        error: error.message,
      });
    }
  },

  verifyPayment: async (req, res) => {
    try {
      const { paymentId, status } = req.body;

      if (!paymentId || !status) {
        return res.status(400).json({
          message: 'Payment ID and status are required',
          error: 'MISSING_REQUIRED_FIELDS',
        });
      }

      const payment = await paymentService.updatePaymentStatus(paymentId, status);
      res.json({
        message: 'Payment status updated successfully',
        status: payment.status,
      });
    } catch (error) {
      console.error('Payment verification error:', error);
      res.status(500).json({
        message: 'Payment verification failed',
        error: error.message,
      });
    }
  },

  getPaymentHistory: async (req, res) => {
    try {
      const { registerId } = req.body;

      if (!registerId) {
        return res.status(400).json({
          message: 'Register ID is required',
          error: 'MISSING_REGISTER_ID',
        });
      }

      const payments = await paymentService.getPaymentHistory(registerId);
      res.json(payments);
    } catch (error) {
      console.error('Payment history error:', error);
      res.status(500).json({
        message: 'Failed to fetch payment history',
        error: error.message,
      });
    }
  },
};

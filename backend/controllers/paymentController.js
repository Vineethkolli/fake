import Payment from '../models/Payment.js';
import Income from '../models/Income.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { PAYMENT_CONFIG } from '../config/payment.js';

export const paymentController = {
  initiatePayment: async (req, res) => {
    try {
      const { name, email, phoneNumber, amount, screenshot, registerId } = req.body;

      if (!amount || !name || !phoneNumber || !screenshot || !registerId) {
        return res.status(400).json({
          message: 'All required fields must be provided'
        });
      }

      // Upload screenshot to Cloudinary
      const screenshotUrl = await uploadToCloudinary(screenshot);

      // Create payment record
      const payment = await Payment.create({
        registerId,
        name,
        email,
        phoneNumber,
        amount: parseFloat(amount),
        screenshot: screenshotUrl,
        transactionStatus: PAYMENT_CONFIG.STATUS.TRANSACTION.PENDING,
        verificationStatus: PAYMENT_CONFIG.STATUS.VERIFICATION.NOT_VERIFIED
      });

      res.status(201).json({
        message: 'Payment submitted successfully. We will verify and confirm your payment within 4 hours.',
        payment
      });
    } catch (error) {
      console.error('Payment initiation error:', error);
      res.status(500).json({
        message: 'Payment initiation failed',
        error: error.message
      });
    }
  },

  getPaymentHistory: async (req, res) => {
    try {
      const { registerId } = req.user;
      const payments = await Payment.find({ registerId })
        .sort({ createdAt: -1 });
      res.json(payments);
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch payment history',
        error: error.message
      });
    }
  },

  updatePaymentStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { verificationStatus, belongsTo, name } = req.body;
      
      const payment = await Payment.findById(id);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      // Check if name exists in Income collection when verifying
      if (verificationStatus === PAYMENT_CONFIG.STATUS.VERIFICATION.VERIFIED) {
        const existingIncome = await Income.findOne({ name });
        if (existingIncome) {
          return res.status(400).json({ 
            message: 'Name already exists in income records. Please update the name.',
            existingIncome
          });
        }

        // Update payment status to successful when verified
        payment.transactionStatus = PAYMENT_CONFIG.STATUS.TRANSACTION.SUCCESSFUL;
        
        // Create income entry
        await Income.create({
          registerId: payment.registerId,
          name: payment.name,
          email: payment.email,
          phoneNumber: payment.phoneNumber,
          amount: payment.amount,
          status: 'paid',
          paymentMode: 'web app',
          belongsTo: belongsTo || payment.belongsTo,
          verifyLog: PAYMENT_CONFIG.STATUS.VERIFICATION.VERIFIED
        });
      } else if (verificationStatus === PAYMENT_CONFIG.STATUS.VERIFICATION.REJECTED) {
        payment.transactionStatus = PAYMENT_CONFIG.STATUS.TRANSACTION.FAILED;
      } else {
        payment.transactionStatus = PAYMENT_CONFIG.STATUS.TRANSACTION.PENDING;
      }

      // Update payment details
      if (name) payment.name = name;
      if (belongsTo) payment.belongsTo = belongsTo;
      payment.verificationStatus = verificationStatus;

      await payment.save();
      res.json({ message: 'Payment status updated successfully', payment });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to update payment status',
        error: error.message
      });
    }
  },

  getVerificationData: async (req, res) => {
    try {
      const payments = await Payment.find()
        .sort({ createdAt: -1 });
      res.json(payments);
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch verification data',
        error: error.message
      });
    }
  }
};
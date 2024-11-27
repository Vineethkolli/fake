import Payment from '../models/Payment.js';
import { generatePaymentId, generateUPIUrl, validatePaymentAmount } from '../utils/paymentUtils.js';
import { PAYMENT_CONFIG } from '../config/payment.js';

export const paymentService = {
  async initiatePayment(paymentData) {
    const { amount, registerId, name, phoneNumber, email = '' } = paymentData;

    if (!registerId || !name || !phoneNumber) {
      throw new Error('Invalid data. Required fields: registerId, name, phoneNumber');
    }

    if (!validatePaymentAmount(amount)) {
      throw new Error('Invalid payment amount. Amount must be between ₹1 and ₹1,00,000');
    }

    const paymentId = generatePaymentId();
    const upiUrl = generateUPIUrl(amount, paymentId);

    try {
      const payment = await Payment.create({
        paymentId,
        registerId,
        name,
        email,
        phoneNumber,
        amount: Number(amount),
        status: PAYMENT_CONFIG.STATUS.PENDING,
        paymentMode: 'upi',
        upiUrl,
      });

      return {
        paymentId: payment.paymentId,
        amount: payment.amount,
        upiUrl: payment.upiUrl,
        qrCodePath: PAYMENT_CONFIG.UPI.QR_CODE_PATH,
        upiId: PAYMENT_CONFIG.UPI.ID,
        merchantName: PAYMENT_CONFIG.UPI.MERCHANT_NAME,
      };
    } catch (error) {
      console.error('Payment creation error:', error);
      throw new Error(`Failed to create payment record: ${error.message}`);
    }
  },

  async updatePaymentStatus(paymentId, status) {
    if (!paymentId) {
      throw new Error('Payment ID is required');
    }

    if (!Object.values(PAYMENT_CONFIG.STATUS).includes(status)) {
      throw new Error(`Invalid payment status. Must be one of: ${Object.values(PAYMENT_CONFIG.STATUS).join(', ')}`);
    }

    const payment = await Payment.findOneAndUpdate(
      { paymentId },
      { status },
      { new: true }
    );

    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment;
  },

  async getPaymentStatus(paymentId) {
    if (!paymentId) {
      throw new Error('Payment ID is required');
    }

    const payment = await Payment.findOne({ paymentId });
    if (!payment) {
      throw new Error('Payment not found');
    }

    return {
      paymentId: payment.paymentId,
      status: payment.status,
      amount: payment.amount,
    };
  },

  async getPaymentHistory(registerId) {
    if (!registerId) {
      throw new Error('Register ID is required');
    }

    return Payment.find({ registerId })
      .sort({ createdAt: -1 })
      .select('-upiUrl');
  },
};

import Payment from '../models/payment.js';
import { generatePaymentId, generateUPIUrl } from '../utils/paymentUtils.js';

export const paymentService = {
  async initiatePayment(data) {
    const { amount, registerId, name, phoneNumber } = data;

    const paymentId = generatePaymentId();
    const upiUrl = generateUPIUrl(amount, paymentId);

    const payment = await Payment.create({
      paymentId,
      registerId,
      name,
      phoneNumber,
      amount,
      upiUrl,
    });

    return {
      paymentId,
      amount,
      upiUrl,
      merchantVPA: payment.upiUrl,
    };
  },

  async getPaymentStatus(paymentId) {
    const payment = await Payment.findOne({ paymentId });
    if (!payment) throw new Error('Payment not found');
    return payment;
  },

  async getPaymentHistory(registerId) {
    return Payment.find({ registerId }).sort({ createdAt: -1 });
  },

  async updatePaymentStatus(paymentId, status) {
    return Payment.findOneAndUpdate({ paymentId }, { status }, { new: true });
  },
};

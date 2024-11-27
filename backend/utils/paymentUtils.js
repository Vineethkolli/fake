import { PAYMENT_CONFIG } from '../config/payment.js';

export const generatePaymentId = () => `PAY${Date.now()}${Math.random().toString(36).substr(2, 6)}`;

export const generateUPIUrl = (amount, transactionId) => {
  const params = new URLSearchParams({
    pa: PAYMENT_CONFIG.UPI.MERCHANT_VPA,
    pn: PAYMENT_CONFIG.UPI.MERCHANT_NAME,
    am: amount.toString(),
    cu: 'INR',
    tr: transactionId,
  });

  return `upi://pay?${params.toString()}`;
};

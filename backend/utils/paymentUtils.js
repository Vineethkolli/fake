import crypto from 'crypto';
import { PAYMENT_CONFIG } from '../config/payment.js';

export const generatePaymentId = () => {
  return `PAY${Date.now()}${crypto.randomBytes(4).toString('hex')}`;
};

export const generateUPIUrl = (amount, transactionId) => {
  const params = new URLSearchParams({
    pa: PAYMENT_CONFIG.UPI.MERCHANT_VPA,
    pn: PAYMENT_CONFIG.UPI.MERCHANT_NAME,
    tn: `Payment_${transactionId}`,
    am: amount.toString(),
    cu: 'INR',
    tr: transactionId
  });
  
  return `upi://pay?${params.toString()}`;
};

export const validatePaymentAmount = (amount) => {
  const numAmount = Number(amount);
  return !isNaN(numAmount) && numAmount > 0 && numAmount <= 100000; // Maximum limit of ₹1,00,000
};

export const validateUserData = (userData) => {
  const requiredFields = ['id', 'registerId', 'name', 'phoneNumber'];
  return requiredFields.every(field => userData?.[field]);
};
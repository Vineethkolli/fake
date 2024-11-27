import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const PAYMENT_CONFIG = {
  UPI: {
    ID: process.env.UPI_ID || 'nbkyouth@upi',
    MERCHANT_NAME: process.env.UPI_MERCHANT_NAME || 'NBK Youth',
    MERCHANT_VPA: process.env.UPI_MERCHANT_VPA || 'nbkyouth@upi',
    QR_CODE_PATH: process.env.UPI_QR_CODE_PATH || '/assets/payments/upi-qr.png',
  },
  STATUS: {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILED: 'failed',
  },
};

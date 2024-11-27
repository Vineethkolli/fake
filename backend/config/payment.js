import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const PAYMENT_CONFIG = {
  UPI: {
    ID: process.env.UPI_ID || '7032324041@ptsbi',
    MERCHANT_NAME: process.env.UPI_MERCHANT_NAME || 'NBK Youth',
    MERCHANT_VPA: process.env.UPI_MERCHANT_VPA || '7032324041@ptsbi',
  },
  STATUS: {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILED: 'failed',
  },
};

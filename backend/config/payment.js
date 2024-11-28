import dotenv from 'dotenv';

dotenv.config();

export const PAYMENT_CONFIG = {
  UPI: {
    ID: process.env.UPI_ID || 'nbkyouth@upi',
    NUMBER: process.env.UPI_NUMBER || '7032324041',
    MERCHANT_NAME: process.env.UPI_MERCHANT_NAME || 'NBK Youth'
  },
  STATUS: {
    TRANSACTION: {
      PENDING: 'pending',
      SUCCESSFUL: 'successful',
      FAILED: 'failed'
    },
    VERIFICATION: {
      VERIFIED: 'verified',
      NOT_VERIFIED: 'not verified',
      REJECTED: 'rejected'
    }
  }
};
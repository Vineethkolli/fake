import mongoose from 'mongoose';
import { generatePaymentId } from '../utils/paymentUtils.js';

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      unique: true,
      required: true,
      default: generatePaymentId,
    },
    registerId: {
      type: String,
      required: [true, 'Register ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      default: '',
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be at least ₹1'],
      max: [100000, 'Amount cannot exceed ₹1,00,000'],
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    paymentMode: {
      type: String,
      enum: ['upi'],
      default: 'upi',
    },
    upiUrl: {
      type: String,
    },
    transactionDetails: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

paymentSchema.index({ paymentId: 1 }, { unique: true });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

export default mongoose.model('Payment', paymentSchema);

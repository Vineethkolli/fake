import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('PaymentCounter', counterSchema);

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registerId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: String,
  phoneNumber: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  }
}, { timestamps: true });

// Generate paymentId
paymentSchema.pre('save', async function(next) {
  if (!this.paymentId) {
    const counter = await Counter.findByIdAndUpdate(
      'paymentId',
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.paymentId = `P${counter.seq.toString().padStart(2, '0')}`;
  }
  next();
});

export default mongoose.model('Payment', paymentSchema);
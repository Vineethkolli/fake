import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

const userSchema = new mongoose.Schema({
  registerId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'developer', 'financier'],
    default: 'user'
  },
  pushSubscription: {
    type: Object,
    select: false
  },
  notificationsEnabled: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Generate registerId
userSchema.pre('save', async function (next) {
  if (!this.registerId) {
    const counter = await Counter.findByIdAndUpdate(
      'registerId',
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    // Remove padding logic to start from R0, R1, R2, ...
    this.registerId = `R${counter.seq}`;
  }
  next();
});


// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
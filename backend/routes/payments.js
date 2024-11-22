import express from 'express';
import { auth } from '../middleware/auth.js';
import Payment from '../models/Payment.js';
import PaytmChecksum from 'paytmchecksum';

const router = express.Router();

const PAYTM_MERCHANT_KEY = process.env.PAYTM_MERCHANT_KEY;
const PAYTM_MERCHANT_ID = process.env.PAYTM_MERCHANT_ID;
const PAYTM_WEBSITE = process.env.NODE_ENV === 'production' ? 'DEFAULT' : 'WEBSTAGING';

// Get payment history
router.get('/history', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payment history' });
  }
});

// Initiate payment
router.post('/initiate', auth, async (req, res) => {
  try {
    const { name, email, phoneNumber, amount } = req.body;
    
    // Create payment record
    const payment = await Payment.create({
      userId: req.user.id,
      registerId: req.user.registerId,
      name,
      email,
      phoneNumber,
      amount
    });

    const paytmParams = {
      MID: PAYTM_MERCHANT_ID,
      WEBSITE: PAYTM_WEBSITE,
      INDUSTRY_TYPE_ID: 'Retail',
      CHANNEL_ID: 'WEB',
      ORDER_ID: payment.paymentId,
      CUST_ID: req.user.id,
      TXN_AMOUNT: amount.toString(),
      CALLBACK_URL: `${req.protocol}://${req.get('host')}/api/payments/callback`,
    };

    const checksum = await PaytmChecksum.generateSignature(
      paytmParams,
      PAYTM_MERCHANT_KEY
    );

    const paytmConfig = {
      ...paytmParams,
      CHECKSUMHASH: checksum,
    };

    res.json({ paytmConfig, paymentId: payment.paymentId });
  } catch (error) {
    res.status(500).json({ message: 'Payment initiation failed' });
  }
});

// Payment callback
router.post('/callback', async (req, res) => {
  try {
    const paytmParams = {};
    Object.keys(req.body).forEach(key => {
      if (key === 'CHECKSUMHASH') {
        paytmParams.CHECKSUMHASH = req.body[key];
      } else {
        paytmParams[key] = req.body[key];
      }
    });

    const isValidChecksum = await PaytmChecksum.verifySignature(
      paytmParams,
      PAYTM_MERCHANT_KEY,
      paytmParams.CHECKSUMHASH
    );

    if (isValidChecksum) {
      const payment = await Payment.findOne({ paymentId: req.body.ORDERID });
      if (payment) {
        payment.status = req.body.STATUS === 'TXN_SUCCESS' ? 'success' : 'failed';
        await payment.save();
      }

      if (req.body.STATUS === 'TXN_SUCCESS') {
        res.redirect('/payment-success');
      } else {
        res.redirect('/payment-failed');
      }
    } else {
      res.status(400).json({ message: 'Invalid checksum' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

export default router;
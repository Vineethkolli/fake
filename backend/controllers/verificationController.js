import Income from '../models/Income.js';
import Payment from '../models/Payment.js'; // Assuming you have a Payment model for handling UPI payments
import IncomeLog from '../models/IncomeLog.js';

export const verificationController = {
  // Get verification data
  getVerificationData: async (req, res) => {
    try {
      const { type } = req.params;
      const { verifyLog } = req.query;

      let query = {};
      if (verifyLog) {
        query.verifyLog = verifyLog;
      }

      let data;
      if (type === 'income') {
        data = await Income.find(query).sort({ createdAt: -1 });
      } else if (type === 'payment') {
        data = await Payment.find(query).sort({ createdAt: -1 });
      } else {
        return res.status(400).json({ message: 'Invalid type specified' });
      }

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch verification data', error });
    }
  },

  // Update verification status
  updateVerificationStatus: async (req, res) => {
    try {
      const { type, id } = req.params;
      const { verifyLog, registerId, belongsTo } = req.body;

      let item;
      let Model;
      let logData = {};

      if (type === 'payment') {
        Model = Payment;
      } else if (type === 'income') {
        Model = Income;
      } else {
        return res.status(400).json({ message: 'Invalid type specified' });
      }

      item = await Model.findById(id);
      if (!item) {
        return res.status(404).json({ message: `${type} not found` });
      }

      // Update status and handle specific logic based on verification
      if (verifyLog === 'verified') {
        item.transactionStatus = 'successful';
        item.status = 'verified';

        if (type === 'payment') {
          // Add verified payment to Income
          const incomeData = {
            name: item.name,
            amount: item.amount,
            registerId: item.registerId,
            paymentMode: 'Web App',
            status: 'paid',
            belongsTo: belongsTo || 'Unassigned',
          };
          await Income.create(incomeData);
        }
      } else if (verifyLog === 'rejected') {
        item.transactionStatus = 'failed';
        item.status = 'rejected';
      } else {
        item.transactionStatus = 'pending';
        item.status = 'not verified';
      }

      // Log the verification change
      logData = {
        [`${type}Id`]: item._id,
        registerId,
        originalData: item.toObject(),
        updatedData: { ...item.toObject(), verifyLog, transactionStatus: item.transactionStatus },
      };

      await IncomeLog.create(logData);
      await item.save();

      res.json({ message: 'Verification status updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update verification status', error });
    }
  },
};

import Income from '../models/Income.js';
import Expense from '../models/Expense.js';
import IncomeLog from '../models/IncomeLog.js';
import ExpenseLog from '../models/ExpenseLog.js';

export const verificationController = {
  // Get verification data
  getVerificationData: async (req, res) => {
    try {
      const { type } = req.params;
      const { verifyLog } = req.query;

      let query = { verifyLog };
      let data;

      if (type === 'income') {
        data = await Income.find(query)
          .sort({ createdAt: -1 });
      } else if (type === 'expense') {
        data = await Expense.find(query)
          .sort({ createdAt: -1 });
      } else {
        return res.status(400).json({ message: 'Invalid type specified' });
      }

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch verification data' });
    }
  },

  // Update verification status
  updateVerificationStatus: async (req, res) => {
    try {
      const { type, id } = req.params;
      const { verifyLog, registerId } = req.body;

      let item;
      let Model;
      let LogModel;

      if (type === 'income') {
        Model = Income;
        LogModel = IncomeLog;
      } else if (type === 'expense') {
        Model = Expense;
        LogModel = ExpenseLog;
      } else {
        return res.status(400).json({ message: 'Invalid type specified' });
      }

      item = await Model.findById(id);
      if (!item) {
        return res.status(404).json({ message: `${type} not found` });
      }

      // If status is changing to rejected, move to recycle bin
      if (verifyLog === 'rejected') {
        item.isDeleted = true;
        item.deletedAt = new Date();
        item.deletedBy = registerId;
      }

      // Create log entry
      await LogModel.create({
        [`${type}Id`]: item._id,
        registerId,
        originalData: item.toObject(),
        updatedData: { ...item.toObject(), verifyLog }
      });

      // Update verification status
      item.verifyLog = verifyLog;
      await item.save();

      res.json({ message: 'Verification status updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update verification status' });
    }
  }
};
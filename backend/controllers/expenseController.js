import Expense from '../models/Expense.js';
import ExpenseLog from '../models/ExpenseLog.js';

export const expenseController = {
  // Get all expenses with filters
  getExpenses: async (req, res) => {
    try {
      const { search, paymentMode, verifyLog } = req.query;
      let query = { isDeleted: false };

      if (search) {
        query.$or = [
          { expenseId: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
          { amount: !isNaN(search) ? Number(search) : undefined },
          { purpose: { $regex: search, $options: 'i' } }
        ].filter(Boolean);
      }

      if (paymentMode) query.paymentMode = paymentMode;
      if (verifyLog) query.verifyLog = verifyLog;

      const expenses = await Expense.find(query).sort({ createdAt: -1 });
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch expenses' });
    }
  },

  // Get verification data
  getVerificationData: async (req, res) => {
    try {
      const { verifyLog } = req.query;
      const expenses = await Expense.find({ verifyLog, isDeleted: false })
        .sort({ createdAt: -1 });
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch verification data' });
    }
  },

  // Create new expense
  createExpense: async (req, res) => {
    try {
      const expense = await Expense.create({
        ...req.body,
        verifyLog: 'not verified'
      });
      res.status(201).json(expense);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create expense' });
    }
  },

  // Update expense
  updateExpense: async (req, res) => {
    try {
      const expense = await Expense.findById(req.params.id);
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
      }

      // Create log entry
      await ExpenseLog.create({
        expenseId: expense._id,
        registerId: req.body.registerId,
        originalData: expense.toObject(),
        updatedData: req.body
      });

      // Update expense and set verifyLog to 'not verified'
      const updatedExpense = await Expense.findByIdAndUpdate(
        req.params.id,
        { ...req.body, verifyLog: 'not verified' },
        { new: true }
      );

      res.json(updatedExpense);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update expense' });
    }
  },

  // Update verification status
  updateVerificationStatus: async (req, res) => {
    try {
      const { verifyLog, registerId } = req.body;
      const expense = await Expense.findById(req.params.id);

      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
      }

      // If status is changing to rejected, move to recycle bin
      if (verifyLog === 'rejected') {
        expense.isDeleted = true;
        expense.deletedAt = new Date();
        expense.deletedBy = registerId;
      }

      // Create log entry
      await ExpenseLog.create({
        expenseId: expense._id,
        registerId,
        originalData: expense.toObject(),
        updatedData: { ...expense.toObject(), verifyLog }
      });

      // Update verification status
      expense.verifyLog = verifyLog;
      await expense.save();

      res.json({ message: 'Verification status updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update verification status' });
    }
  },

  // Get modification logs
  getLogs: async (req, res) => {
    try {
      const { search } = req.query;
      let query = {};

      if (search) {
        query.$or = [
          { expenseId: { $regex: search, $options: 'i' } },
          { registerId: { $regex: search, $options: 'i' } },
          { 'originalData.name': { $regex: search, $options: 'i' } }
        ];
      }

      const logs = await ExpenseLog.find(query).sort({ createdAt: -1 });
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch logs' });
    }
  },

  // Get modification logs
  getLogs: async (req, res) => {
    try {
      const { search } = req.query;
      let query = {};

      if (search) {
        query.$or = [
          { expenseId: { $regex: search, $options: 'i' } },
          { registerId: { $regex: search, $options: 'i' } },
          { 'originalData.name': { $regex: search, $options: 'i' } }
        ];
      }

      const logs = await ExpenseLog.find(query).sort({ createdAt: -1 });
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch modification logs', error: error.message });
    }
  },

  // Soft delete expense
  deleteExpense: async (req, res) => {
    try {
      const expense = await Expense.findById(req.params.id);
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
      }

      expense.isDeleted = true;
      expense.deletedAt = new Date();
      expense.deletedBy = req.user.registerId; // Use the registerId from authenticated user
      await expense.save();

      res.json({ message: 'Expense moved to recycle bin' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete expense', error: error.message });
    }
  },

  // Get recycle bin items
  getRecycleBin: async (req, res) => {
    try {
      const deletedExpenses = await Expense.find({ isDeleted: true })
        .sort({ deletedAt: -1 });
      res.json(deletedExpenses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch deleted expenses', error: error.message });
    }
  },

  // Restore from recycle bin
  restoreExpense: async (req, res) => {
    try {
      const expense = await Expense.findById(req.params.id);
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
      }

      expense.isDeleted = false;
      await expense.save();

      res.json({ message: 'Expense restored successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to restore expense', error: error.message });
    }
  },

  // Permanently delete from recycle bin
  permanentDeleteExpense: async (req, res) => {
    try {
      await Expense.findByIdAndDelete(req.params.id);
      res.json({ message: 'Expense permanently deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete expense permanently', error: error.message });
    }
  }
};

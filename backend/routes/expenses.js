import express from 'express';
import { auth, checkPermission } from '../middleware/auth.js';
import { expenseController } from '../controllers/expenseController.js';

const router = express.Router();

// Get all expenses with filters
router.get('/', auth, expenseController.getExpenses);

// Get verification data
router.get('/verification', 
  auth, 
  checkPermission('ACCESS_LOGS'),
  expenseController.getVerificationData
);

// Add new expense (admin, developer, financier only)
router.post('/', 
  auth, 
  checkPermission('MANAGE_EXPENSE'),
  expenseController.createExpense
);

// Update expense
router.put('/:id', 
  auth, 
  checkPermission('MANAGE_EXPENSE'),
  expenseController.updateExpense
);

// Update verification status
router.patch('/:id/verify',
  auth,
  checkPermission('ACCESS_LOGS'),
  expenseController.updateVerificationStatus
);

// Get modification logs
router.get('/logs', 
  auth, 
  checkPermission('ACCESS_LOGS'),
  expenseController.getLogs
);

// Soft delete expense (move to recycle bin)
router.delete('/:id', 
  auth, 
  checkPermission('DELETE_EXPENSE'),
  expenseController.deleteExpense
);

// Get recycle bin items
router.get('/recycle-bin', 
  auth, 
  checkPermission('DELETE_EXPENSE'),
  expenseController.getRecycleBin
);

// Restore from recycle bin
router.post('/restore/:id', 
  auth, 
  checkPermission('DELETE_EXPENSE'),
  expenseController.restoreExpense
);

// Permanently delete from recycle bin
router.delete('/permanent/:id', 
  auth, 
  checkPermission('DELETE_EXPENSE'),
  expenseController.permanentDeleteExpense
);

export default router;
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {Eye, EyeOff, Plus, Search, Filter, Clock, Edit2, Trash2, Printer, Phone, } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import ExpenseTable from '../components/expense/ExpenseTable';
import ExpenseFilters from '../components/expense/ExpenseFilters';
import ExpenseForm from '../components/expense/ExpenseForm';
import ModificationLog from '../components/expense/ModificationLog';
import ExpensePrint from '../components/expense/ExpensePrint';
import { API_URL } from '../utils/config';

function Expense() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    paymentMode: '',
    verifyLog: '',
  });
  const [visibleColumns, setVisibleColumns] = useState({
    registerId: false,
    expenseId: false,
    dateTime: false,
    purpose: true,
    spenderName: false,
    phoneNumber: false, 
    amountTaken: false,
    totalSpent: true,
    subPurpose: true,
    subAmount: true,
    amountReturned: false,
    bill: false,
    paymentMode: false,
    verifyLog: false
  });
  
  const [showForm, setShowForm] = useState(false);
  const [showModificationLog, setShowModificationLog] = useState(false);
  const [hiddenProfiles, setHiddenProfiles] = useState(new Set());
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, [search, filters]);

  const fetchExpenses = async () => {
    try {
      const params = new URLSearchParams({
        search,
        ...filters,
      });
      const { data } = await axios.get(`${API_URL}/api/expenses?${params}`);
      setExpenses(data);
    } catch (error) {
      toast.error('Failed to fetch expenses');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleColumnToggle = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const handlePrivacyToggle = (expenseId) => {
    if (!['developer', 'financier'].includes(user?.role)) return;

    setHiddenProfiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(expenseId)) {
        newSet.delete(expenseId);
      } else {
        newSet.add(expenseId);
      }
      return newSet;
    });
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = async (expenseId) => {
    // Only allow deletion for users with roles 'developer' or 'financier'
    if (!['developer', 'financier'].includes(user?.role)) return;
  
    if (!window.confirm('Are you sure you want to move this item to recycle bin?')) return;
  
    try {
      await axios.delete(`${API_URL}/
        api/expenses/${expenseId}`);
      toast.success('Expense moved to recycle bin');
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };
  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Expense Management</h1>
        <div className="space-x-2">
          {['developer', 'financier'].includes(user?.role) && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </button>
          )}
          {(user?.role === 'developer' || user?.role === 'financier') && (
            <button
              onClick={() => setShowModificationLog(!showModificationLog)}
              className="btn-secondary"
            >
              <Clock className="h-4 w-4 mr-2" />
              Modification Log
            </button>
          )}
          <ExpensePrint expenses={expenses} visibleColumns={visibleColumns} />
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, name, amount, or purpose..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg"
            />
          </div>
        </div>
        <ExpenseFilters
          filters={filters}
          visibleColumns={visibleColumns}
          onChange={handleFilterChange}
          onColumnToggle={handleColumnToggle}
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="font-medium">Visible Columns</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(visibleColumns).map(([column, isVisible]) => {
              // Only show registerId checkbox for admin, developer, or financier roles
              if (column === 'registerId' && !['developer', 'financier'].includes(user?.role)) {
                return null;
              }
              // Only show phoneNumber checkbox for admin, developer, or financier roles
              if (column === 'phoneNumber' && !['admin', 'developer', 'financier'].includes(user?.role)) {
                return null;
              }
              return (
                <label key={column} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => handleColumnToggle(column)}
                    className="form-checkbox"
                  />
                  <span className="ml-2 text-sm">{column}</span>
                </label>
              );
            })}
          </div>
        </div>

        <ExpenseTable
          expenses={expenses}
          visibleColumns={visibleColumns}
          hiddenProfiles={hiddenProfiles}
          onPrivacyToggle={handlePrivacyToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isPrivilegedUser={['developer', 'financier'].includes(user?.role)}
          userRole={user?.role}
        />
      </div>

      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          onClose={() => {
            setShowForm(false);
            setEditingExpense(null);
          }}
          onSuccess={() => {
            fetchExpenses();
            setShowForm(false);
            setEditingExpense(null);
          }}
        />
      )}

      {showModificationLog && (
        <ModificationLog
          search={search}
          onSearch={(value) => setSearch(value)}
          onClose={() => setShowModificationLog(false)}
        />
      )}
    </div>
  );
}

export default Expense;

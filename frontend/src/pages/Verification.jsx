import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import VerificationTable from '../components/verification/VerificationTable';
import VerificationFilters from '../components/verification/VerificationFilters';
import { API_URL } from '../utils/config';

function Verification() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('income');
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [filters, setFilters] = useState({
    verifyLog: 'not verified'
  });

  useEffect(() => {
    fetchData();
  }, [activeTab, filters]);

  const fetchData = async () => {
    try {
      const endpoint = activeTab === 'income' ? 'incomes' : 'expenses';
      const { data } = await axios.get(`${API_URL}/api/${endpoint}/verification`, {
        params: filters
      });
      if (activeTab === 'income') {
        setIncomeData(data);
      } else {
        setExpenseData(data);
      }
    } catch (error) {
      toast.error(`Failed to fetch ${activeTab} data`);
    }
  };

  const handleVerifyLogUpdate = async (id, verifyLog) => {
    try {
      const endpoint = activeTab === 'income' ? 'incomes' : 'expenses';
      await axios.patch(`${API_URL}/api/${endpoint}/${id}/verify`, {
        verifyLog,
        registerId: user.registerId
      });
      toast.success('Verification status updated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to update verification status');
    }
  };

  if (!['developer', 'financier'].includes(user?.role)) {
    return <div>Access denied</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Verification Management</h1>
        <div className="space-x-2">
          <button
            onClick={() => setActiveTab('income')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'income'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setActiveTab('expense')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'expense'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Expense
          </button>
        </div>
      </div>

      <VerificationFilters filters={filters} onChange={setFilters} />

      <div className="bg-white rounded-lg shadow">
        <VerificationTable
          data={activeTab === 'income' ? incomeData : expenseData}
          type={activeTab}
          onVerifyLogUpdate={handleVerifyLogUpdate}
        />
      </div>
    </div>
  );
}

export default Verification;
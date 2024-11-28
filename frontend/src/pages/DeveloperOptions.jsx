import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '../utils/config';

function DeveloperOptions() {
  const { user } = useAuth();
  const [confirmAction, setConfirmAction] = useState('');

  if (user?.role !== 'developer') {
    return <div>Access denied</div>;
  }

  const handleClearData = async (type) => {
    if (confirmAction !== type) {
      setConfirmAction(type);
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/developer/clear/${type}`);
      toast.success(`${type} data cleared successfully`);
      setConfirmAction('');
    } catch (error) {
      toast.error(`Failed to clear ${type} data`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Developer Options</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-medium mb-4">Clear Data</h2>
          <div className="space-y-4">
            {/* Clear Users */}
            <ClearOption
              title="Clear Users Data"
              description="Delete all user accounts except the developer account"
              type="users"
              confirmAction={confirmAction}
              setConfirmAction={setConfirmAction}
              handleClearData={handleClearData}
            />

            {/* Clear Income */}
            <ClearOption
              title="Clear Income Data"
              description="Delete all income records"
              type="income"
              confirmAction={confirmAction}
              setConfirmAction={setConfirmAction}
              handleClearData={handleClearData}
            />

            {/* Clear Expense */}
            <ClearOption
              title="Clear Expense Data"
              description="Delete all expense records"
              type="expense"
              confirmAction={confirmAction}
              setConfirmAction={setConfirmAction}
              handleClearData={handleClearData}
            />

            {/* Clear Notifications */}
            <ClearOption
              title="Clear Notifications"
              description="Delete all system notifications"
              type="notifications"
              confirmAction={confirmAction}
              setConfirmAction={setConfirmAction}
              handleClearData={handleClearData}
            />
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
            <div>
              <h3 className="text-yellow-800 font-medium">Warning</h3>
              <p className="text-sm text-yellow-700">
                These actions are irreversible. Please make sure you have backed up any important data before proceeding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClearOption({ title, description, type, confirmAction, setConfirmAction, handleClearData }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      {confirmAction === type ? (
        <div className="flex items-center space-x-2">
          <span className="text-red-600">Are you sure?</span>
          <button
            onClick={() => handleClearData(type)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Confirm
          </button>
          <button
            onClick={() => setConfirmAction('')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirmAction(type)}
          className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
        >
          <Trash2 className="h-5 w-5 mr-2" />
          Clear {title.split(' ')[1]}
        </button>
      )}
    </div>
  );
}

export default DeveloperOptions;

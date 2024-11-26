import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

function VerificationTable({ data, type, onVerifyLogUpdate }) {
  const [expandedRow, setExpandedRow] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getVerifyLogColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const renderIncomeColumns = (item) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.incomeId}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.registerId}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.email || '-'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.phoneNumber || '-'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.amount}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.status}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.paymentMode}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.belongsTo}</td>
    </>
  );

  const renderExpenseColumns = (item) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.expenseId}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.registerId}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.phoneNumber || '-'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.amount}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.purpose}</td>
      <td className="px-6 py-4">
        <button
          onClick={() => setExpandedRow(expandedRow === item._id ? null : item._id)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          {expandedRow === item._id ? 'Hide' : 'Show'} Details
        </button>
        {expandedRow === item._id && (
          <div className="mt-2 space-y-2">
            {item.subExpenses.map((sub, idx) => (
              <div key={idx} className="text-sm">
                <div>Purpose: {sub.subPurpose}</div>
                <div>Amount: {sub.subAmount}</div>
                {sub.billImage && (
                  <img
                    src={sub.billImage}
                    alt="Bill"
                    className="h-16 w-16 object-cover rounded mt-1"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.amountReturned || 0}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.paymentMode}</td>
    </>
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {type === 'income' ? (
              <>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Income ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Register ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Mode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Belongs To</th>
              </>
            ) : (
              <>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expense ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Register ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sub Expenses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Returned</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Mode</th>
              </>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verify Log</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50">
              {type === 'income' ? renderIncomeColumns(item) : renderExpenseColumns(item)}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {formatDate(item.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getVerifyLogColor(
                    item.verifyLog
                  )}`}
                >
                  {item.verifyLog}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onVerifyLogUpdate(item._id, 'verified')}
                    className="text-green-600 hover:text-green-900"
                    title="Verify"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onVerifyLogUpdate(item._id, 'not verified')}
                    className="text-yellow-600 hover:text-yellow-900"
                    title="Mark as Not Verified"
                  >
                    <AlertCircle className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onVerifyLogUpdate(item._id, 'rejected')}
                    className="text-red-600 hover:text-red-900"
                    title="Reject"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VerificationTable;
import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

function PaymentVerificationTable({ payments, onVerifyLogUpdate }) {
  const [editingPayment, setEditingPayment] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleNameUpdate = (payment, newName) => {
    onVerifyLogUpdate(payment._id, payment.verificationStatus, {
      ...payment,
      name: newName
    });
  };

  const handleBelongsToUpdate = (payment, newBelongsTo) => {
    onVerifyLogUpdate(payment._id, payment.verificationStatus, {
      ...payment,
      belongsTo: newBelongsTo
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Register ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Screenshot</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.paymentId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.registerId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(payment.createdAt)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {editingPayment === payment._id ? (
                  <input
                    type="text"
                    value={payment.name}
                    onChange={(e) => handleNameUpdate(payment, e.target.value)}
                    className="border rounded px-2 py-1"
                    onBlur={() => setEditingPayment(null)}
                    autoFocus
                  />
                ) : (
                  <span 
                    onClick={() => setEditingPayment(payment._id)} 
                    className="cursor-pointer hover:text-indigo-600"
                  >
                    {payment.name}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.email || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.phoneNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">₹{payment.amount}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <select
                  value={payment.belongsTo}
                  onChange={(e) => handleBelongsToUpdate(payment, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="villagers">Villagers</option>
                  <option value="youth">Youth</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {payment.screenshot ? (
                  <a
                    href={payment.screenshot}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Screenshot
                  </a>
                ) : (
                  'No Screenshot'
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  payment.transactionStatus === 'successful'
                    ? 'bg-green-100 text-green-800'
                    : payment.transactionStatus === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {payment.transactionStatus}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onVerifyLogUpdate(payment._id, 'verified', payment)}
                    className="text-green-600 hover:text-green-900"
                    title="Verify"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onVerifyLogUpdate(payment._id, 'not verified', payment)}
                    className="text-yellow-600 hover:text-yellow-900"
                    title="Mark as Not Verified"
                  >
                    <AlertCircle className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onVerifyLogUpdate(payment._id, 'rejected', payment)}
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

export default PaymentVerificationTable;
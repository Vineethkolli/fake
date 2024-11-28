import React from 'react';

function PaymentHistory({ payments }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'successful':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getVerificationColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (!payments?.length) {
    return (
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">Payment History</h2>
        <div className="text-center text-gray-500 py-8">No payment history found</div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium mb-4">Payment History</h2>
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Screenshot</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verification Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.paymentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(payment.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">₹{payment.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {payment.screenshot && (
                      <a
                        href={payment.screenshot}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Screenshot
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.transactionStatus)}`}>
                      {payment.transactionStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getVerificationColor(payment.verificationStatus)}`}>
                      {payment.verificationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PaymentHistory;
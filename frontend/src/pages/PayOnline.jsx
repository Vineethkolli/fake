import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { CreditCard, History } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../utils/config';
import { initiateUPIPayment } from '../utils/payments';
import UPIPayment from '../components/payment/UPIPayment';

function PayOnline() {
  const { user } = useAuth();
  const [paymentData, setPaymentData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    amount: ''
  });
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [currentPaymentId, setCurrentPaymentId] = useState(null);

  useEffect(() => {
    if (user) {
      setPaymentData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      }));
    }
    fetchPaymentHistory();
  }, [user]);

 
const fetchPaymentHistory = async () => {
  try {
    // Send registerId as a query parameter
    const { data } = await axios.get(`${API_URL}/api/payments/history`, {
      params: { registerId: user.registerId } // send registerId as a query parameter
    });
    setPaymentHistory(data);
  } catch (error) {
    toast.error('Failed to fetch payment history');
  }
};


  const handleChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const validatePaymentData = () => {
    const { amount, name, phoneNumber } = paymentData;
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return false;
    }
    if (!name || !phoneNumber) {
      toast.error('Name and phone number are required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePaymentData()) return;

    try {
      const result = await initiateUPIPayment({
        ...paymentData,
        amount: parseFloat(paymentData.amount),
        userId: user.id,
        registerId: user.registerId
      });
      setQrData(result);
      setShowQR(true);
      setCurrentPaymentId(result.paymentId);
    } catch (error) {
      toast.error(error.message || 'Payment initiation failed');
    }
  };

  const handlePaymentSuccess = () => {
    toast.success('Payment successful!');
    setShowQR(false);
    setCurrentPaymentId(null);
    fetchPaymentHistory();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <CreditCard className="mr-2" /> Pay Online
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={paymentData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={paymentData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={paymentData.phoneNumber}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={paymentData.amount}
                onChange={handleChange}
                required
                min="1"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Pay Now
          </button>
        </form>

        {showQR && qrData && (
          <UPIPayment
            upiUrl={qrData.upiUrl}
            qrCodePath={qrData.qrCodePath}
            paymentId={qrData.paymentId}
            amount={paymentData.amount}
            upiId={qrData.upiId}
            merchantName={qrData.merchantName}
            onClose={() => {
              setShowQR(false);
              setCurrentPaymentId(null);
            }}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <History className="mr-2" /> Payment History
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentHistory.length > 0 ? (
                paymentHistory.map((payment) => (
                  <tr key={payment.paymentId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.paymentId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">₹{payment.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.status === 'success'
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No payment history available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PayOnline;

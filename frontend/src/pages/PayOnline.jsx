import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PaymentForm from '../components/payment/PaymentForm';
import PaymentHistory from '../components/payment/PaymentHistory';
import axios from 'axios';
import { API_URL } from '../utils/config';
import { toast } from 'react-hot-toast';

function PayOnline() {
  const [payments, setPayments] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/payments/history`);
      setPayments(data);
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      toast.error('Failed to fetch payment history');
    }
  };

  const handlePaymentSuccess = () => {
    fetchPaymentHistory();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PaymentForm onSuccess={handlePaymentSuccess} />
      <PaymentHistory payments={payments} />
    </div>
  );
}

export default PayOnline;
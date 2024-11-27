import axios from 'axios';
import { API_URL } from './config';

export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export async function initiateUPIPayment(paymentData) {
  try {
    const { amount, name, phoneNumber } = paymentData;

    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }

    if (!name || !phoneNumber) {
      throw new Error('Name and phone number are required');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.post(
      `${API_URL}/api/payments/initiate`,
      paymentData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const { paymentId, upiUrl, qrCodePath, upiId, merchantName } = response.data;

    if (isMobile()) {
      window.location.href = upiUrl;
      return { paymentId };
    } else {
      return {
        paymentId,
        upiUrl,
        qrCodePath,
        upiId,
        merchantName
      };
    }
  } catch (error) {
    console.error('Payment initiation failed:', error);
    throw error.response?.data?.error || error.message || 'Payment initiation failed';
  }
}

export async function checkPaymentStatus(paymentId) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.get(
      `${API_URL}/api/payments/status/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Payment status check failed:', error);
    throw error.response?.data?.error || error.message || 'Failed to check payment status';
  }
}

export async function getPaymentHistory() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.get(
      `${API_URL}/api/payments/history`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch payment history:', error);
    throw error.response?.data?.error || error.message || 'Failed to fetch payment history';
  }
}
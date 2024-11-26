import { API_URL } from './config';
export async function initiatePayment(amount, orderId) {
  try {
    // Get payment configuration from server
    const response = await fetch(`${API_URL}/api/payments/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ amount, orderId })
    });

    const config = await response.json();

    // Create form and submit to Paytm
    const form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', `https://securegw-stage.paytm.in/order/process`); // Use production URL in production

    Object.entries(config).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', key);
      input.setAttribute('value', value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    form.remove();
  } catch (error) {
    console.error('Payment initiation failed:', error);
    throw error;
  }
}
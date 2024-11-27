import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check } from 'lucide-react';
import { checkPaymentStatus } from '../../utils/payments';
import { API_URL } from '../../utils/config';

function UPIPayment({ upiUrl, qrCodePath, paymentId, amount, upiId, merchantName, onClose, onSuccess }) {
  const [status, setStatus] = useState('pending');
  const [useStaticQR, setUseStaticQR] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { status } = await checkPaymentStatus(paymentId);
        setStatus(status);
        
        if (status === 'success') {
          clearInterval(interval);
          onSuccess();
        } else if (status === 'failed') {
          clearInterval(interval);
          onClose();
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [paymentId]);

  const toggleQRType = () => setUseStaticQR(!useStaticQR);

  const copyUPIId = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy UPI ID:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Scan QR Code to Pay</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="text-center space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            {useStaticQR ? (
              <img 
                src={`${API_URL}${qrCodePath}`}
                alt="UPI QR Code"
                className="mx-auto max-w-[256px]"
              />
            ) : (
              <QRCodeSVG 
                value={upiUrl}
                size={256}
                level="H"
                includeMargin={true}
                className="mx-auto"
              />
            )}
          </div>

          <button
            onClick={toggleQRType}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Switch to {useStaticQR ? 'Dynamic' : 'Static'} QR
          </button>

          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm text-gray-600">{upiId}</span>
            <button
              onClick={copyUPIId}
              className="text-indigo-600 hover:text-indigo-800"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          <div className="text-sm text-gray-600">
            <p>Amount: ₹{amount}</p>
            <p>Payment ID: {paymentId}</p>
            <p>Status: {status}</p>
            <p>Merchant: {merchantName}</p>
          </div>

          <div className="text-sm text-gray-500">
            <p>1. Open any UPI app on your phone</p>
            <p>2. Scan this QR code or pay to UPI ID</p>
            <p>3. Complete the payment</p>
          </div>

          <div className="flex justify-center space-x-2">
            <img src="/assets/payments/gpay.png" alt="Google Pay" className="h-8" />
            <img src="/assets/payments/phonepe.png" alt="PhonePe" className="h-8" />
            <img src="/assets/payments/paytm.png" alt="Paytm" className="h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UPIPayment;

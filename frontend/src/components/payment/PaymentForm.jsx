import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../../utils/config';

function PaymentForm({ onSuccess }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    registerId: user?.registerId || '',
    amount: '',
    screenshot: null
  });

  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [copiedUpiId, setCopiedUpiId] = useState(false);
  const [copiedUpiNumber, setCopiedUpiNumber] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const UPI_ID = import.meta.env.VITE_UPI_ID;
  const UPI_NUMBER = import.meta.env.VITE_UPI_NUMBER;
  const UPI_MERCHANT_NAME = import.meta.env.VITE_UPI_MERCHANT_NAME;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }

      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, screenshot: reader.result }));
        setIsUploading(false);
      };
      reader.onerror = () => {
        toast.error('Failed to read file');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'id') {
        setCopiedUpiId(true);
        setTimeout(() => setCopiedUpiId(false), 2000);
        toast.success('UPI ID copied!');
      } else {
        setCopiedUpiNumber(true);
        setTimeout(() => setCopiedUpiNumber(false), 2000);
        toast.success('UPI Number copied!');
      }
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handlePayNow = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setShowPaymentOptions(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.screenshot) {
      toast.error('Please upload payment screenshot');
      return;
    }

    const loadingToast = toast.loading('Submitting payment...');

    try {
      await axios.post(`${API_URL}/api/payments/initiate`, formData);

      toast.dismiss(loadingToast);
      toast.success('Payment submitted successfully. We will verify and confirm your payment within 4 hours.', {
        duration: 3000
      });

      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        registerId: user?.registerId || '',
        amount: '',
        screenshot: null
      });
      setShowPaymentOptions(false);
      setShowQR(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Failed to submit payment');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Make a Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount (₹) *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {!showPaymentOptions ? (
          <button
            type="button"
            onClick={handlePayNow}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Pay Now
          </button>
        ) : (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
              <div className="space-y-4">
                <div className="flex justify-between space-x-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(UPI_NUMBER, 'number')}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    {copiedUpiNumber ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    UPI Number
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(UPI_ID, 'id')}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    {copiedUpiId ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    UPI ID
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQR(!showQR)}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    QR Code
                  </button>
                </div>

                {showQR && (
                  <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                    <QRCodeSVG
                      value={`upi://pay?pa=${UPI_ID}&pn=${UPI_MERCHANT_NAME}&am=${formData.amount}&cu=INR`}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                )}

                <div className="text-center space-y-2">
                  <p className="font-medium">Amount: ₹{formData.amount}</p>
                  <p className="text-sm text-gray-500">Please make payment through UPI ID/Number/QR Code and upload screenshot below</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Upload Payment Screenshot *</label>
                  <div className="mt-1">
                    <div className="flex items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        className="hidden"
                        id="screenshot-upload"
                      />
                      <label
                        htmlFor="screenshot-upload"
                        className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </label>
                    </div>
                    {formData.screenshot && (
                      <div className="mt-2">
                        <img
                          src={formData.screenshot}
                          alt="Payment Screenshot"
                          className="h-20 w-20 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowPaymentOptions(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Submit Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default PaymentForm;
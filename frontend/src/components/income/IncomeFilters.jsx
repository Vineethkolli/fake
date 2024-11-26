import { Filter } from 'lucide-react';
import { useState } from 'react';

function IncomeFilters({ filters, onChange }) {
  const [showEmail, setShowEmail] = useState(false);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);

  const handleChange = (field, value) => {
    onChange({
      ...filters,
      [field]: value
    });
  };

  const handleToggleEmail = () => setShowEmail(!showEmail);
  const handleTogglePhoneNumber = () => setShowPhoneNumber(!showPhoneNumber);

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <Filter className="h-5 w-5 text-gray-400 mr-2" />
        <span className="text-sm font-medium">Filters:</span>
      </div>

      <select
        value={filters.status}
        onChange={(e) => handleChange('status', e.target.value)}
        className="form-select"
      >
        <option value="">Status</option>
        <option value="paid">Paid</option>
        <option value="not paid">Not Paid</option>
      </select>

      <select
        value={filters.paymentMode}
        onChange={(e) => handleChange('paymentMode', e.target.value)}
        className="form-select"
      >
        <option value="">Payment Mode</option>
        <option value="cash">Cash</option>
        <option value="online">Online</option>
        <option value="web app">Web App</option>
      </select>

      <select
        value={filters.belongsTo}
        onChange={(e) => handleChange('belongsTo', e.target.value)}
        className="form-select"
      >
        <option value="">Belongs To</option>
        <option value="villagers">Villagers</option>
        <option value="youth">Youth</option>
      </select>

      <select
        value={filters.verifyLog}
        onChange={(e) => handleChange('verifyLog', e.target.value)}
        className="form-select"
      >
        <option value="">Verify Log</option>
        <option value="verified">Verified</option>
        <option value="not verified">Not Verified</option>
        <option value="rejected">Rejected</option>
        </select>
    </div>
  );
}

export default IncomeFilters;

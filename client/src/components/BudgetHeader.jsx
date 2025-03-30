import React from 'react';
import { Edit2, Save, X, DollarSign } from 'lucide-react';

const BudgetHeader = ({
  editMode,
  realIncome,
  tempIncome,
  onIncomeChange,
  onEdit,
  onCancel,
  onSave,
  totalPercentage
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-700">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-blue-900 p-3 rounded-full mr-4 transform transition-all duration-1000 ease-out">
          <DollarSign size={28} className="text-blue-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Your Budget</h1>

          {editMode ? (
            <div className="mt-1">
              <div className="relative max-w-52 overflow-hidden">
                <input
                  type="number"
                  value={tempIncome > 0 ? tempIncome : ''} 
                  onChange={(e) => onIncomeChange(e.target.value)}
                  className="text-xl font-semibold text-blue-300 bg-transparent border-b border-blue-600 focus:outline-none w-full"
                  style={{ appearance: 'textfield' }}
                />
              </div>
            </div>
          ) : (
            <p className="text-xl text-blue-300 font-semibold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(realIncome)}/month
            </p>
          )}
        </div>
      </div>
      
      <div className="flex gap-3 mt-2 sm:mt-0">
        {!editMode ? (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors text-base"
          >
            <Edit2 size={18} /> Edit Budget
          </button>
        ) : (
          <>
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors text-base"
            >
              <X size={18} /> Cancel
            </button>
            <button
              onClick={onSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-base ${
                Math.abs(totalPercentage - 100) <= 0.5
                  ? 'bg-blue-600 text-white hover:bg-blue-500'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              disabled={Math.abs(totalPercentage - 100) > 0.5}
            >
              <Save size={18} /> Save Changes
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BudgetHeader; 
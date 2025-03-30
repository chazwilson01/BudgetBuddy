import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PlusCircle } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800 p-2 shadow-md rounded border border-gray-700 text-sm text-white">
        <p className="font-medium" style={{ color: data.color }}>{data.name}</p>
        <p className="text-blue-200">{data.percentage}%</p>
        <p className="text-white">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(data.amount)}
        </p>
      </div>
    );
  }
  return null;
};

const BudgetChart = ({
  categories,
  isEditMode,
  activeIndex,
  onPieEnter,
  onPieLeave,
  onPieClick,
  isVisible,
  isAddingCategory,
  newCategoryName,
  onNewCategoryNameChange,
  onAddCategory,
  totalPercentage
}) => {
  return (
    <div className="p-6 border-b border-gray-700 md:border-r md:border-b-0">
      <h2 className="text-lg font-medium text-blue-200 mb-2">Allocation Overview</h2>
      <div className={`h-90 transition-all duration-1500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={isEditMode ? categories : categories}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="85%"
              paddingAngle={2}
              dataKey="percentage"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              onClick={onPieClick}
              animationDuration={1500}
              animationBegin={200}
            >
              {categories.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke={activeIndex === index ? '#fff' : 'none'}
                  strokeWidth={activeIndex === index ? 2 : 0}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {isEditMode && (
        <>
          <div className={`p-3 mt-3 rounded-lg text-base flex items-center justify-center ${
            Math.abs(totalPercentage - 100) <= 0.5
              ? 'bg-blue-900 text-blue-200' 
              : 'bg-yellow-900 bg-opacity-40 text-yellow-200'
          }`}>
            <span className="mr-2">%</span>
            {totalPercentage.toFixed(1)}% allocated {Math.abs(totalPercentage - 100) > 0.5 && `(need 100%)`}
          </div>

          <div className="mt-4">
            {isAddingCategory ? (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => onNewCategoryNameChange(e.target.value)}
                  placeholder="Category name"
                  className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-md text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={onAddCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors text-base"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAddCategory()}
                className="w-full py-3 px-4 bg-gray-700 text-blue-300 rounded-lg hover:bg-gray-600 transition-colors text-base flex items-center justify-center"
              >
                <PlusCircle size={18} className="mr-2" /> Add New Category
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BudgetChart; 
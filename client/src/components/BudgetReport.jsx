import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Edit2, Save, X, DollarSign, Percent } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../contexts/Context';

const CompactBudgetPresentation = () => {
  // States
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [tempCategories, setTempCategories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [realIncome, setRealIncome] = useState(5000); // Default income
  const [tempIncome, setTempIncome] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const { budget, setBudget } = useUser();

  // Animation effect on mount
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  // Default colors for categories
  const defaultColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
    '#FF9F40', '#C9CBCF', '#7BC043', '#F37736', '#8BD3C7'
  ];

  // Create default categories if none exist
  const createDefaultCategories = (income) => {
    const defaultIncome = income || 5000;
    const defaultCats = [
      { id: 'rent', name: 'Rent', percentage: 30, color: '#FF6384' },
      { id: 'utilities', name: 'Utilities', percentage: 10, color: '#36A2EB' },
      { id: 'groceries', name: 'Groceries', percentage: 15, color: '#FFCE56' },
      { id: 'transportation', name: 'Transportation', percentage: 10, color: '#4BC0C0' },
      { id: 'entertainment', name: 'Entertainment', percentage: 10, color: '#9966FF' },
      { id: 'insurance', name: 'Insurance', percentage: 5, color: '#FF9F40' },
      { id: 'loans', name: 'Loans', percentage: 5, color: '#C9CBCF' },
      { id: 'savings', name: 'Savings', percentage: 10, color: '#7BC043' },
      { id: 'other', name: 'Other', percentage: 5, color: '#F37736' }
    ];

    // Calculate amounts based on percentages
    const processedCategories = defaultCats.map(cat => ({
      ...cat,
      amount: parseFloat(((defaultIncome * cat.percentage) / 100).toFixed(2))
    }));

    setBudget(processedCategories);
    setCategories(processedCategories);
    return processedCategories;
  };

  // Initialize component with data
  useEffect(() => {
    // Try to get income from storage
    const storedIncome = parseInt(sessionStorage.getItem("income")) || 5000;
    setRealIncome(storedIncome);
    
    // Check if we have budget data
    if (budget && Array.isArray(budget) && budget.length > 0) {
      // Process existing budget data
      const processedBudget = budget.map(cat => ({
        ...cat,
        amount: parseFloat(((storedIncome * cat.percentage) / 100).toFixed(2))
      }));
      setCategories(processedBudget);
    } else {
      // Create default budget
      createDefaultCategories(storedIncome);
    }
    
    setIsLoading(false);
  }, []);

  // Update amounts when income changes
  useEffect(() => {
    if (categories.length > 0) {
      const updatedCategories = categories.map(cat => ({
        ...cat,
        amount: parseFloat(((realIncome * cat.percentage) / 100).toFixed(2))
      }));
      setCategories(updatedCategories);
      setBudget(updatedCategories);
    }
  }, [realIncome]);

  // Start editing
  const handleEdit = () => {
    setTempCategories([...categories]);
    setTempIncome(realIncome);
    setEditMode(true);
  };
  
  // Handle income change
  const handleIncomeChange = (value) => {
    if (value < 200000000) {
      const cleanedValue = value.replace(/^0+/, '');
      const numValue = cleanedValue === '' ? 0 : parseFloat(cleanedValue);
      
      setTempIncome(numValue);
      
      // Update category amounts based on the new income
      setTempCategories(tempCategories.map(cat => ({
        ...cat,
        amount: (numValue * (cat.percentage / 100)).toFixed(2)
      })));
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditMode(false);
  };

  // Save changes
  const handleSave = async () => {
    // Validate total is 100%
    const total = tempCategories.reduce((sum, cat) => sum + cat.percentage, 0);
    if (total !== 100) {
      alert(`Your total allocation is ${total}%. Please adjust to exactly 100%.`);
      return;
    }

    try {
      // Calculate new amounts
      const updatedCategories = tempCategories.map(cat => ({
        ...cat,
        amount: parseFloat((tempIncome * (cat.percentage / 100)).toFixed(2))
      }));

      // Update local state
      setCategories(updatedCategories);
      setBudget(updatedCategories);
      sessionStorage.setItem("income", tempIncome);
      setRealIncome(tempIncome);
      setEditMode(false);

      const budgetDto = {
        Income: tempIncome,
        Rent: updatedCategories.find(cat => cat.id === "rent")?.amount || 0,
        Utilities: updatedCategories.find(cat => cat.id === "utilities")?.amount || 0,
        Groceries: updatedCategories.find(cat => cat.id === "groceries")?.amount || 0,
        Transportation: updatedCategories.find(cat => cat.id === "transportation")?.amount || 0,
        Entertainment: updatedCategories.find(cat => cat.id === "entertainment")?.amount || 0,
        Insurance: updatedCategories.find(cat => cat.id === "insurance")?.amount || 0,
        Loans: updatedCategories.find(cat => cat.id === "loans")?.amount || 0,
        Savings: updatedCategories.find(cat => cat.id === "savings")?.amount || 0,
        Other: updatedCategories.find(cat => cat.id === "other")?.amount || 0
      };

      // Save to API
      await axios.put('https://localhost:5252/api/Budget/update', budgetDto, {
        withCredentials: true
      });

    } catch (error) {
      console.error('Error saving budget:', error);
      alert('Failed to save budget. Please try again.');
    }
  };

  // Update percentage for a category
  const handlePercentageChange = (id, value) => {
    const newValue = Math.min(100, Math.max(0, parseInt(value) || 0));
    const newNum = (tempIncome * (newValue / 100)).toFixed(2);
    
    setTempCategories(tempCategories.map(cat => 
      cat.id === id ? { ...cat, percentage: newValue, amount: newNum } : cat
    ));
  };

  // Update amount for a category and recalculate percentage
  const handleAmountChange = (id, value) => {
    const numValue = parseFloat(value) || 0;
    const newPercentage = tempIncome > 0 ? (numValue / tempIncome * 100).toFixed(1) : 0;

    setTempCategories(tempCategories.map(cat => 
      cat.id === id ? { ...cat, percentage: parseFloat(newPercentage), amount: numValue } : cat
    ));
  };

  // Handle pie chart segment hover
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-2 shadow-md rounded border border-gray-700 text-sm text-white">
          <p className="font-medium" style={{ color: data.color }}>{data.name}</p>
          <p className="text-blue-200">{data.percentage}%</p>
          <p className="text-white">{formatCurrency(data.amount)}</p>
        </div>
      );
    }
    return null;
  };

  // Get total percentage for validation
  const totalPercentage = editMode 
    ? tempCategories.reduce((sum, cat) => sum + cat.percentage, 0) 
    : 100;

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full bg-gray-800 bg-opacity-50 rounded-lg shadow-md border border-gray-700 text-white p-8 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <DollarSign size={24} className="text-white animate-spin" />
          </div>
          <p className="mt-4 text-blue-300">Loading budget data...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`w-full bg-gray-800 bg-opacity-80 rounded-lg shadow-md border border-gray-700 text-white 
                 transform transition-all duration-700 ease-out overflow-hidden
                 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {/* Header with income and actions */}
      <div className="flex flex-wrap items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-900 p-2 rounded-full mr-3 transform transition-all duration-500 ease-out">
            <DollarSign size={20} className={`text-blue-300 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Your Budget</h1>

            {editMode ? (
              <div>
                <input
                  type="number"
                  value={tempIncome || ''} 
                  onChange={(e) => handleIncomeChange(e.target.value)}
                  className="font-semibold text-blue-300 bg-transparent border-b border-blue-600 focus:outline-none"
                  style={{ appearance: 'textfield' }}
                />
              </div>
            ) : (
              <p className="text-blue-300 font-semibold">{formatCurrency(realIncome)}/month</p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 mt-2 sm:mt-0">
          {!editMode ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors text-sm"
            >
              <Edit2 size={14} /> Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors text-sm"
              >
                <X size={14} /> Cancel
              </button>
              <button
                onClick={handleSave}
                className={`flex items-center gap-1 px-3 py-1 rounded transition-colors text-sm ${
                  totalPercentage === 100
                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                disabled={totalPercentage !== 100}
              >
                <Save size={14} /> Save
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {/* Chart Section - Always Visible */}
        <div className="p-3 border-b border-gray-700 md:border-r md:border-b-0">
          <h2 className="text-sm font-medium text-blue-200 mb-1">Allocation Overview</h2>
          <div className={`h-56 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={editMode ? tempCategories : categories}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={2}
                  dataKey="percentage"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  onClick={(_, index) => {
                    const cats = editMode ? tempCategories : categories;
                    if (cats[index]) {
                      setSelectedCategory(cats[index].id);
                    }
                  }}
                  animationDuration={1500}
                  animationBegin={300}
                >
                  {(editMode ? tempCategories : categories).map((entry, index) => (
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
          
          {/* Total allocation indicator (only in edit mode) */}
          {editMode && (
            <div className={`p-2 mt-2 rounded-lg text-sm flex items-center justify-center ${
              totalPercentage === 100 
                ? 'bg-blue-900 text-blue-200' 
                : 'bg-yellow-900 bg-opacity-40 text-yellow-200'
            }`}>
              <Percent size={14} className="mr-1" />
              {totalPercentage}% allocated {totalPercentage !== 100 && `(need 100%)`}
            </div>
          )}
        </div>

        {/* Category mini cards - grid layout */}
        <div className="col-span-2 p-3">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-medium text-blue-200">Category Breakdown</h2>
            <div className="text-xs text-blue-300">
              {editMode ? "Click on a category to adjust" : "Click on chart or cards to focus"}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(editMode ? tempCategories : categories).map((category, index) => (
              <div 
                key={category.id} 
                className={`p-3 rounded border transition-all cursor-pointer
                          transform transition-all duration-500 ease-out
                          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                          ${
                            (activeIndex !== null && categories[activeIndex]?.id === category.id) || 
                            selectedCategory === category.id
                              ? 'border-blue-600 bg-blue-900 bg-opacity-40' 
                              : 'border-gray-700 hover:border-blue-800 bg-gray-800 bg-opacity-60'
                          }`}
                onClick={() => setSelectedCategory(category.id)}
                style={{ transitionDelay: `${index * 50 + 500}ms` }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: category.color }} 
                    />
                    <h3 className="font-medium text-sm text-white">{category.name}</h3>
                  </div>
                  {selectedCategory === category.id && editMode ? (
                    <input
                      type="number"
                      value={category.amount}
                      onChange={(e) => handleAmountChange(category.id, e.target.value)}
                      className="font-bold text-white w-24 text-right border-none outline-none focus:ring-0 bg-transparent"
                      style={{ appearance: 'textfield' }}
                    />
                  ) : (
                    <span className="font-bold text-white">{formatCurrency(category.amount)}</span>
                  )}
                </div>
                
                {/* Progress bar or slider based on mode */}
                {selectedCategory === category.id && editMode ? (
                  <div className="flex items-center mt-2 gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={category.percentage}
                      onChange={(e) => handlePercentageChange(category.id, e.target.value)}
                      className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      style={{ accentColor: category.color }}
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={category.percentage}
                      onChange={(e) => handlePercentageChange(category.id, e.target.value)}
                      className="w-12 p-1 text-xs border border-gray-600 rounded text-center bg-gray-700 text-white"
                    />
                    <span className="text-xs text-blue-300">%</span>
                  </div>
                ) : (
                  <div className="flex items-center mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-1.5 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: isVisible ? `${category.percentage}%` : '0%',
                          backgroundColor: category.color 
                        }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs font-medium text-blue-300 min-w-6 text-center">
                      {category.percentage}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactBudgetPresentation;
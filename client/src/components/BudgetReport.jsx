import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Edit2, Save, X, DollarSign, Percent, PlusCircle, Trash2, Check, Palette } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../contexts/Context';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [colorPickerCategoryId, setColorPickerCategoryId] = useState(null);
  const [colorPickerPosition, setColorPickerPosition] = useState({ top: 0, left: 0 });
  const [removedIds, setRemovedIds] = useState([])
  const { budget, setBudget } = useUser();
  
  // Ref for the color picker button
  const colorPickerButtonRef = useRef(null);
  
  // Expanded color palette
  const colorPalette = [
    // Original colors
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
    '#FF9F40', '#C9CBCF', '#7BC043', '#F37736', '#8BD3C7',
    // Additional colors
    '#E63946', '#457B9D', '#1D3557', '#F1FAEE', '#A8DADC',
    '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51', '#264653',
    '#6A0572', '#AB83A1', '#F15BB5', '#9B5DE5', '#00BBF9',
    '#00F5D4', '#FEE440', '#00B4D8', '#0077B6', '#023E8A'
  ];

  const navigate = useNavigate();
  const location = useLocation();

  const reloadRoute = () => {
    navigate(location.pathname);
  };

  // Animation effect on mount - slowed down
  useEffect(() => {
    console.log("BUDGET TEST", budget)
    // Add a delay before showing the component
    setTimeout(() => {
      setIsVisible(true);
    }, 300); // 300ms delay before starting animation
  }, []);

  // Initialize component with data from context
  useEffect(() => {
    // Try to get income from storage
    const storedIncome = parseInt(sessionStorage.getItem("income")) || 5000;
    setRealIncome(storedIncome);
    
    // Check if we have budget data from context
    if (budget && typeof budget === 'object') {
      if (Array.isArray(budget)) {
        // If it's already an array, use it directly
        setCategories(budget);
      } else {
        // Convert from object format to array format
        const categoryArray = Object.values(budget).map(item => ({
          id: item.id,
          name: item.category,
          color: item.color,
          percentage: item.percentage || (item.amount / storedIncome * 100),
          amount: item.amount
        }));
        setCategories(categoryArray);
      }
      setIsLoading(false);
    } else {
      createDefaultCategories(storedIncome);
      setIsLoading(false);
    }
  }, [budget]);
  // Position the color picker near the button that opened it
  useEffect(() => {
    if (colorPickerOpen && colorPickerButtonRef.current) {
      const buttonRect = colorPickerButtonRef.current.getBoundingClientRect();
      setColorPickerPosition({
        top: buttonRect.bottom + window.scrollY + 5,
        left: buttonRect.left + window.scrollX
      });
    }
  }, [colorPickerOpen]);

  // Create default categories if none exist
  const createDefaultCategories = (income) => {
    const defaultCats = [
      { id: 1, name: 'Housing', color: '#FF6384', percentage: 30, amount: income * 0.3 },
      { id: 2, name: 'Food', color: '#36A2EB', percentage: 15, amount: income * 0.15 },
      { id: 3, name: 'Transportation', color: '#FFCE56', percentage: 10, amount: income * 0.1 },
      { id: 4, name: 'Utilities', color: '#4BC0C0', percentage: 10, amount: income * 0.1 },
      { id: 5, name: 'Entertainment', color: '#9966FF', percentage: 10, amount: income * 0.1 },
      { id: 6, name: 'Savings', color: '#FF9F40', percentage: 15, amount: income * 0.15 },
      { id: 7, name: 'Misc', color: '#C9CBCF', percentage: 10, amount: income * 0.1 },
    ];
    
    setCategories(defaultCats);
    
    // Also prepare it for the context in the expected format
    const budgetObject = {};
    defaultCats.forEach((cat, index) => {
      budgetObject[index] = {
        id: cat.id,
        category: cat.name,
        color: cat.color,
        amount: cat.amount
      };
    });
    
  };

  // Start editing
  const handleEdit = () => {
    setTempCategories([...categories]);
    setTempIncome(realIncome);
    setEditMode(true);
  };
  
  // Handle income change
  const handleIncomeChange = (value) => {
    if (value < 200000000) {
      const numValue = parseFloat(value) || 0;
      
      // Remove any leading zeros by converting to number and back to string if needed
      setTempIncome(numValue);
      
      // Update category amounts based on the new income
      setTempCategories(tempCategories.map(cat => ({
        ...cat,
        amount: numValue > 0 ? parseFloat((numValue * (cat.percentage / 100)).toFixed(2)) : 0
      })));
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditMode(false);
    setIsAddingCategory(false);
    setSelectedCategory(null);
    setColorPickerOpen(false);
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    if (colorPickerCategoryId) {
      setTempCategories(tempCategories.map(cat => 
        cat.id === colorPickerCategoryId ? { ...cat, color } : cat
      ));
      setColorPickerOpen(false);
      setColorPickerCategoryId(null);
    }
  };

  // Add a new category
  const handleAddCategory = () => {
    if (!isAddingCategory) {
      setIsAddingCategory(true);
      return;
    }

    if (!newCategoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    // Generate a new ID
    const newId = 0;
    
    // Pick a color from the default colors
    const colorIndex = tempCategories.length % colorPalette.length;
    
    // Calculate initial percentage and amount (start with 0)
    const newCategory = {
      id: newId,
      name: newCategoryName,
      color: colorPalette[colorIndex],
      percentage: 0,
      amount: 0
    };

    setTempCategories([...tempCategories, newCategory]);
    setNewCategoryName('');
    setIsAddingCategory(false);
    // Select the new category for immediate editing
    setSelectedCategory(newId);
  };

  // Remove a category
  const handleRemoveCategory = (id) => {
    if (tempCategories.length <= 1) {
      alert("You must have at least one category");
      return;
    }
    
    setTempCategories(tempCategories.filter(cat => cat.id !== id));
    setRemovedIds([...removedIds, id])
    if (selectedCategory === id) {
      setSelectedCategory(null);
    }
  };

  // Save changes
  const handleSave = async () => {
    // Validate total is 100%
    const total = tempCategories.reduce((sum, cat) => sum + cat.percentage, 0);
    if (Math.abs(total - 100) > 0.5) {
      alert(`Your total allocation is ${total.toFixed(1)}%. Please adjust to exactly 100%.`);
      return;
    }
  
    try {
      // Calculate final amounts based on income
      const updatedCategories = tempCategories.map(cat => ({
        ...cat,
        amount: parseFloat((tempIncome * (cat.percentage / 100)).toFixed(2))
      }));
  
      // Transform categories for the API request format
      const categoriesForApi = updatedCategories.map(cat => ({
        Id: cat.id,
        Category: cat.name,
        Color: cat.color,
        Amount: cat.amount
      }));
      
  
  

      // Create the request object in the format the server expects
      const requestData = {
        Income: parseInt(tempIncome), // Convert to integer as required by API
        Categories: categoriesForApi,
        DeletedAllocationIds: removedIds.filter(id => id !== 0) // Filter out 0 IDs which represent new categories
      };
  
      console.log("Sending budget update:", requestData);
     
  
      // Save to API
      await axios.post('https://localhost:5252/api/Budget/update', requestData, {
        withCredentials: true
      });


      reloadRoute()
      
    } catch (error) {
      console.error('Error saving budget:', error);
      alert('Failed to save budget. Please try again.');
    }
  };

  // Update percentage for a category
  const handlePercentageChange = (id, value) => {
    // Remove leading zeros and handle empty inputs
    if (value === '' || value === '0') {
      setTempCategories(tempCategories.map(cat => 
        cat.id === id ? { ...cat, percentage: value === '' ? 0 : 0, amount: 0 } : cat
      ));
      return;
    }
    
    // Handle non-numeric input
    if (!/^\d+$/.test(value)) {
      return;
    }

    // Parse the value, ensuring it's between 0 and 100
    let newValue = Math.min(100, Math.max(0, parseInt(value) || 0));
    const newAmount = parseFloat((tempIncome * (newValue / 100)).toFixed(2));
    
    setTempCategories(tempCategories.map(cat => 
      cat.id === id ? { ...cat, percentage: newValue, amount: newAmount } : cat
    ));
  };

  // Update amount for a category and recalculate percentage
  const handleAmountChange = (id, value) => {
    // Handle empty inputs
    if (value === '' || value === '0') {
      setTempCategories(tempCategories.map(cat => 
        cat.id === id ? { ...cat, percentage: 0, amount: value === '' ? 0 : 0 } : cat
      ));
      return;
    }

    // Parse the value and limit it to the total income
    let numValue = parseFloat(value) || 0;
    
    // Don't allow values greater than income
    if (numValue > tempIncome) {
      numValue = tempIncome;
    }
    
    const newPercentage = tempIncome > 0 ? parseFloat((numValue / tempIncome * 100).toFixed(1)) : 0;

    setTempCategories(tempCategories.map(cat => 
      cat.id === id ? { ...cat, percentage: newPercentage, amount: numValue } : cat
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
    // For large numbers (over 9,999,999), display in millions format
    if (value >= 10000000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(value);
    }
    
    // Regular currency format for smaller numbers
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
      <div className="w-full h-full bg-gray-800 bg-opacity-50 rounded-lg shadow-md border border-gray-700 text-white p-12 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <DollarSign size={32} className="text-white animate-spin" />
          </div>
          <p className="mt-4 text-blue-300 text-lg">Loading budget data...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`w-full min-h-[800px] bg-gray-800 bg-opacity-80 rounded-lg shadow-md border border-gray-700 text-white 
                 transform transition-all duration-1000 ease-out overflow-hidden
                 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {/* Header with income and actions */}
      <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-900 p-3 rounded-full mr-4 transform transition-all duration-1000 ease-out">
            <DollarSign size={28} className={`text-blue-300 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Your Budget</h1>

            {editMode ? (
              <div className="mt-1">
                <div className="relative max-w-52 overflow-hidden">
                  <input
                    type="number"
                    value={tempIncome > 0 ? tempIncome : ''} 
                    onChange={(e) => handleIncomeChange(e.target.value)}
                    className="text-xl font-semibold text-blue-300 bg-transparent border-b border-blue-600 focus:outline-none w-full"
                    style={{ appearance: 'textfield' }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xl text-blue-300 font-semibold">{formatCurrency(realIncome)}/month</p>
            )}
          </div>
        </div>
        
        <div className="flex gap-3 mt-2 sm:mt-0">
          {!editMode ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors text-base"
            >
              <Edit2 size={18} /> Edit Budget
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors text-base"
              >
                <X size={18} /> Cancel
              </button>
              <button
                onClick={handleSave}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {/* Chart Section - Always Visible */}
        <div className="p-6 border-b border-gray-700 md:border-r md:border-b-0">
          <h2 className="text-lg font-medium text-blue-200 mb-2">Allocation Overview</h2>
          <div className={`h-90 transition-all duration-1500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={editMode ? tempCategories : categories}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="85%"
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
                  animationDuration={1500} // Increased from 800
                  animationBegin={200} // Increased from 100
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
            <div className={`p-3 mt-3 rounded-lg text-base flex items-center justify-center ${
              Math.abs(totalPercentage - 100) <= 0.5
                ? 'bg-blue-900 text-blue-200' 
                : 'bg-yellow-900 bg-opacity-40 text-yellow-200'
            }`}>
              <Percent size={18} className="mr-2" />
              {totalPercentage.toFixed(1)}% allocated {Math.abs(totalPercentage - 100) > 0.5 && `(need 100%)`}
            </div>
          )}

          {/* Add category button (only in edit mode) */}
          {editMode && (
            <div className="mt-4">
              {isAddingCategory ? (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name"
                    className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-md text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors text-base"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingCategory(true)}
                  className="w-full py-3 px-4 bg-gray-700 text-blue-300 rounded-lg hover:bg-gray-600 transition-colors text-base flex items-center justify-center"
                >
                  <PlusCircle size={18} className="mr-2" /> Add New Category
                </button>
              )}
            </div>
          )}
        </div>

        {/* Category cards - grid layout */}
        <div className="col-span-2 p-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium text-blue-200">Category Breakdown</h2>
            <div className="text-sm text-blue-300">
              {editMode ? "Click on a category to adjust" : "Click on chart or cards to focus"}
            </div>
          </div>
          
          {/* Color Picker Modal - Now positioned absolutely based on click location */}
          {colorPickerOpen && (
            <div 
              className="fixed z-50 bg-gray-900 border border-gray-700 p-4 rounded-lg shadow-xl" 
              style={{ 
                top: `${colorPickerPosition.top}px`, 
                left: `${colorPickerPosition.left}px`,
                maxWidth: '320px' // Ensure it doesn't get cut off too much
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-blue-200">Choose a color</h3>
                <button 
                  onClick={() => setColorPickerOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2 max-w-md">
                {colorPalette.map((color, index) => (
                  <div 
                    key={index}
                    className="w-8 h-8 rounded-full cursor-pointer border-2 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color, borderColor: color }}
                    onClick={() => handleColorSelect(color)}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(editMode ? tempCategories : categories).map((category, index) => (
              <div 
                key={category.id} 
                className={`p-4 rounded-lg border transition-all cursor-pointer
                          transform transition-all duration-800 ease-out
                          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                          ${
                            (activeIndex !== null && categories[activeIndex]?.id === category.id) || 
                            selectedCategory === category.id
                              ? 'border-blue-600 bg-blue-900 bg-opacity-40' 
                              : 'border-gray-700 hover:border-blue-800 bg-gray-800 bg-opacity-60'
                          }`}
                onClick={() => setSelectedCategory(category.id)}
                style={{ transitionDelay: `${index * 100}ms` }} // Increased delay between cards
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {editMode && selectedCategory === category.id ? (
                      <div 
                        ref={colorPickerCategoryId === category.id ? colorPickerButtonRef : null}
                        className="w-5 h-5 rounded-full mr-3 cursor-pointer flex items-center justify-center hover:ring-2 hover:ring-white"
                        style={{ backgroundColor: category.color }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setColorPickerCategoryId(category.id);
                          setColorPickerOpen(true);
                        }}
                      >
                        <Palette size={10} className="text-white opacity-0 hover:opacity-100" />
                      </div>
                    ) : (
                      <div 
                        className="w-5 h-5 rounded-full mr-3" 
                        style={{ backgroundColor: category.color }} 
                      />
                    )}
                    <h3 className="font-medium text-base text-white">{category.name}</h3>
                  </div>
                  <div className="flex items-center">
                    {editMode && selectedCategory === category.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCategory(category.id);
                        }}
                        className="mr-3 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    {selectedCategory === category.id && editMode ? (
                      <div 
                        className="relative max-w-32 overflow-hidden">
                        <input
                          type="number"
                          placeholder={category.amount}
                          value={category.amount > 0 ? category.amount : ''}
                          onChange={(e) => handleAmountChange(category.id, e.target.value)}
                          className="font-bold text-white w-full text-right border-none outline-none focus:ring-0 bg-gray-700"
                          style={{ appearance: 'textfield' }}
                          max={tempIncome}
                        />
                      </div>
                    ) : (
                      <span className="font-bold text-white text-base truncate max-w-32">{formatCurrency(category.amount)}</span>
                    )}
                  </div>
                </div>
                
                {/* Progress bar or slider based on mode */}
                {selectedCategory === category.id && editMode ? (
                  <div className="flex items-center mt-3 gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={category.percentage}
                      onChange={(e) => handlePercentageChange(category.id, e.target.value)}
                      className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      style={{ accentColor: category.color }}
                    />
                    <div className="w-14 flex items-center">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder={category.percentage}
                        min="0"
                        max="100"
                        value={category.percentage === 100 ? "100" : (category.percentage > 0 ? category.percentage : '')}
                        onChange={(e) => handlePercentageChange(category.id, e.target.value)}
                        className="w-10 p-1 text-sm border border-gray-600 rounded text-center bg-gray-700 text-white"
                      />
                      <span className="text-sm text-blue-300 ml-1">%</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center mt-3">
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-2 rounded-full transition-all duration-1500 ease-out" // Increased from 500ms
                        style={{ 
                          width: isVisible ? `${category.percentage}%` : '0%',
                          backgroundColor: category.color 
                        }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-blue-300 min-w-8 text-center">
                      {category.percentage?.toFixed(1)}%
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
import React, { useState, useEffect, useRef } from 'react';
import { DollarSign } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../contexts/Context';
import BudgetHeader from './BudgetHeader';
import BudgetChart from './BudgetChart';
import CategoryList from './CategoryList';
import ColorPicker from './ColorPicker';

const BudgetReport = () => {
  // States
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [tempCategories, setTempCategories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [realIncome, setRealIncome] = useState(5000);
  const [tempIncome, setTempIncome] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [colorPickerPosition, setColorPickerPosition] = useState({ top: 0, left: 0 });
  const [removedIds, setRemovedIds] = useState([]);
  const [selected, setSelected] = useState(null);
  const { budget, setBudget } = useUser();
  const options = [ 'Select an option', 'Rent', 'Utilities', 'Food', 'Transportation', 'Recreation', 'Insurance', 'Loans', 'Savings', 'Other'];

  // Ref for the color picker button
  const colorPickerButtonRef = useRef(null);
  
  // Animation effect on mount
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 300);
  }, []);

  // Initialize component with data from context
  useEffect(() => {
    const storedIncome = parseInt(sessionStorage.getItem("income")) || 5000;
    setRealIncome(storedIncome);
    
    if (budget && typeof budget === 'object') {
      if (Array.isArray(budget)) {
        setCategories(budget);
      } else {
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

  // Position the color picker
  useEffect(() => {
    if (colorPickerOpen && colorPickerButtonRef.current) {
      const buttonRect = colorPickerButtonRef.current.getBoundingClientRect();
      setColorPickerPosition({
        top: buttonRect.bottom + window.scrollY + 5,
        left: buttonRect.left + window.scrollX
      });
    }
  }, [colorPickerOpen]);

  // Create default categories
  const createDefaultCategories = (income) => {
    const defaultCats = [
      { id: 1, name: 'Housing', color: '#FF6384', percentage: 30, amount: income * 0.3 },
      { id: 2, name: 'Food', color: '#36A2EB', percentage: 15, amount: income * 0.15 },
      { id: 3, name: 'Transportation', color: '#FFCE56', percentage: 10, amount: income * 0.1 },
      { id: 4, name: 'Utilities', color: '#4BC0C0', percentage: 10, amount: income * 0.1 },
      { id: 5, name: 'Recreation', color: '#9966FF', percentage: 10, amount: income * 0.1 },
      { id: 6, name: 'Savings', color: '#FF9F40', percentage: 15, amount: income * 0.15 },
      { id: 7, name: 'Misc', color: '#C9CBCF', percentage: 10, amount: income * 0.1 },
    ];
    
    setCategories(defaultCats);
    
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

  // Event handlers
  const handleEdit = () => {
    setTempCategories([...categories]);
    setTempIncome(realIncome);
    setEditMode(true);
  };
  
  const handleIncomeChange = (value) => {
    if (value < 200000000) {
      const numValue = parseFloat(value) || 0;
      setTempIncome(numValue);
      setTempCategories(tempCategories.map(cat => ({
        ...cat,
        amount: numValue > 0 ? parseFloat((numValue * (cat.percentage / 100)).toFixed(2)) : 0
      })));
    }
  };
  const handleSelected = (index) => {
    setSelected(index);
    // Update the category ID based on the dropdown selection
    if (selectedCategory !== null) {
      console.log('Updating category:', selectedCategory, 'with index:', index);
      const updatedCategories = tempCategories.map(cat => {
        if (cat.id === selectedCategory) {
          console.log('Found matching category:', cat);
          return { ...cat, categoryId: index };
        }
        return cat;
      });
      console.log('Updated categories:', updatedCategories);
      setTempCategories(updatedCategories);
    }
  };
  const handleCancel = () => {
    setEditMode(false);
    setIsAddingCategory(false);
    setSelectedCategory(null);
    setColorPickerOpen(false);
  };

  const handleColorSelect = (color) => {
    if (selectedCategory) {
      setTempCategories(tempCategories.map(cat => 
        cat.id === selectedCategory ? { ...cat, color } : cat
      ));
      setColorPickerOpen(false);
    }
  };

  const handleAddCategory = () => {
    if (!isAddingCategory) {
      setIsAddingCategory(true);
      return;
    }

    if (!newCategoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    if (newCategoryName.length > 20) {
      alert("Category name cannot exceed 20 characters");
      return;
    }

    const newId = -1 * Date.now();
    const defaultColor = '#FF6384'; // Default color for new categories
    
    const newCategory = {
      id: newId,
      name: newCategoryName,
      color: defaultColor,
      percentage: 0,
      amount: 0,
      categoryId: 0 // Initialize with null categoryId
    };

    setTempCategories([...tempCategories, newCategory]);
    setNewCategoryName('');
    setIsAddingCategory(false);
    setSelectedCategory(newId);
  };

  const handleRemoveCategory = (id) => {
    if (tempCategories.length <= 1) {
      alert("You must have at least one category");
      return;
    }
    
    setTempCategories(tempCategories.filter(cat => cat.id !== id));
    setRemovedIds([...removedIds, id]);
    if (selectedCategory === id) {
      setSelectedCategory(null);
    }
  };

  const handleSave = async () => {
    const total = tempCategories.reduce((sum, cat) => sum + cat.percentage, 0);
    if (Math.abs(total - 100) > 0.5) {
      alert(`Your total allocation is ${total.toFixed(1)}%. Please adjust to exactly 100%.`);
      return;
    }

    // Check for categories with categoryId of 0
    const hasInvalidCategoryId = tempCategories.some(cat => cat.categoryId === 0);
    if (hasInvalidCategoryId) {
      alert('Please select a category type for all categories before saving.');
      return;
    }
  
    try {
      const updatedCategories = tempCategories.map(cat => ({
        ...cat,
        amount: parseFloat((tempIncome * (cat.percentage / 100)).toFixed(2))
      }));
  
      const categoriesForApi = updatedCategories.map(cat => ({
        Id: cat.id,
        Category: cat.name,
        Color: cat.color,
        Amount: cat.amount,
        CategoryId: cat.categoryId
      }));
      
      const budgetObject = {};
      updatedCategories.forEach((cat, index) => {
        budgetObject[index] = {
          id: cat.id,
          name: cat.name,
          color: cat.color,
          amount: cat.amount,
          categoryId: cat.categoryId
        };
      });

      const requestData = {
        Income: parseInt(tempIncome), 
        Categories: categoriesForApi,
        DeletedAllocationIds: removedIds.filter(id => id !== 0)
      };

      const processedCategories = Object.values(budgetObject).map(cat => ({
        ...cat,
        percentage: tempIncome > 0 ? parseFloat(((cat.amount / tempIncome) * 100).toFixed(1)) : 0
      }));

      setBudget(processedCategories);
      setCategories(updatedCategories);
      sessionStorage.setItem("income", tempIncome);
      setRealIncome(tempIncome);
      setEditMode(false);
      setSelectedCategory(null);
      setRemovedIds([]);

      console.log(requestData)
  
      await axios.post('https://localhost:5252/api/Budget/update', requestData, {
        withCredentials: true
      });
  
    } catch (error) {
      console.error('Error saving budget:', error);
      alert('Failed to save budget. Please try again.');
    }
  };

  const handlePercentageChange = (id, value) => {
    if (value === '' || value === '0') {
      setTempCategories(tempCategories.map(cat => 
        cat.id === id ? { ...cat, percentage: value === '' ? 0 : 0, amount: 0 } : cat
      ));
      return;
    }
    
    if (!/^\d+$/.test(value)) {
      return;
    }

    let newValue = Math.min(100, Math.max(0, parseInt(value) || 0));
    
    // Calculate the current total percentage excluding the category being changed
    const currentTotal = tempCategories.reduce((sum, cat) => 
      cat.id === id ? sum : sum + cat.percentage, 0
    );
    
    // If the new value would make the total exceed 100%, adjust it
    if (currentTotal + newValue > 100) {
      newValue = 100 - currentTotal;
    }
    
    const newAmount = parseFloat((tempIncome * (newValue / 100)).toFixed(2));
    
    setTempCategories(tempCategories.map(cat => 
      cat.id === id ? { ...cat, percentage: newValue, amount: newAmount } : cat
    ));
  };

  const handleAmountChange = (id, value) => {
    if (value === '' || value === '0') {
      setTempCategories(tempCategories.map(cat => 
        cat.id === id ? { ...cat, percentage: 0, amount: value === '' ? 0 : 0 } : cat
      ));
      return;
    }

    let numValue = parseFloat(value) || 0;
    
    if (numValue > tempIncome) {
      numValue = tempIncome;
    }
    
    const newPercentage = tempIncome > 0 ? parseFloat((numValue / tempIncome * 100).toFixed(1)) : 0;

    setTempCategories(tempCategories.map(cat => 
      cat.id === id ? { ...cat, percentage: newPercentage, amount: numValue } : cat
    ));
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const onPieClick = (_, index) => {
    const cats = editMode ? tempCategories : categories;
    if (cats[index]) {
      setSelectedCategory(cats[index].id);
    }
  };

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

  const totalPercentage = editMode 
    ? tempCategories.reduce((sum, cat) => sum + cat.percentage, 0) 
    : 100;

  return (
    <div 
      className={`w-full min-h-[800px] bg-gray-800 bg-opacity-80 rounded-lg shadow-md border border-gray-700 text-white 
                 transform transition-all duration-1000 ease-out overflow-hidden
                 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <BudgetHeader
        editMode={editMode}
        realIncome={realIncome}
        tempIncome={tempIncome}
        onIncomeChange={handleIncomeChange}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSave={handleSave}
        totalPercentage={totalPercentage}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        <BudgetChart
          categories={editMode ? tempCategories : categories}
          isEditMode={editMode}
          activeIndex={activeIndex}
          onPieEnter={onPieEnter}
          onPieLeave={onPieLeave}
          onPieClick={onPieClick}
          isVisible={isVisible}
          isAddingCategory={isAddingCategory}
          newCategoryName={newCategoryName}
          onNewCategoryNameChange={setNewCategoryName}
          onAddCategory={handleAddCategory}
          totalPercentage={totalPercentage}
        />

        <CategoryList
          categories={editMode ? tempCategories : categories}
          editMode={editMode}
          selectedCategory={selectedCategory}
          activeIndex={activeIndex}
          onSelectCategory={setSelectedCategory}
          onRemoveCategory={handleRemoveCategory}
          onAmountChange={handleAmountChange}
          onPercentageChange={handlePercentageChange}
          colorPickerRef={colorPickerButtonRef}
          onColorPickerOpen={(id) => {
            setSelectedCategory(id);
            setColorPickerOpen(true);
          }}
          isVisible={isVisible}
          selected={selected}
          setSelected={handleSelected}
          options={options}
        />
      </div>

      <ColorPicker
        isOpen={colorPickerOpen}
        position={colorPickerPosition}
        onClose={() => setColorPickerOpen(false)}
        onColorSelect={handleColorSelect}
      />
    </div>
  );
};

export default BudgetReport;
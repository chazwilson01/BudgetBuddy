import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/Context';
import "./BudgetProgress.css"


const BudgetProgressBars = () => {

   const {budget, transactions} = useUser() 

   const categorizedSpending = transactions.categorizedSpending
  // Define budget categories with their limits
  const [budgetCategories, setBudgetCategories] = useState([
    { id: "rent", name: "Rent", budget: 1500, spent: 0, icon: "🏠" },
    { id: "utilities", name: "Utilities", budget: 300, spent: 0, icon: "💡" },
    { id: "groceries", name: "Groceries", budget: 500, spent: 0, icon: "🛒" },
    { id: "transportation", name: "Transportation", budget: 250, spent: 0, icon: "🚗" },
    { id: "entertainment", name: "Entertainment", budget: 200, spent: 0, icon: "🎬" },
    { id: "insurance", name: "Insurance", budget: 200, spent: 0, icon: "🛡️" },
    { id: "loans", name: "Loans", budget: 400, spent: 0, icon: "💰" },
    { id: "savings", name: "Savings", budget: 600, spent: 0, icon: "💲" },
    { id: "other", name: "Other", budget: 300, spent: 0, icon: "📦" },
  ]);

  // Get current date info for the progress indicator
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const daysRemaining = daysInMonth - currentDay;
  const monthPercentElapsed = (currentDay / daysInMonth) * 100;

  // Update categories when categorizedSpending changes
  useEffect(() => {
    console.log("BUDGET", budget);
    
    // Only proceed with updates if we have at least one data source
    if (categorizedSpending || (budget && Array.isArray(budget))) {
      // Start with the current budgetCategories
      let updatedCategories = [...budgetCategories];
      
      // Update spending data if available
      if (categorizedSpending) {
        updatedCategories = updatedCategories.map(category => ({
          ...category,
          spent: categorizedSpending[category.id] || 0
        }));
      }
      
      // Update budget data if available
      if (budget && Array.isArray(budget)) {
        const budgetLookup = budget.reduce((acc, item) => {
          acc[item.id] = item.amount;
          return acc;
        }, {});
        
        updatedCategories = updatedCategories.map(category => ({
          ...category,
          budget: budgetLookup[category.id] || 0
        }));
      }
      
      // Apply all updates with a single state update
      setBudgetCategories(updatedCategories);
    }
  }, [budget, categorizedSpending]);

  // Get color for progress bar based on percentage spent vs. time
  const getProgressColor = (percentSpent, percentTime) => {
    if (percentSpent > 100) {
      return "bg-red-500"; // Over budget
    } else if (percentSpent > percentTime + 10) {
      return "bg-yellow-500"; // Ahead of pace (spending too fast)
    } else {
      return "bg-green-500"; // On track or under budget
    }
  };

  return (
    <div 
    
    className="w-full max-w-lg p-5 bg-white rounded-lg shadow-lg fade-in"
    
    >
        
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Monthly Budget Progress</h2>
        <div className="text-sm text-gray-600">
          <span className="font-medium">{daysRemaining} days remaining</span> • {Math.round(monthPercentElapsed)}% complete
        </div>
      </div>
      
      <div className="space-y-4">
        {budgetCategories.map((category, index) => {
          const percentSpent = Math.round((category.spent / category.budget) * 100);
          const progressBarColor = getProgressColor(percentSpent, monthPercentElapsed);
          
          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">${category.spent.toFixed(2)} <span className="text-gray-500 text-sm">of ${category.budget}</span></div>
                  <div className={`text-xs ${percentSpent > 100 ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                    {percentSpent > 100 ? `${percentSpent - 100}% over budget` : `${Math.round(100 - percentSpent)}% remaining`}
                  </div>
                </div>
              </div>
              
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                {/* Main progress bar with smooth transition */}
                <div 
                  className={`absolute top-0 left-0 h-full ${progressBarColor} rounded-full transition-all duration-1000 ease-in-out`}
                  style={{ width: `${Math.min(percentSpent, 100)}%` }}
                ></div>
                
                {/* Time indicator line */}
                <div 
                  className="absolute top-0 h-full border-l border-gray-700"
                  style={{ left: `${monthPercentElapsed}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-1"></div>
            <span>On track</span>
          </div>
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-1"></div>
            <span>Spending too fast</span>
          </div>
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1"></div>
            <span>Over budget</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetProgressBars;
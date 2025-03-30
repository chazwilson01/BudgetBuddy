import React from 'react';
import { useUser } from '../contexts/Context';
import "./BudgetProgress.css"
import { Home, Lightbulb, Pizza, Car, Film, Shield, Landmark, Heart, PiggyBank, MoreHorizontal } from 'lucide-react';

const BudgetProgressBars = () => {
  const { budget, transactions } = useUser();
  const categorizedSpending = transactions?.categorizedSpending || {};
  
  // Get current date info for the progress indicator
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const daysRemaining = daysInMonth - currentDay;
  const monthPercentElapsed = (currentDay / daysInMonth) * 100;

  // Category configuration
  const categoryConfig = {
    1: { name: 'Rent', icon: Home, color: 'text-purple-500' },
    2: { name: 'Utilities', icon: Lightbulb, color: 'text-yellow-500' },
    3: { name: 'Food', icon: Pizza, color: 'text-red-500' },
    4: { name: 'Transportation', icon: Car, color: 'text-blue-500' },
    5: { name: 'Recreation', icon: Film, color: 'text-pink-500' },
    6: { name: 'Insurance', icon: Shield, color: 'text-green-500' },
    7: { name: 'Loans', icon: Landmark, color: 'text-indigo-500' },
    8: { name: 'Savings', icon: PiggyBank, color: 'text-emerald-500' },
    9: { name: 'Other', icon: MoreHorizontal, color: 'text-gray-500' }
  };

  // Get color for progress bar based on percentage spent vs. time
  const getProgressColor = (percentSpent, percentTime, spent, amount) => {
    if (amount === 0) {
      return "bg-red-500"; // No spending yet
    } else if (percentSpent > 100) {
      return "bg-red-500"; // Over budget
    } else if (percentSpent > percentTime + 10) {
      return "bg-yellow-500"; // Ahead of pace (spending too fast)
    } else {
      return "bg-green-500"; // On track or under budget
    }
  };

  // If no budget data is available, show a message
  if (!budget || !Array.isArray(budget)) {
    return (
      <div className="w-full max-w-lg p-5 bg-white rounded-lg shadow-lg fade-in">
        <div className="text-center text-gray-600">
          No budget data available. Please create a budget first.
        </div>
      </div>
    );
  }

  // Initialize all categories with default values
  const groupedCategories = Object.entries(categoryConfig).reduce((acc, [categoryId, config]) => {
    acc[categoryId] = {
      ...config,
      amount: 0,
      spent: 0
    };
    return acc;
  }, {});

  // Update amounts and spent values from budget data
  budget.forEach(category => {
    const categoryId = category.categoryId;
    if (groupedCategories[categoryId]) {
      groupedCategories[categoryId].amount += category.amount;
      groupedCategories[categoryId].spent += categorizedSpending[groupedCategories[categoryId].name.toLowerCase()] || 0;
    }
  });

  return (
    <div className="w-full max-w-lg p-5 bg-white rounded-lg shadow-lg fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-blue-800">Monthly Budget Progress</h2>
        <div className="text-sm text-gray-600">
          <span className="font-medium text-blue-600">{daysRemaining} days remaining</span> • {Math.round(monthPercentElapsed)}% complete
        </div>
      </div>
      
      <div className="space-y-4">
        {Object.entries(groupedCategories).map(([categoryId, category]) => {
          const percentSpent = category.amount === 0 
            ? (category.spent > 0 ? 100 : 0) // If budget is 0 but spent > 0, show 100%, otherwise 0%
            : Math.round((category.spent / category.amount) * 100);
          const progressBarColor = getProgressColor(percentSpent, monthPercentElapsed, category.spent, category.amount);
          const Icon = category.icon;
          
          return (
            <div key={categoryId} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Icon className={`w-5 h-5 ${category.color}`} />
                  <span className="font-medium text-blue-600">{category.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">${category.spent.toFixed(2)} <span className="text-gray-500 text-sm">of ${category.amount}</span></div>
                  <div className={`text-xs ${percentSpent > 100 ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                    {category.amount === 0 
                      ? (category.spent > 0 ? "No budget set" : "No budget set")
                      : (percentSpent > 100 ? `${percentSpent - 100}% over budget` : `${Math.round(100 - percentSpent)}% remaining`)}
                  </div>
                </div>
              </div>
              
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                {/* Main progress bar with smooth transition */}
                <div 
                  className={`absolute top-0 left-0 h-full ${progressBarColor} rounded-full transition-all duration-1000 ease-in-out`}
                  style={{ width: `${category.spent === 0 ? 0 : Math.min(percentSpent, 100)}%` }}
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
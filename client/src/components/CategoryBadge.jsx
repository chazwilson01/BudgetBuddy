import React from 'react';
import { Home, Lightbulb, Pizza, Car, Film, Shield, Landmark, PiggyBank, MoreHorizontal } from 'lucide-react';

const CategoryBadge = ({ category }) => {
  // Configuration for each category
  const categoryConfig = {
    'Rent': { 
      icon: Home, 
      color: 'bg-purple-500',
      textColor: 'text-purple-100'
    },
    'Utilities': { 
      icon: Lightbulb, 
      color: 'bg-yellow-500',
      textColor: 'text-yellow-100'
    },
    'Food': { 
      icon: Pizza, 
      color: 'bg-red-500',
      textColor: 'text-red-100'
    },
    'Transportation': { 
      icon: Car, 
      color: 'bg-blue-500',
      textColor: 'text-blue-100'
    },
    'Recreation': { 
      icon: Film, 
      color: 'bg-pink-500',
      textColor: 'text-pink-100'
    },
    'Insurance': { 
      icon: Shield, 
      color: 'bg-green-500',
      textColor: 'text-green-100'
    },
    'Loans': { 
      icon: Landmark, 
      color: 'bg-indigo-500',
      textColor: 'text-indigo-100'
    },
    'Savings': { 
      icon: PiggyBank, 
      color: 'bg-emerald-500',
      textColor: 'text-emerald-100'
    },
    'Other': { 
      icon: MoreHorizontal, 
      color: 'bg-gray-500',
      textColor: 'text-gray-100'
    }
  };

  // Default to 'Other' if category not found in config
  const config = categoryConfig[category] || categoryConfig['Other'];
  const Icon = config.icon;

  return (
    <div className={`absolute -top-2 -left-2 rounded-md px-2 py-1 ${config.color} ${config.textColor} text-xs font-medium flex items-center shadow-md`}>
      <Icon className="w-3 h-3 mr-1" />
      {category}
    </div>
  );
};

export default CategoryBadge; 
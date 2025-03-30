import React from 'react';
import { Trash2, Palette } from 'lucide-react';
import DropdownMenu from './DropdownMenu';
import CategoryBadge from './CategoryBadge';

const CategoryCard = ({
  category,
  isEditMode,
  isSelected,
  isActive,
  onSelect,
  onRemove,
  onAmountChange,
  onPercentageChange,
  colorPickerRef,
  onColorPickerOpen,
  isVisible,
  index,
  selected,
  setSelected,
  options
}) => {
  // Get the category name from the options array using categoryId
  const categoryType = category.categoryId ? options[category.categoryId] : null;
  console.log('CategoryCard render:', { category, categoryType, categoryId: category.categoryId });

  return (
    <div 
      className={`pt-6 px-4 pb-4 rounded-lg border transition-all cursor-pointer relative
                transform transition-all duration-800 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                ${
                  (isActive !== null && isActive === category.id) || 
                  isSelected === category.id
                    ? 'border-blue-600 bg-blue-900 bg-opacity-40' 
                    : 'border-gray-700 hover:border-blue-800 bg-gray-800 bg-opacity-60'
                }`}
      onClick={() => onSelect(category.id)}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {categoryType && <CategoryBadge category={categoryType} />}
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          {isEditMode && isSelected === category.id ? (
            <div 
              ref={colorPickerRef}
              className="w-5 h-5 rounded-full mr-3 cursor-pointer flex items-center justify-center hover:ring-2 hover:ring-white"
              style={{ backgroundColor: category.color }}
              onClick={(e) => {
                e.stopPropagation();
                onColorPickerOpen(category.id);
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
          <div>
            <h3 className="font-medium text-base text-white">{category.name}</h3>
          </div>
        </div>
        <div className="flex items-center">
          {isEditMode && isSelected === category.id && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(category.id);
              }}
              className="mr-3 text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          )}
          {isSelected === category.id && isEditMode ? (
            <div className="relative max-w-32 overflow-hidden">
              <input
                type="number"
                placeholder={category.amount}
                value={category.amount > 0 ? category.amount : ''}
                onChange={(e) => onAmountChange(category.id, e.target.value)}
                className="font-bold text-white w-full text-right border-none outline-none focus:ring-0 bg-gray-700"
                style={{ appearance: 'textfield' }}
              />
            </div>
          ) : (
            <span className="font-bold text-white text-base truncate max-w-32">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(category.amount)}
            </span>
          )}
        </div>
      </div>
      
      {isSelected === category.id && isEditMode ? (
        <>
          <div className="flex items-center mt-3 gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={category.percentage}
              onChange={(e) => onPercentageChange(category.id, e.target.value)}
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
                onChange={(e) => onPercentageChange(category.id, e.target.value)}
                className="w-10 p-1 text-sm border border-gray-600 rounded text-center bg-gray-700 text-white"
              />
              <span className="text-sm text-blue-300 ml-1">%</span>
            </div>
          </div>
          <div className="mt-2">
            <DropdownMenu selected={category.categoryId || 0} setSelected={setSelected} />
          </div>
        </>
      ) : (
        <div className="flex items-center mt-3">
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="h-2 rounded-full transition-all duration-1500 ease-out"
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
  );
};

export default CategoryCard; 
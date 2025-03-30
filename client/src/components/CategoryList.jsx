import React from 'react';
import CategoryCard from './CategoryCard';

const CategoryList = ({
  categories,
  editMode,
  selectedCategory,
  activeIndex,
  onSelectCategory,
  onRemoveCategory,
  onAmountChange,
  onPercentageChange,
  colorPickerRef,
  onColorPickerOpen,
  isVisible,
  selected,
  setSelected,
  options
}) => {
  return (
    <div className="col-span-2 p-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium text-blue-200">Category Breakdown</h2>
        <div className="text-sm text-blue-300">
          {editMode ? "Click on a category to adjust" : "Click on chart or cards to focus"}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {categories.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            isEditMode={editMode}
            isSelected={selectedCategory}
            isActive={activeIndex}
            onSelect={onSelectCategory}
            onRemove={onRemoveCategory}
            onAmountChange={onAmountChange}
            onPercentageChange={onPercentageChange}
            colorPickerRef={colorPickerRef}
            onColorPickerOpen={onColorPickerOpen}
            isVisible={isVisible}
            index={index}
            selected={selected}
            setSelected={setSelected}
            options={options}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryList; 
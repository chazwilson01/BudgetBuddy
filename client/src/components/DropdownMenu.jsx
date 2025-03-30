import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const DropdownMenu = ({selected, setSelected}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const options = ['Select an option', 'Rent', 'Utilities', 'Food', 'Transportation', 'Recreation', 'Insurance', 'Loans', 'Savings', 'Other'];
  
  const handleSelect = (option) => {
    console.log('DropdownMenu handleSelect:', { option, index: options.indexOf(option) });
    setSelected(options.indexOf(option));
    setIsOpen(false);
  };
  
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4">
      
      
      <div className="relative w-full">
        {/* Dropdown Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 flex justify-between items-center shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className='text-black'>{options[selected]}</span>
          <ChevronDown className={`text-black w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />

        </button>
        
        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10 border border-gray-300">
            <ul className="py-1 max-h-40 overflow-auto">
              {options.map((option, index) => (
                <li 
                  key={index}
                  onClick={() => handleSelect(option)}
                  className="px-4 py-2 text-gray-700 text-sm hover:bg-blue-100 hover:text-blue-900 cursor-pointer"
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
     </div>
  );
};

export default DropdownMenu;
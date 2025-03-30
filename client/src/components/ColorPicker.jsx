import React from 'react';
import { X } from 'lucide-react';
import { ChromePicker } from 'react-color';

const ColorPicker = ({ 
  isOpen, 
  position, 
  onClose, 
  onColorSelect 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed z-50 bg-gray-900 border border-gray-700 p-4 rounded-lg shadow-xl" 
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px`
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-blue-200">Choose a color</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
      <ChromePicker
        onChange={(color) => onColorSelect(color.hex)}
        disableAlpha={true}
        styles={{
          default: {
            picker: {
              background: '#1f2937',
              border: 'none',
              boxShadow: 'none'
            },
            saturation: {
              borderRadius: '0.5rem'
            },
            body: {
              padding: '0'
            },
            controls: {
              padding: '0.5rem'
            },
            fields: {
              padding: '0.5rem'
            }
          }
        }}
      />
    </div>
  );
};

export default ColorPicker; 
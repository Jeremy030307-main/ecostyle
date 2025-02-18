import { useState, useRef, useEffect } from 'react';
import "./VariantSelector.css"

const CustomSelect = ({ value, options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(placeholder);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const selected = options.find(opt => opt.id === value);
    setSelectedOption(selected ? selected.name : placeholder);
  }, [value, options, placeholder]);

  return (
    <div className="custom-select-container">
      <div className="select-wrapper" ref={dropdownRef}>
        <div 
          className={`custom-select ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="selected-text">{selectedOption}</span>
          <svg className="dropdown-arrow" width="14" height="14" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z" fill="currentColor"/>
          </svg>
        </div>
        {isOpen && (
          <div className="dropdown-menu show">
            <div onClick={() => {
              onChange('');
              setSelectedOption(placeholder);
              setIsOpen(false);
            }}>
              {placeholder}
            </div>
            {options.map((option) => (
              <div
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  setSelectedOption(option.name);
                  setIsOpen(false);
                }}
              >
                {option.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const VariantSelector = ({ variants, availableColors, handleColorChange, handleImageUpload, removeVariant }) => {
  return (
    <div className="add-variants-container">
      <p className="upload-section">Variances</p>
      {variants.map((variant, index) => (
        <div key={index} className="variant-row">
          <CustomSelect
            value={variant.color}
            options={availableColors}
            onChange={(value) => handleColorChange(index, value)}
            placeholder="Select Color"
          />
          
          <div className="file-input-wrapper">
            <label className="file-upload-button">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(index, e.target.files[0])}
                className="hidden-file-input"
              />
            </label>
          </div>

          {variant.image && (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(variant.image)}
                alt="Preview"
              />
            </div>
          )}

          <button type='button'
            className="remove-button" 
            onClick={() => removeVariant(index)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default VariantSelector;
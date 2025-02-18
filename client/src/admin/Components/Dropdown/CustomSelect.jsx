import { useState, useRef, useEffect } from 'react';
import "./CustomSelect.css"

// Custom Select Component
const CustomSelect = ({ label, value, options, onChange, placeholder, nolabel, bgcolor}) => {
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

  // Update selected option text when value changes
  useEffect(() => {
    const selected = options.find(opt => opt.id === value);
    setSelectedOption(selected ? selected.name : placeholder);
  }, [value, options, placeholder]);

  const handleSelect = (optionId, optionName) => {
    setSelectedOption(optionName);
    onChange(optionId);
    setIsOpen(false);
  };

  return (
    <div className="custom-select-container">
      {!nolabel && <p className="upload-section">{label}</p>}
      <div className="select-wrapper" ref={dropdownRef}>
        <div 
          className={`custom-select ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          style={ bgcolor ? { backgroundColor: bgcolor, color: "black" } : {} }
        >
          <span className="selected-text">{selectedOption}</span>
          <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z" fill="currentColor"/>
          </svg>
        </div>
        {isOpen && (
          <div className="dropdown-menu show" style={ bgcolor ? { backgroundColor: bgcolor} : {} }>
            <div onClick={() => handleSelect('', placeholder)} style={ bgcolor ? {color: "black" } : {} }>
              {placeholder}
            </div>
            {options.map((option) => (
              <div
                key={option.id}
                onClick={() => handleSelect(option.id, option.name)}
                style={ bgcolor ? {color: "black" } : {} }
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

export default CustomSelect;
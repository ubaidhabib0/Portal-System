'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Dropdown({ options, selected, onChange, placeholder = 'Select Option' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const getLabel = () => {
    if (!selected) return placeholder;
    const option = options.find(opt => 
      typeof opt === 'object' ? opt.value === selected : opt === selected
    );
    if (!option) return selected;
    return typeof option === 'object' ? option.label : option;
  };

  return (
    <div className="custom-dropdown-container" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="custom-dropdown-btn"
      >
        <span>{getLabel()}</span>
        <ChevronDown 
          style={{ 
            width: '1rem', 
            height: '1rem', 
            transition: 'transform 0.2s', 
            transform: isOpen ? 'rotate(180deg)' : 'none' 
          }} 
        />
      </button>

      {isOpen && (
        <ul className="custom-dropdown-list">
          {options.map((option, index) => {
            const val = typeof option === 'object' ? option.value : option;
            const lbl = typeof option === 'object' ? option.label : option;
            const isSelected = val === selected;

            return (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => handleSelect(val)}
                  className={`custom-dropdown-item ${isSelected ? 'selected' : ''}`}
                >
                  {lbl}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

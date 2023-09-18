import React from 'react';

function ContextMenu({ options, onClose, position }) {
  const handleOptionClick = (action) => {
    action(); // Execute the selected action
    onClose(); // Close the context menu
  };

  return (
    <div style={{ position: 'absolute', left: position.x, top: position.y }}>
      <ul>
        {options.map((option) => (
          <li key={option.id} onClick={() => handleOptionClick(option.action)}>
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContextMenu;

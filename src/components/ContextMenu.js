import React, { useEffect, useRef } from 'react';

function ContextMenu({ options, onClose, position }) {
  const menuRef = useRef(null);

  useEffect(() => {
    // Function to close the menu when clicking outside
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose(); // Close the context menu
      }
    };

    // Add the event listener
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Remove the event listener when the component unmounts
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute bg-white border border-gray-300 shadow-lg rounded-md p-2 z-50"
      style={{ left: position.x, top: position.y, zIndex: 9999 }}
    >
      <ul className="list-none m-0 p-0">
        {options.map((option) => (
          <li
            key={option.id}
            onClick={() => {
              option.action(); // Execute the selected action
              onClose(); // Close the context menu
            }}
            className="cursor-pointer py-2 px-4 hover:bg-gray-100 transition duration-200"
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContextMenu;

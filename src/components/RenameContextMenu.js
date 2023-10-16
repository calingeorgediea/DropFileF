import React, { useState } from 'react';

function RenameContextMenu({ folderName, onCancel, onSave, relativePath }) {

  const [newName, setNewName] = useState(folderName);

  const handleSave = () => {
    onSave(newName); // Pass the new folder name to the onSave callback
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal">
        <div className="modal-content p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">Rename Folder</h2>
          <div className="mb-4">
            <label htmlFor="newName" className="block">New Folder Name:</label>
            <input
              type="text"
              id="newName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="text-right">
            <button onClick={handleSave} className="px-4 py-2 mr-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
            <button onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default RenameContextMenu;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContextMenu from './ContextMenu';
import deleteItem from '../helper/delete_item';
function TreeNode({ node, onContextMenu, currentPath }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNode = () => {
    if (node.type === 'directory') {
      setIsOpen(!isOpen);
    }
  };

  const handleContextMenu = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
  
      let fullPath = node.name;
  
      // If there's a currentPath and it's not null, add a slash before appending the node's name
      if (currentPath !== null) {
        fullPath = `${currentPath}/${node.name}`;
      }
  
      onContextMenu(node, fullPath, event);
    }
  };
  
  
  // Skip rendering the root folder node if it's at the root level
  if (currentPath === null && node.type === 'directory') {
    return (
      <div>
        {isOpen ? '📂' : '📁'} {node.name}
        {isOpen && node.children && node.children.length > 0 && (
          <ul>
            {node.children.map((childNode) => (
              <li key={childNode.name}>
                <TreeNode
                  key={childNode.name}
                  node={childNode}
                  onContextMenu={onContextMenu}
                  currentPath={
                    currentPath
                      ? `${currentPath}/${node.name}`
                      : node.name
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div onContextMenu={handleContextMenu}>
      <div>
        <span onClick={toggleNode}>
          {node.type === 'directory' && (isOpen ? '📁' : '📂')} {node.name}
        </span>
        {isOpen && node.children && node.children.length > 0 && (
          <ul>
            {node.children.map((childNode) => (
              <li key={childNode.name}>
                <TreeNode
                  key={childNode.name}
                  node={childNode}
                  onContextMenu={onContextMenu}
                  currentPath={
                    currentPath
                      ? `${currentPath}/${node.name}`
                      : node.name
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


function List() {
  const [files, setFiles] = useState([]);
  const [folderPath, setFolderPath] = useState('');
  const [isRoot, setIsRoot] = useState(true); // Initialize as true for the root folder
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    options: [],
  });

  useEffect(() => {
    updateFileStructure(); // Call the function to update the file structure
  }, [folderPath]);

  const handleContextMenu = (node, fullPath, event) => {
    if (event) {
      event.preventDefault();
      const options = [
        {
          id: 'option1',
          label: `Delete`,
          action: () => handle_deleteItem(node, fullPath),
        },
        {
          id: 'option2',
          label: 'Option 2',
          action: () => handleOption2(node, fullPath),
        },
        // Add more options as needed
      ];

      // Set the context menu position
      const position = { x: event.clientX, y: event.clientY };

      setContextMenu({ isOpen: true, position, options });
    }
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, options: [] });
  };



const handle_deleteItem = async (node, fullPath) => {
  const parts = fullPath.split('/');
  const relativePath = parts.slice(1).join('/');
  handleCloseContextMenu();

  // Call the deleteItem function with the relativePath
  await deleteItem(relativePath);
  updateFileStructure();
  
};

const updateFileStructure = () => {
  const apiEndpoint = 'http://localhost:3001/v1/dropfile/list';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGZkOGJhYzJkM2RjMjhkMzUwOWZlODEiLCJpYXQiOjE2OTUyMzg2MzcsImV4cCI6MTY5NTI0MDQzNywidHlwZSI6ImFjY2VzcyJ9.890XiqtVlfX3zyEKn6-AFbGoJxGUdW8E9uSV57YrpsU'
    const url = `${apiEndpoint}?folderPath=${encodeURIComponent(folderPath)}`;
    axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((response) => {
      setFiles([response.data.structure]);
      setIsRoot(response.data.isRoot);
    }).catch((error) => {
    console.error(error);
  });
};

  
  const handleOption2 = (node, fullPath) => {
    const parts = fullPath.split('/');
    const relativePath = parts.slice(1).join('/');
    handleCloseContextMenu();
  };
  

  return (
    <div>
      <p>{isRoot ? 'This is the root folder' : 'This is not the root folder'}</p>
      {files.map((fileStructure) => (
        <TreeNode
          key={fileStructure.name}
          node={fileStructure}
          onContextMenu={handleContextMenu}
        />
      ))}
      {contextMenu.isOpen && (
        <ContextMenu
          options={contextMenu.options}
          onClose={handleCloseContextMenu}
          position={contextMenu.position}
        />
      )}
    </div>
  );
}

export default List;

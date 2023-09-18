import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContextMenu from './ContextMenu';
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
    // Define the API endpoint and bearer token
    const apiEndpoint = 'http://localhost:3001/v1/dropfile/list';
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGZkOGJhYzJkM2RjMjhkMzUwOWZlODEiLCJpYXQiOjE2OTUwNjkwMjMsImV4cCI6MTY5NTA3MDgyMywidHlwZSI6ImFjY2VzcyJ9.zsfZgdWzHN7M9AxsX8jcvgx4mmgiL9AY7Wf5IobPw8I'; // Replace with your actual bearer token

    // Build the URL with the folderPath as a query parameter
    const url = `${apiEndpoint}?folderPath=${encodeURIComponent(folderPath)}`;

    // Fetch the list of files and directories from the API with the bearer token
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Assuming the API response has a 'structure' and 'isRoot' property
        setFiles([response.data.structure]);
        setIsRoot(response.data.isRoot);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [folderPath]);

  const handleContextMenu = (node, fullPath, event) => {
    if (event) {
      event.preventDefault();
      const options = [
        {
          id: 'option1',
          label: 'Option 1',
          action: () => handleOption1(node, fullPath),
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

  const handleOption1 = (node, fullPath) => {
    // Handle context menu option 1 for the selected node
    // Access the node and fullPath here
    console.log('Option 1 selected for node:', node);
    console.log('Full path:', fullPath);
    handleCloseContextMenu();
  };

  const handleOption2 = (node, fullPath) => {
    // Handle context menu option 2 for the selected node
    // Access the node and fullPath here
    console.log('Option 2 selected for node:', node);
    console.log('Full path:', fullPath);
    handleCloseContextMenu();
  };

  return (
    <div>
      <p>{isRoot ? 'This is the root folder' : 'This is not the root folder'}</p>
      <input
        type="text"
        placeholder="Enter folder path"
        value={folderPath}
        onChange={(e) => setFolderPath(e.target.value)}
      />
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

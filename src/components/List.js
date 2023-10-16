import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContextMenu from './ContextMenu';
import deleteItem from '../helper/delete_item';
import renameItem from '../helper/rename_item';
import apiConfig from './apiConfig';
import downloadItem from '../helper/download_item';
import RenameContextMenu from './RenameContextMenu';
import { uploadFile } from '../helper/upload_item';

function TreeNode({ node, onContextMenu, currentPath }) {

  const [isOpen, setIsOpen] = useState(false);
  const [isRenameContextMenuOpen, setRenameContextMenuOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState('');

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
          <ul className="pl-4"> {/* Add padding to create spacing */}
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
  const [targetPath, setTargetPath] = useState('');
  const [isRoot, setIsRoot] = useState(true); // Initialize as true for the root folder
  const [rootName, setRootName ] = useState(true);
  const [isRenameContextMenuOpen, setRenameContextMenuOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState('');
  const [newItemName, setNewName] = useState(''); // State for the new name
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    options: [],
  });

  const [renameContextMenu, setRenameContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    options: [],
  })

  useEffect(() => {
    updateFileStructure(); // Call the function to update the file structure
  }, [folderPath]);

  const handleContextMenu = (node, fullPath, event) => {
    if (event) {
      console.log(node);
      event.preventDefault();
      const options = [
        {
          id: 'deleteItem',
          label: `Delete`,
          action: () => handle_deleteItem(node, fullPath),
        },
        {
          id: 'downloadItem',
          label: 'Download',
          action: () => handle_downloadItem(node, fullPath),
        },
        {
          id: 'renameItem',
          label: 'Rename',
          action: () => {
            handleCloseContextMenu();
            setRenameContextMenuOpen(true);
            handle_renameItem(node, fullPath); // Trigger the renaming logic
          },
        },
        {
          id: 'uploadItem',
          label: 'Upload',
          action: () => {
            handleCloseContextMenu();
            handle_uploadItem(node, fullPath); // Trigger the renaming logic
          },
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

const handle_downloadItem = async (node, fullPath) => {
  const parts = fullPath.split('/');
  const relativePath = parts.slice(1).join('/');
  handleCloseContextMenu();
  // Call the deleteItem function with the relativePath
  await downloadItem(relativePath);
};

const handle_renameItem = async (node, fullPath) => {
  // Open the RenameContextMenu by setting the state variables
  const parts = fullPath.split('/');
  const relativePath = parts.slice(1).join('/');
  const elementName = parts.pop(); // Get the last part as elementName
  setTargetPath(relativePath);
  setRenameContextMenuOpen(true);
  setRenameTarget(elementName);
};

function constructRelativePath(fullPath) {
  const parts = fullPath.split('/');
  const relativePath = parts.slice(1).join('/').replace(rootName, '');
  return relativePath;
}



const handle_uploadItem = async (node, fullPath) => {

  const relativePath = constructRelativePath(fullPath);

  // Open a file selection dialog to choose the file to upload
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.onchange = async (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      try {
        await uploadFile(selectedFile, relativePath); // Use the helper function to upload the file
        console.log('File uploaded successfully');
        updateFileStructure();
        // You can update the file structure or take other actions as needed
      } catch (error) {
        console.error('File upload failed:', error);
        // Handle the error, e.g., display an error message
      }
    }
  };

  fileInput.click();
  
};
    
const updateFileStructure = () => {
    const { baseUrl, token } = apiConfig;
    const url = `${baseUrl}/dropfile/list?folderPath=${encodeURIComponent(folderPath)}`;
    axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((response) => {
      setFiles([response.data.structure]);
      setIsRoot(response.data.isRoot);
      setRootName(response.data.structure.name);
    }).catch((error) => {
    console.error(error);
  });
};

  
  const handleOption2 = (node, fullPath) => {
    const parts = fullPath.split('/');
    const relativePath = parts.slice(1).join('/');
    handleCloseContextMenu();
  };
  const handleRename = async (newName) => {
    // Implement your renaming logic here and close the RenameContextMenu
    console.log('New folder name:', newName);
    console.log('folder path', targetPath);
    setRenameContextMenuOpen(false);
    await renameItem(newName, targetPath );
    updateFileStructure();
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
      {isRenameContextMenuOpen && (
        <RenameContextMenu
          folderName={renameTarget}
          onCancel={() => setRenameContextMenuOpen(false)}
          onSave={handleRename} // Handle the renaming logic in this function
        />
      )}
    </div>
  );
}

export default List;

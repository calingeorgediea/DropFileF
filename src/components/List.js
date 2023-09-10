// src/components/List.js
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGZkOGJhYzJkM2RjMjhkMzUwOWZlODEiLCJpYXQiOjE2OTQzNTE0NjgsImV4cCI6MTY5NDM1MzI2OCwidHlwZSI6ImFjY2VzcyJ9.0Eahm44L8oNmemBcTgzhK7KfQNgipGHTMuyfwI7Fdlo';
      

import React, { useState, useEffect } from 'react';
import axios from 'axios';
    function List() {
      const [files, setFiles] = useState([]);
      const [folderPath, setFolderPath] = useState('');
    
      useEffect(() => {
        // Define the API endpoint and bearer token
        const apiEndpoint = 'http://localhost:3001/v1/dropfile/list';
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGZkOGJhYzJkM2RjMjhkMzUwOWZlODEiLCJpYXQiOjE2OTQzNTMzMTMsImV4cCI6MTY5NDM1NTExMywidHlwZSI6ImFjY2VzcyJ9.glU3c4RxoB6d9ptcVP_niSfcWLHLcKMtEhDkNddoKyI';
    
        // Build the URL with the folderPath as a query parameter
        const url = `${apiEndpoint}?folderPath=${encodeURIComponent(folderPath)}`;
    
        // Fetch the list of files and directories from the API with the bearer token
        axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            // Assuming the API response has a 'content' array
            setFiles(response.data.content);
          })
          .catch((error) => {
            console.error(error);
          });
      }, [folderPath]);
    
      // Function to handle clicking on a directory item
      const handleDirectoryClick = (event, directoryName) => {
        event.preventDefault();
        
        // Update the folderPath state to navigate into the clicked directory
        const newPath = folderPath ? `${folderPath}/${directoryName}` : directoryName;
        setFolderPath(newPath);
      };
    
      // Function to handle clicking the "Go Back" button
      const handleGoBack = () => {
        // Split the folderPath into segments
        const pathSegments = folderPath.split('/');
        
        // Remove the last segment to go back one level
        pathSegments.pop();
        
        // Join the remaining segments to form the new folderPath
        const newPath = pathSegments.join('/');
        
        // Update the folderPath state
        setFolderPath(newPath);
      };
    
      return (
        <div>
          <h1>File List</h1>
          <p>
            Current Folder: {folderPath || 'Root'}
            {folderPath && (
              <button onClick={handleGoBack}>Go Back</button>
            )}
          </p>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file.endsWith('/') ? (
                  // Render directory as a clickable link
                  <a href="#" onClick={(event) => handleDirectoryClick(event, file)}>{file}</a>
                ) : (
                  // Render file
                  <a href="#" onClick={(event) => handleDirectoryClick(event, file)}>{file}</a>
                )}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    
    export default List;
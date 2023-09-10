function List() {
    // ... (previous code)
  
    const handleDelete = (fileName) => {
      // Send a delete request to your API
      axios.delete(`/api/delete?fileName=${fileName}`)
        .then(() => {
          // Update the local files state to reflect the deleted item
          setFiles(files.filter((file) => file !== fileName));
        })
        .catch((error) => {
          console.error(error);
        });
    };
  
    // ... (rendering code)
  }
  
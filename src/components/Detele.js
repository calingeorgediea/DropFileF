function List() {
    // ... (previous code)
  
    const handleDelete = (fileName) => {
      // Send a delete request to your API
      axios.delete(`/api/delete?target=${fileTarget}`)
        .then(() => {
          // Update the local files state to reflect the deleted item
          setFiles(files.filter((file) => file !== fileName));
        })
        .catch((error) => {
          console.error(error);
        });
    };
    setFiles([response.data.structure]);
    // ... (rendering code)
  }
  
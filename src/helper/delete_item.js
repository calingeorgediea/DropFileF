const deleteItem = async (relativePath) => {
    try {
      // Make a DELETE request to delete the target item
      const response = await fetch(`http://localhost:3001/v1/dropfile/delete?target=${(relativePath)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGZkOGJhYzJkM2RjMjhkMzUwOWZlODEiLCJpYXQiOjE2OTUyMzg2MzcsImV4cCI6MTY5NTI0MDQzNywidHlwZSI6ImFjY2VzcyJ9.890XiqtVlfX3zyEKn6-AFbGoJxGUdW8E9uSV57YrpsU',
          // Add any other headers you may need, such as authentication headers
        },
      });
  
      if (response.ok) {
        console.log('Item deleted successfully');
        
        // You can perform any additional actions here after successful deletion
      } else {
        console.error('Failed to delete item');
        // Handle the error case here
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle network or other errors here
    }
  };


  export default deleteItem;
const renameItem = async (newName, targetPath ) => {
    try {
        const targetPathArray = targetPath.split('/');
        let updatedPath;
        if (targetPath.includes('/')) {
          const targetPathArray = targetPath.split('/');
          targetPathArray.pop(); // Remove the last element from the array
          updatedPath = targetPathArray.join('/') + '/' + newName;
        } else {
          updatedPath = newName;
        }
        const response = await fetch(`http://localhost:3001/v1/dropfile/rename?target=${encodeURIComponent(targetPath)}&to=${updatedPath}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGZkOGJhYzJkM2RjMjhkMzUwOWZlODEiLCJpYXQiOjE2OTY5NjI1MDMsImV4cCI6MTY5ODc2MjUwMywidHlwZSI6ImFjY2VzcyJ9.mOjEBlgM1qTu3Ff9mu8BnNckYmU-GY6qUA5S6ArhGmI',
        },
        });
    
    
        if (response.ok) {
            // Get the Content-Disposition header from the response
            console.log('Item renamed successfully');
          } else {
            console.error('Failed to rename item');
            // Handle the error case here
          }
        } catch (error) {
          console.error('Error:', error);
          // Handle network or other errors here
        }
      };
      
      export default renameItem;
    
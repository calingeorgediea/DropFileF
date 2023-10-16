const downloadItem = async (relativePath) => {
try {
    const response = await fetch(`http://localhost:3001/v1/dropfile/download?target=${encodeURIComponent(relativePath)}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGZkOGJhYzJkM2RjMjhkMzUwOWZlODEiLCJpYXQiOjE2OTY5NjI1MDMsImV4cCI6MTY5ODc2MjUwMywidHlwZSI6ImFjY2VzcyJ9.mOjEBlgM1qTu3Ff9mu8BnNckYmU-GY6qUA5S6ArhGmI',
    },
    });


    if (response.ok) {
        // Get the Content-Disposition header from the response
        const contentDisposition = response.headers.get('Content-Disposition');
  
        // Extract the filename from the header, if available
        let filename = 'downloaded_file'; // Default filename if Content-Disposition is not present
        if (contentDisposition) {
          const match = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
          if (match && match[1]) {
            filename = match[1].replace(/['"]/g, '');
          }
        }
  
        // Convert the response to a blob
        const blob = await response.blob();
  
        // Create a download link for the blob
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename; // Use the extracted filename
        document.body.appendChild(a);
        a.click();
  
        // Clean up the URL object
        window.URL.revokeObjectURL(url);
  
        console.log('Item downloaded successfully');
      } else {
        console.error('Failed to download item');
        // Handle the error case here
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle network or other errors here
    }
  };
  
  export default downloadItem;

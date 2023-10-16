import axios from 'axios';
export const uploadFile = async (file, relativePath) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // Construct the upload URL with the target folder
    const uploadUrl = `http://localhost:3001/v1/dropfile/upload?target=${encodeURIComponent(relativePath)}`;

    const response = await axios.post(uploadUrl, formData, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGZkOGJhYzJkM2RjMjhkMzUwOWZlODEiLCJpYXQiOjE2OTY5NjI1MDMsImV4cCI6MTY5ODc2MjUwMywidHlwZSI6ImFjY2VzcyJ9.mOjEBlgM1qTu3Ff9mu8BnNckYmU-GY6qUA5S6ArhGmI`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error; // You can handle errors in your component
  }
};

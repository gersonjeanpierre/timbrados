import axios from 'axios';

export const getLines = async (fecha) => {

  const data = await axios.get(`http://localhost:3000/line/${fecha}`);
  return data.data;
}

export const uploadCsv = async (selectedFile) => {
  try {
    const formData = new FormData();
    formData.append('file', selectedFile);

    const response = await axios.post('http://localhost:3000/uploadcsv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading CSV:', error);
  }
};
// src/services/csvService.ts
import axios from 'axios';

// const BASE_URL = process.env.REACT_APP_BASE_URL;
const BASE_URL = 'http://localhost:8080';

export const generateCsv = async (type: 'candidates' | 'vacancies', token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/export/${type}/csv`, {
      responseType: 'blob', // Handle as a file (blob)
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    // Create a URL for the file and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${type}.csv`); // Set filename
    document.body.appendChild(link);
    link.click();
    link.remove();

    return true; // Indicate success
  } catch (error) {
    return false; // Indicate failure
  }
};

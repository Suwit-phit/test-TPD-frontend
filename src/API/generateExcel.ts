import axios from 'axios';

const BASE_URL = 'http://localhost:8080'; // Replace with your actual backend URL

// API to generate Excel for Candidates
export const generateCandidateExcel = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/excel/candidates`, {
            responseType: 'blob', // Important to handle file downloads
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to generate Candidate Excel');
    }
};

// API to generate Excel for Vacancies
export const generateVacancyExcel = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/excel/vacancies`, {
            responseType: 'blob', // Important to handle file downloads
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to generate Vacancy Excel');
    }
};

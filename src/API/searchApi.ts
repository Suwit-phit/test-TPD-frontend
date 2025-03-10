import axios from 'axios';
import { toast } from 'react-hot-toast'; // Updated import

// Define type for the response data
export interface Vacancy {
    id: string; // UUID as string
    positionTitle: string; // Updated from title to positionTitle
    positionApplied: string; // Corresponds to position_applied from backend
    skills: string;
}

export interface Candidate {
    id: string;
    candidateName: string;
    position: string;
    skills: string;
}

// const API_URL = 'http://localhost:8080/vacancies/search?query=';
// const CANDIDATES_API_URL = 'http://localhost:8080/api/candidates/search?query=';
// const API_URL = 'https://test-tpd-sb.onrender.com/vacancies/search?query=';
// const CANDIDATES_API_URL = 'https://test-tpd-sb.onrender.com/api/candidates/search?query=';
const SB_BASE_URL = import.meta.env.VITE_TPD_SB_APP_API_URL;
const API_URL = `${SB_BASE_URL}/vacancies/search?query=`;
const CANDIDATES_API_URL = `${SB_BASE_URL}/api/candidates/search?query=`;

const handleError = (error: unknown, defaultMessage: string) => {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || defaultMessage;
        toast.error(message); // `react-hot-toast` still uses `toast.error`
    } else {
        toast.error(defaultMessage); // Display the default message if error is not AxiosError
    }
    throw error;
};

export const searchVacancies = async (query: string, token: string): Promise<Vacancy[]> => {
    try {
        const response = await axios.get<Vacancy[]>(`${API_URL}${query}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        handleError(error, 'Error fetching search results');
        throw new Error('Error fetching search results');
    }
};

export const searchCandidates = async (query: string, token: string): Promise<Candidate[]> => {
    try {
        const response = await axios.get<Candidate[]>(`${CANDIDATES_API_URL}${query}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        handleError(error, `Error searching "${query}" candidate.`);
        throw new Error('Error fetching search results');
    }
};


//! Good
// import axios from 'axios';
// import { toast } from 'react-hot-toast'; // Updated import

// // Define type for the response data
// export interface Vacancy {
//     id: string; // UUID as string
//     positionTitle: string; // Updated from title to positionTitle
//     positionApplied: string; // Corresponds to position_applied from backend
//     skills: string;
// }

// export interface Candidate {
//     id: string;
//     candidateName: string;
//     position: string;
//     skills: string;
// }

// const API_URL = 'http://localhost:8080/vacancies/search?query=';
// const CANDIDATES_API_URL = 'http://localhost:8080/api/candidates/search?query=';

// const handleError = (error: unknown, defaultMessage: string) => {
//     if (axios.isAxiosError(error)) {
//         const message = error.response?.data?.error || defaultMessage;
//         toast.error(message); // `react-hot-toast` still uses `toast.error`
//     } else {
//         toast.error(defaultMessage); // Display the default message if error is not AxiosError
//     }
//     throw error;
// };

// export const searchVacancies = async (query: string): Promise<Vacancy[]> => {
//     try {
//         const response = await axios.get<Vacancy[]>(`${API_URL}${query}`);
//         return response.data;
//     } catch (error) {
//         handleError(error, 'Error fetching search results');
//         throw new Error('Error fetching search results');
//     }
// };

// export const searchCandidates = async (query: string): Promise<Candidate[]> => {
//     try {
//         const response = await axios.get<Candidate[]>(`${CANDIDATES_API_URL}${query}`);
//         return response.data;
//     } catch (error) {
//         handleError(error, `Error searching "${query}" candidate.`);
//         throw new Error('Error fetching search results');
//     }
// };


//! Good
// import axios from 'axios';
// import { toast } from 'react-hot-toast'; // Updated import

// // Define type for the response data
// export interface Vacancy {
//     id: string; // UUID as string
//     positionTitle: string; // Updated from title to positionTitle
//     positionApplied: string; // Corresponds to position_applied from backend
//     skills: string;
// }

// export interface Candidate {
//     id: string;
//     candidateName: string;
//     position: string;
//     skills: string;
// }

// const API_URL = 'http://localhost:8080/vacancies/search?query=';
// const CANDIDATES_API_URL = 'http://localhost:8080/api/candidates/search?query=';

// // Retrieve the token (replace this with your actual token retrieval logic)
// const getToken = () => {
//     // For example, from localStorage
//     // return localStorage.getItem('authToken') || ''; 
//     return localStorage.getItem('token') || ''; 
// };

// const handleError = (error: unknown, defaultMessage: string) => {
//     if (axios.isAxiosError(error)) {
//         const message = error.response?.data?.error || defaultMessage;
//         toast.error(message); // `react-hot-toast` still uses `toast.error`
//     } else {
//         toast.error(defaultMessage); // Display the default message if error is not AxiosError
//     }
//     throw error;
// };

// // Set up Axios instance with default headers
// const apiClient = axios.create({
//     headers: {
//         Authorization: `Bearer ${getToken()}`, // Include the token in the Authorization header
//     },
// });

// export const searchVacancies = async (query: string): Promise<Vacancy[]> => {
//     try {
//         const response = await apiClient.get<Vacancy[]>(`${API_URL}${query}`);
//         return response.data;
//     } catch (error) {
//         handleError(error, 'Error fetching search results');
//         throw new Error('Error fetching search results');
//     }
// };

// export const searchCandidates = async (query: string): Promise<Candidate[]> => {
//     try {
//         const response = await apiClient.get<Candidate[]>(`${CANDIDATES_API_URL}${query}`);
//         return response.data;
//     } catch (error) {
//         handleError(error, `Error searching "${query}" candidate.`);
//         throw new Error('Error fetching search results');
//     }
// };





//! Below code is with toast UI
// import axios from 'axios';
// // import { toast } from 'react-hot-toast';
// import { toast } from 'react-toastify';

// // Define type for the response data
// export interface Vacancy {
//     id: string; // UUID as string
//     positionTitle: string; // Updated from title to positionTitle
//     positionApplied: string; // Corresponds to position_applied from backend
//     skills: string;
//     // id: string;
//     // title: string;
//     // position: string;
//     // skills: string;
// }

// export interface Candidate {
//     id: string;
//     candidateName: string;
//     position: string;
//     skills: string;
// }
// // export interface Candidate {
// //     id: string;
// //     name: string;
// //     position: string;
// //     skills: string;
// // }

// const API_URL = 'http://localhost:8080/vacancies/search?query=';
// const CANDIDATES_API_URL = 'http://localhost:8080/api/candidates/search?query=';

// const handleError = (error: unknown, defaultMessage: string) => {
//     if (axios.isAxiosError(error)) {
//         const message = error.response?.data?.error || defaultMessage; // Access the error message from the backend
//         toast.error(message); // Display the error message from the backend
//     } else {
//         toast.error(defaultMessage); // Display the default message if error is not AxiosError
//     }
//     throw error; // Re-throw the error so it can be handled elsewhere if needed
// };


// export const searchVacancies = async (query: string): Promise<Vacancy[]> => {
//     try {
//         // const response = await axios.get<Vacancy[]>(`http://localhost:8080/vacancies/search?query=${query}`);
//         const response = await axios.get<Vacancy[]>(`${API_URL}${query}`);
        
//         return response.data;
//     } catch (error) {
//         throw new Error('Error fetching search results');
//     }
// };

// export const searchCandidates = async (query: string): Promise<Candidate[]> => {
//     try {
//         const response = await axios.get<Candidate[]>(`${CANDIDATES_API_URL}${query}`);
//         return response.data;
//     } catch (error) {
//         handleError(error, `Error searching "${query}" candidate.`); // Use the handleError function to manage errors
//         throw new Error('Error fetching search results'); // This is for the caller in case they need to handle it
//     }
// };

//! End
// export const searchCandidates = async (query: string): Promise<Candidate[]> => {
//     try {
//         // const response = await axios.get<Vacancy[]>(`http://localhost:8080/vacancies/search?query=${query}`);
//         const response = await axios.get<Candidate[]>(`${CANDIDATES_API_URL}${query}`);
//         // console.log("searchCandidates response = ", response.data);
//         // toast.success(`Found ${response.data.length} candidates.`);
//         return response.data;
//     } catch (error) {
//         // handleError(error);
//         // handleError(error, `Error search "${query}" candidate.`);
//         throw new Error('Error fetching search results');
//     }
// };
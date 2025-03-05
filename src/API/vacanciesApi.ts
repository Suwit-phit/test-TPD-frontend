import axios from 'axios';

// VacancyType interface with updated fields to match the backend
export interface VacancyType {
    id: string; // UUID as string
    positionTitle: string; // Updated from title to positionTitle
    positionApplied: string; // Corresponds to position_applied from backend
    skills: string;
    salary: number;
    currencyCode: string;
    dateOfApplication?: string; // Optional, corresponds to date_of_application from backend
    createdAt?: string; // Optional, managed by the backend
    updatedAt?: string; // Optional, managed by the backend
}

// CandidateType interface to match backend data
interface CandidateType {
    id: number;
    candidateName: string; // Updated from name to candidateName
    position: string;
    skills: string;
}

export interface MatchingCandidate {
    candidate: CandidateType;
    matchPercentage: number;
}

const API_URL = 'http://localhost:8080';

// Fetch all vacancies
export const fetchVacancy = async (token: string) => {
    try {
        const response = await axios.get<VacancyType[]>(`${API_URL}/vacancies`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching vacancies:', error);
        throw error;
    }
};

// Fetch vacancy by UUID
export const fetchVacancyById = async (id: string, token: string) => {
    try {
        const response = await axios.get<VacancyType>(`${API_URL}/vacancies/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching vacancy by ID:', error);
        throw error;
    }
};

// Fetch matching candidates for a vacancy
// export const fetchMatchingCandidates = async (vacancy: VacancyType, token: string) => {
//     try {
//         const response = await axios.post<MatchingCandidate[]>(`${API_URL}/matching-candidates`, vacancy, {
//             headers: { Authorization: `Bearer ${token}` },
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching matching candidates:', error);
//         throw error;
//     }
// };
export const fetchMatchingCandidates = async (vacancy: VacancyType) => {
    try {
        const response = await axios.post<MatchingCandidate[]>(`${API_URL}/matching-candidates`, vacancy);
        return response.data;
    } catch (error) {
        console.error('Error fetching matching candidates:', error);
        throw error;
    }
};


// Add a new vacancy
export const addVacancy = async (vacancy: VacancyType, token: string): Promise<VacancyType> => {
    try {
        const response = await axios.post<VacancyType>(`${API_URL}/vacancies`, vacancy, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(error.response.data?.error || 'An error occurred while adding the vacancy');
            } else {
                throw new Error('Network or server error');
            }
        }
        throw new Error('Unexpected error');
    }
};

// Update an existing vacancy
export const updateVacancy = async (id: string, vacancy: VacancyType, token: string) => {
    try {
        const response = await axios.put<VacancyType>(`${API_URL}/vacancies/${id}`, vacancy, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating vacancy:', error);
        throw error;
    }
};

// Delete a vacancy
export const deleteVacancy = async (id: string, token: string) => {
    try {
        const response = await axios.delete<void>(`${API_URL}/vacancies/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting vacancy:', error);
        throw error;
    }
};

export default {
    fetchVacancy,
    fetchVacancyById,
    fetchMatchingCandidates,
    addVacancy,
    updateVacancy,
    deleteVacancy,
};


//! Good
// import axios from 'axios';

// // VacancyType interface with updated fields to match the backend
// export interface VacancyType {
//     id: string; // UUID as string
//     positionTitle: string; // Updated from title to positionTitle
//     positionApplied: string; // Corresponds to position_applied from backend
//     skills: string;
//     salary: number;
//     currencyCode: string;
//     // dateOfApplication: string; // Optional, corresponds to date_of_application from backend
//     dateOfApplication?: string; // Optional, corresponds to date_of_application from backend
//     createdAt?: string; // Optional, managed by the backend
//     updatedAt?: string; // Optional, managed by the backend
// }

// // CandidateType interface to match backend data
// interface CandidateType {
//     id: number;
//     candidateName: string; // Updated from name to candidateName
//     position: string;
//     skills: string;
// }

// export interface MatchingCandidate {
//     candidate: CandidateType;
//     matchPercentage: number;
// }

// const API_URL = 'http://localhost:8080';

// // Fetch all vacancies
// export const fetchVacancy = async () => {
//     try {
//         const response = await axios.get<VacancyType[]>(`${API_URL}/vacancies`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching vacancies:', error);
//         throw error;
//     }
// };

// // Fetch vacancy by UUID
// export const fetchVacancyById = async (id: string) => {
//     try {
//         const response = await axios.get<VacancyType>(`${API_URL}/vacancies/${id}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching vacancy by ID:', error);
//         throw error;
//     }
// };

// // Fetch matching candidates for a vacancy
// export const fetchMatchingCandidates = async (vacancy: VacancyType) => {
//     try {
//         const response = await axios.post<MatchingCandidate[]>(`${API_URL}/matching-candidates`, vacancy);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching matching candidates:', error);
//         throw error;
//     }
// };

// // Add a new vacancy
// export const addVacancy = async (vacancy: VacancyType): Promise<VacancyType> => {
//     try {
//         const response = await axios.post<VacancyType>(`${API_URL}/vacancies`, vacancy);
//         return response.data;
//     } catch (error) {
//         if (axios.isAxiosError(error)) {
//             if (error.response) {
//                 throw new Error(error.response.data?.error || 'An error occurred while adding the vacancy');
//             } else {
//                 throw new Error('Network or server error');
//             }
//         }
//         throw new Error('Unexpected error');
//     }
// };

// // Update an existing vacancy
// export const updateVacancy = async (id: string, vacancy: VacancyType) => {
//     try {
//         const response = await axios.put<VacancyType>(`${API_URL}/vacancies/${id}`, vacancy);
//         return response.data;
//     } catch (error) {
//         console.error('Error updating vacancy:', error);
//         throw error;
//     }
// };

// // Delete a vacancy
// export const deleteVacancy = async (id: string) => {
//     try {
//         const response = await axios.delete<void>(`${API_URL}/vacancies/${id}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error deleting vacancy:', error);
//         throw error;
//     }
// };

// export default {
//     fetchVacancy,
//     fetchVacancyById,
//     fetchMatchingCandidates,
//     addVacancy,
//     updateVacancy,
//     deleteVacancy,
// };


//! Below code isn't accept every data that come from the backend
// import axios from 'axios';
// // import axios, { AxiosError } from 'axios';

// interface VacancyType {
//     id: string; // UUID as string
//     title: string;
//     position: string;
//     skills: string;
//     salary: number;
//     currencyCode: string;
//     createdAt?: string; // Optional, managed by the backend
//     updatedAt?: string; // Optional, managed by the backend
// }

// interface CandidateType {
//     id: number;
//     name: string;
//     position: string;
//     skills: string;
// }

// interface MatchingCandidate {
//     candidate: CandidateType;
//     matchPercentage: number;
// }

// const API_URL = 'http://localhost:8080';

// export const fetchVacancy = async () => {
//     try {
//         const response = await axios.get<VacancyType[]>(`${API_URL}/vacancies`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching vacancies:', error);
//         throw error;
//     }
// };

// export const fetchVacancyById = async (id: number) => {
//     try {
//         const response = await axios.get(`${API_URL}/vacancies/${id}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching employee by ID:', error);
//         throw error;
//     }
// };

// export const fetchMatchingCandidates = async (vacancy: VacancyType) => {
//     try {
//         const response = await axios.post<MatchingCandidate[]>(`${API_URL}/matching-candidates`, vacancy);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching matching candidates:', error);
//         throw error;
//     }
// };

// export const addVacancy = async (vacancy: VacancyType): Promise<VacancyType> => {
//     try {
//         const response = await axios.post<VacancyType>(`${API_URL}/vacancies`, vacancy);
//         return response.data;
//     } catch (error) {
//         // Ensure type safety and proper handling
//         if (axios.isAxiosError(error)) {
//             if (error.response) {
//                 // If the backend responds with an error
//                 throw new Error(error.response.data?.error || 'An error occurred while adding the vacancy');
//             } else {
//                 throw new Error('Network or server error');
//             }
//         }
//         throw new Error('Unexpected error');
//     }
// };

// export const updateVacancy = async (id: number, vacancy: VacancyType) => {
//     try {
//         const response = await axios.put<VacancyType>(`${API_URL}/vacancies/${id}`, vacancy);
//         return response.data;
//     } catch (error) {
//         console.error('Error updating vacancy:', error);
//         throw error;
//     }
// };

// export const deleteVacancy = async (id: number) => {
//     try {
//         const response = await axios.delete<void>(`${API_URL}/vacancies/${id}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error deleting vacancy:', error);
//         throw error;
//     }
// };

// export default {
//     fetchVacancy,
//     fetchMatchingCandidates,
//     addVacancy,
//     updateVacancy,
//     deleteVacancy,
// };

//! Below code is the same with the upper one but with comments
// import axios from 'axios';
// // import axios, { AxiosError } from 'axios';

// interface VacancyType {
//     id: string; // UUID as string
//     title: string;
//     position: string;
//     skills: string;
//     salary: number;
//     currencyCode: string;
//     createdAt?: string; // Optional, managed by the backend
//     updatedAt?: string; // Optional, managed by the backend
// }

// // interface VacancyType {
// //     id: number;
// //     title: string;
// //     position: string;
// //     skills: string;
// // }

// interface CandidateType {
//     id: number;
//     name: string;
//     position: string;
//     skills: string;
// }

// interface MatchingCandidate {
//     candidate: CandidateType;
//     matchPercentage: number;
// }

// const API_URL = 'http://localhost:8080';

// export const fetchVacancy = async () => {
//     try {
//         const response = await axios.get<VacancyType[]>(`${API_URL}/vacancies`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching vacancies:', error);
//         throw error;
//     }
// };

// export const fetchVacancyById = async (id: number) => {
//     try {
//         const response = await axios.get(`${API_URL}/vacancies/${id}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching employee by ID:', error);
//         throw error;
//     }
// };

// export const fetchMatchingCandidates = async (vacancy: VacancyType) => {
//     try {
//         const response = await axios.post<MatchingCandidate[]>(`${API_URL}/matching-candidates`, vacancy);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching matching candidates:', error);
//         throw error;
//     }
// };

// // import axios from 'axios';

// // interface VacancyType {
// //     id: string; // UUID as string
// //     title: string;
// //     position: string;
// //     skills: string;
// //     salary: number;
// //     currencyCode: string;
// //     createdAt?: string; // Optional, managed by the backend
// //     updatedAt?: string; // Optional, managed by the backend
// // }

// // const API_URL = 'your-backend-url-here'; // Replace with actual backend URL

// export const addVacancy = async (vacancy: VacancyType): Promise<VacancyType> => {
//     try {
//         const response = await axios.post<VacancyType>(`${API_URL}/vacancies`, vacancy);
//         return response.data;
//     } catch (error) {
//         // Ensure type safety and proper handling
//         if (axios.isAxiosError(error)) {
//             if (error.response) {
//                 // If the backend responds with an error
//                 throw new Error(error.response.data?.error || 'An error occurred while adding the vacancy');
//             } else {
//                 throw new Error('Network or server error');
//             }
//         }
//         throw new Error('Unexpected error');
//     }
// };


// // export const addVacancy = async (vacancy: VacancyType) => {
// //     try {
// //         const response = await axios.post<VacancyType>(`${API_URL}/vacancies`, vacancy);
// //         return response.data;
// //     } catch (error) {
// //         console.error('Error adding vacancy:', error);
// //         throw error;
// //     }
// // };

// export const updateVacancy = async (id: number, vacancy: VacancyType) => {
//     try {
//         const response = await axios.put<VacancyType>(`${API_URL}/vacancies/${id}`, vacancy);
//         return response.data;
//     } catch (error) {
//         console.error('Error updating vacancy:', error);
//         throw error;
//     }
// };

// export const deleteVacancy = async (id: number) => {
//     try {
//         const response = await axios.delete<void>(`${API_URL}/vacancies/${id}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error deleting vacancy:', error);
//         throw error;
//     }
// };

// export default {
//     fetchVacancy,
//     fetchMatchingCandidates,
//     addVacancy,
//     updateVacancy,
//     deleteVacancy,
// };


//! End
// import axios from "axios";

// interface VacancyType {
//     id: number;
//     title: string;
//     position: string;
//     skills: string;
// }

// const API_URL = 'http://localhost:8080';

// export const fetchVacancy = async () => {
//     try {
//         const response = await axios.get(`${API_URL}/vacancies`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching vacancies:', error);
//         throw error;
//     }
// };

// export const fetchVacancyById = async (id: number) => {
//     try {
//         const response = await axios.get(`${API_URL}/vacancies/${id}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching employee by ID:', error);
//         throw error;
//     }
// };

// export const addVacancy = async (vacancy: VacancyType) => {
//     try {
//         const response = await axios.post(`${API_URL}/vacancies`, vacancy);
//         return response.data;
//     } catch (error) {
//         console.error('Error adding employee:', error);
//         throw error;
//     }
// };

// export const updateVacancy = async (id: number, vacancy: VacancyType) => {
//     try {
//         const response = await axios.put(`${API_URL}/vacancies/${id}`, vacancy);
//         return response.data;
//     } catch (error) {
//         console.error('Error updating employee:', error);
//         throw error;
//     }
// };

// export const deleteVacancy = async (id: number) => {
//     try {
//         const response = await axios.delete(`${API_URL}/vacancies/${id}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error deleting employee:', error);
//         throw error;
//     }
// };
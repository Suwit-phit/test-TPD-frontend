// src/services/api.ts
import axios from 'axios';
// import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

// Define supporting interfaces
export interface Image {
    fileName: string;
    url: string;
}

export interface Attachment {
    fileName: string;
    url: string;
}

export interface ContactType {
    type: string;
    url: string;
}

export interface CandidateType {
    id: string;
    courtesyTitle: string;
    candidateName: string; // Changed from 'username' to 'candidateName'
    dateOfBirth: string;
    position: string;
    salary: number;
    employmentType: string;
    industry: string;
    educationLevels: string[];
    skills: string[];
    phoneNumber: string;
    email: string;
    contactTypes: ContactType[];
    attachments: Attachment[];
    images: Image[];
    imageUrl?: string;
}

// Base API URL
// const API_URL = 'http://localhost:8080/api/candidates';
// const API_URL = 'https://test-tpd-sb.onrender.com/api/candidates';
const SB_BASE_URL = import.meta.env.VITE_TPD_SB_APP_API_URL;
const API_URL = `${SB_BASE_URL}/api/candidates`;

/**
 * Helper function to handle errors and display toast notifications
 */
const handleError = (error: unknown, defaultMessage: string) => {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || defaultMessage;
        toast.error(message);
    } else {
        toast.error(defaultMessage);
    }
    throw error;
};

// Fetch all candidates
export const fetchCandidates = async (token: string): Promise<CandidateType[] | undefined> => {
    try {
        const response = await axios.get<CandidateType[]>(API_URL, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        handleError(error, 'Error fetching candidates.');
        return undefined;
    }
};

// Fetch a candidate by ID
// export const fetchCandidateById = async (id: string): Promise<CandidateType | undefined> => {
//     try {
//         console.log("id in fetchCandidateById = ", id)
//         const response = await axios.get<CandidateType>(`${API_URL}/${id}`);
//         return response.data;
//     } catch (error) {
//         handleError(error, 'Error fetching candidate by ID.');
//         return undefined;
//     }
// };
export const fetchCandidateById = async (token: string, id: string): Promise<CandidateType | undefined> => {
    try {
        const response = await axios.get<CandidateType>(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        handleError(error, 'Error fetching candidate by ID.');
        return undefined;
    }
};

export const createCandidate = async (token: string, candidate: CandidateType): Promise<CandidateType | undefined> => {
    try {
        const response = await axios.post<CandidateType>(API_URL, candidate, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // toast.success('Candidate added successfully.');
        return response.data;
    } catch (error) {
        handleError(error, 'Error adding candidate.');
        return undefined;
    }
};

// Update candidate information
export const updateCandidate = async (token: string, id: string, candidate: CandidateType): Promise<CandidateType | undefined> => {
    try {
        const response = await axios.put<CandidateType>(`${API_URL}/${id}`, candidate, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        toast.success('Candidate updated successfully.');
        return response.data;
    } catch (error) {
        handleError(error, 'Error updating candidate.');
        return undefined;
    }
};

// Delete a candidate
export const deleteCandidate = async (token: string, id: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        toast.success('Candidate deleted successfully.');
    } catch (error) {
        handleError(error, 'Error deleting candidate.');
    }
};

/** //* without token
// Add a new candidate
// export const addCandidate = async (candidate: CandidateType): Promise<CandidateType | undefined> => {
export const createCandidate = async (candidate: CandidateType): Promise<CandidateType | undefined> => {
    try {
        const response = await axios.post<CandidateType>(API_URL, candidate);
        // toast.success('Candidate added successfully.');
        return response.data;
    } catch (error) {
        handleError(error, 'Error adding candidate.');
        return undefined;
    }
};

// Update candidate information
export const updateCandidate = async (id: string, candidate: CandidateType): Promise<CandidateType | undefined> => {
    try {
        const response = await axios.put<CandidateType>(`${API_URL}/${id}`, candidate);
        toast.success('Candidate updated successfully.');
        return response.data;
    } catch (error) {
        handleError(error, 'Error updating candidate.');
        return undefined;
    }
};

// Delete a candidate
export const deleteCandidate = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success('Candidate deleted successfully.');
    } catch (error) {
        handleError(error, 'Error deleting candidate.');
    }
};
*/

// Get Image URL
// export const getImageUrl = (candidateId: string, fileName: string): string => {
//     return `${API_URL}/${candidateId}/images/${fileName}`;
// };
// export const getImageUrl = async (token: string, candidateId: string, fileName: string): Promise<string> => {
//     // return `${API_URL}/${candidateId}/images/${fileName}`;
//     const response = await axios.get(`${API_URL}/${candidateId}/images/${fileName}`, {
//         headers: { Authorization: `Bearer ${token}` },
//     });
//     toast.success('Fetch Image successfully.');
//     return response.data;
// };
// Get Image URL with token
// export const getImageUrl = async (token: string, candidateId: string, fileName: string): Promise<string | undefined> => {
//     try {
//         const response = await axios.get(`${API_URL}/${candidateId}/images/${fileName}`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'image/png',
//             },
//             responseType: 'blob', // Ensure response is in blob format for binary data like images
//         });

//         // Create a URL for the image blob data
//         const imageUrl = window.URL.createObjectURL(new Blob([response.data]));
//         return imageUrl;
//     } catch (error) {
//         handleError(error, 'Error fetching image URL.');
//         return undefined;
//     }
// };

// import { Buffer } from 'buffer';

// export const getImageUrl = async (token: string, candidateId: string, fileName: string): Promise<string | undefined> => {
//     try {
//         const response = await axios.get(`${API_URL}/${candidateId}/images/${fileName}`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'image/png',
//             },
//             responseType: 'arraybuffer',
//         });

//         const base64Image = `data:image/png;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
//         return base64Image;
//     } catch (error) {
//         console.error('Error fetching image URL:', error);
//         return undefined;
//     }
// };

// import { Buffer } from 'buffer';

export const getImageUrl = async (token: string, candidateId: string, fileName: string): Promise<string | undefined> => {
    try {
        const response = await axios.get(`${API_URL}/${candidateId}/images/${fileName}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'image/png',
            },
            responseType: 'arraybuffer',
        });

        // Convert ArrayBuffer to Base64
        const binary = new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '');
        const base64Image = `data:image/png;base64,${btoa(binary)}`;
        return base64Image;
    } catch (error) {
        console.error('Error fetching image URL:', error);
        return undefined;
    }
};


// import { Buffer } from 'buffer';

// export const getImageUrl = async (token: string, candidateId: string, fileName: string): Promise<string | undefined> => {
//     try {
//         const response = await axios.get(`${API_URL}/${candidateId}/images/${fileName}`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'image/png',
//             },
//             responseType: 'arraybuffer',
//         });

//         // Convert binary data to Base64 string
//         const base64Image = `data:image/png;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
//         return base64Image;
//     } catch (error) {
//         console.error('Error fetching image URL:', error);
//         return undefined;
//     }
// };

export const uploadFile = async (token: string, id: string, file: File): Promise<Attachment | undefined> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post<Attachment>(`${API_URL}/${id}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });
        toast.success('Attachment uploaded successfully.');
        return response.data;
    } catch (error) {
        handleError(error, 'Error uploading attachment.');
        return undefined;
    }
};

export const uploadImage = async (token: string, id: string, imageFile: File): Promise<Image | undefined> => {
    try {
        const formData = new FormData();
        formData.append('file', imageFile);
        const response = await axios.post<Image>(`${API_URL}/${id}/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });
        toast.success('Image uploaded successfully.');
        return response.data;
    } catch (error) {
        handleError(error, 'Error uploading image.');
        return undefined;
    }
};

export const updateAttachment = async (token: string, id: string, file: File): Promise<Attachment | undefined> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.put<Attachment>(`${API_URL}/${id}/update-attachment`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });
        toast.success('Attachment updated successfully.');
        return response.data;
    } catch (error) {
        handleError(error, 'Error updating attachment.');
        return undefined;
    }
};

export const downloadAttachment = async (token: string, candidateId: string, fileName: string): Promise<void> => {
    try {
        const response = await axios.get(`${API_URL}/${candidateId}/attachments/${fileName}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success('Attachment downloaded successfully.');
    } catch (error) {
        handleError(error, 'Error downloading attachment.');
    }
};

export const deleteAttachment = async (token: string, id: string, fileName: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}/attachments/${fileName}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        toast.success('Attachment deleted successfully.');
    } catch (error) {
        handleError(error, 'Error deleting attachment.');
    }
};

export const updateImage = async (token: string, id: string, fileName: string, file: File): Promise<Image | undefined> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.put<Image>(`${API_URL}/${id}/images/${fileName}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });
        toast.success('Image updated successfully.');
        return response.data;
    } catch (error) {
        handleError(error, 'Error updating image.');
        return undefined;
    }
};

//* without token
/*
// Upload a file as an attachment
export const uploadFile = async (id: string, file: File): Promise<Attachment | undefined> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        // const response = await axios.post<Attachment>(`${API_URL}/${id}/upload-attachment`, formData, {
        const response = await axios.post<Attachment>(`${API_URL}/${id}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        toast.success('Attachment uploaded successfully.');
        return response.data;
    } catch (error) {
        handleError(error, 'Error uploading attachment.');
        return undefined;
    }
};

// Upload an image
export const uploadImage = async (id: string, imageFile: File): Promise<Image | undefined> => {
    try {
        const formData = new FormData();
        formData.append('file', imageFile);
        const response = await axios.post<Image>(`${API_URL}/${id}/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        toast.success('Image uploaded successfully.');
        return response.data;
    } catch (error) {
        handleError(error, 'Error uploading image.');
        return undefined;
    }
};

// Update an attachment
export const updateAttachment = async (id: string, file: File): Promise<Attachment | undefined> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.put<Attachment>(`${API_URL}/${id}/update-attachment`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        toast.success('Attachment updated successfully.');
        return response.data;
    } catch (error) {
        handleError(error, 'Error updating attachment.');
        return undefined;
    }
};

// Download an attachment
export const downloadAttachment = async (candidateId: string, fileName: string): Promise<void> => {
    try {
        const response = await axios.get(`${API_URL}/${candidateId}/attachments/${fileName}`, {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success('Attachment downloaded successfully.');
    } catch (error) {
        handleError(error, 'Error downloading attachment.');
    }
};

// Delete an attachment
export const deleteAttachment = async (id: string, fileName: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}/attachments/${fileName}`);
        toast.success('Attachment deleted successfully.');
    } catch (error) {
        handleError(error, 'Error deleting attachment.');
    }
};

// Update Image
export const updateImage = async (id: string, fileName: string, file: File): Promise<Image | undefined> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.put<Image>(`${API_URL}/${id}/images/${fileName}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        toast.success('Image updated successfully.');
        return response.data;
    } catch (error) {
        handleError(error, 'Error updating image.');
        return undefined;
    }
};
*/

// Delete an attachment
// export const deleteAttachment = async (token: string, id: string, fileName: string): Promise<void> => {
//     try {
//         await axios.delete(`${API_URL}/${id}/attachments/${fileName}`, {
//             headers: { Authorization: `Bearer ${token}` },
//         });
//         toast.success('Attachment deleted successfully.');
//     } catch (error) {
//         handleError(error, 'Error deleting attachment.');
//     }
// };



//! Below code is good but it doesn't accept every data that come form backend
// import axios from 'axios';

// // Define the type for an employee
// interface CandidateType {
//     id: number;
//     candidateName: string;
//     position: string;
//     skills: string;
// }

// const API_URL = 'http://localhost:8080';

// export const fetchCandidates = async () => {
//     try {
//         const response = await axios.get(`${API_URL}/api/candidates`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching candidates:', error);
//         throw error;
//     }
// };

// export const fetchCandidateById = async (id: number) => {
//     try {
//         const response = await axios.get(`${API_URL}/api/candidates/${id}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching candidate by ID:', error);
//         throw error;
//     }
// };
// // export const fetchEmployeeById = async (employee: EmployeeType) => {
// //     try {
// //         const response = await axios.get(`${API_URL}/candidates/${employee.id}`);
// //         return response.data;
// //     } catch (error) {
// //         console.error('Error fetching employee by ID:', error);
// //         throw error;
// //     }
// // };

// export const addCandidate = async (candidate: CandidateType) => {
//     try {
//         const response = await axios.post(`${API_URL}/api/candidates`, candidate);
//         return response.data;
//     } catch (error) {
//         console.error('Error adding candidate:', error);
//         throw error;
//     }
// };

// export const updateCandidate = async (id: number, candidate: CandidateType) => {
//     try {
//         const response = await axios.put(`${API_URL}/api/candidates/${id}`, candidate);
//         return response.data;
//     } catch (error) {
//         console.error('Error updating candidate:', error);
//         throw error;
//     }
// };

// export const deleteCandidate = async (id: number) => {
//     try {
//         const response = await axios.delete(`${API_URL}/api/candidates/${id}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error deleting candidate:', error);
//         throw error;
//     }
// };

// Implement similar functions for update and delete operations

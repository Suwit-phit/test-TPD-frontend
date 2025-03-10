// src/services/AttachmentService.ts
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast for notifications

// const API_URL = 'http://localhost:8080/api/attachments-outside';
// const API_URL = 'https://test-tpd-sb.onrender.com/api/attachments-outside';
const SB_BASE_URL = import.meta.env.VITE_TPD_SB_APP_API_URL;
// const API_URL = `${SB_BASE_URL}/password-reset`; 
const API_URL = `${SB_BASE_URL}/api/attachments-outside`;

// Fetch all attachments with optional sorting and ordering options
export const getAttachments = async (token: string, sortBy?: string, ascending?: boolean) => {
    try {
        let response;

        console.log("token under getAttachments", token);

        if (sortBy) {
            console.log("token under sortBy getAttachments", token);
            // If sortBy is provided, add sorting and ordering parameters
            response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
                params: { sortBy, ascending },
            });
            console.log("token under after sortBy getAttachments", token);
        } else {
            console.log("else token under sortBy getAttachments", token);
            // If no sortBy is provided, make a request to the default API endpoint
            response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("response", response);
            console.log("else token after under sortBy getAttachments", token);
        }
        // Display success message from backend
        toast.success(response.data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data); // Display error message from backend
        } else {
            toast.error('Failed to get all attachments');
        }
        throw error; // Optionally rethrow the error for further handling
    }
};

// Download a specific attachment by UUID and file name
export const downloadAttachment = async (token: string, id: string, fileName: string) => {
    try {
        const response = await axios.get(`${API_URL}/${id}/download/${fileName}`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        // Display success message from backend
        toast.success(response.data);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data); // Display error message from backend
        } else {
            toast.error('Failed to download the attachment');
        }
        throw error; // Optionally rethrow the error for further handling
    }
};

// Delete an attachment by UUID and file name
export const deleteAttachment = async (token: string, id: string, fileName: string) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}/delete/${fileName}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(response.data); // Use the message from the backend
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data); // Display error message from backend
        } else {
            toast.error('Failed to delete the attachment');
        }
    }
};

// Upload a new attachment to the server with success/error handling
export const uploadAttachment = async (token: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    console.log("token under export const uploadAttachment:", token)
    try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        // Display success message from backend
        toast.success(response.data);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data); // Display error message from backend
        } else {
            toast.error('Failed to upload the attachment');
        }
        throw error; // Optionally rethrow the error for further handling
    }
};



//! Good
// // src/services/AttachmentService.ts
// import axios from 'axios';
// import { toast } from 'react-toastify'; // Import toast for notifications

// const API_URL = 'http://localhost:8080/api/attactments-outside';

// // Fetch all attachments with optional sorting and ordering options
// export const getAttachments = async (sortBy?: string, ascending?: boolean) => {
//     try {
//         let response;

//         if (sortBy) {
//             // If sortBy is provided, add sorting and ordering parameters
//             response = await axios.get(API_URL, {
//                 params: { sortBy, ascending },
//             });
//         } else {
//             // If no sortBy is provided, make a request to the default API endpoint (Original sorting)
//             response = await axios.get(API_URL);
//         }
//         // Display success message from backend
//         toast.success(response.data);
//         return response.data;
//     } catch (error) {
//         if (axios.isAxiosError(error) && error.response) {
//             toast.error(error.response.data); // Display error message from backend
//         } else {
//             toast.error('Failed to get all attachment');
//         }
//         throw error; // Optionally rethrow the error for further handling
//     }
// };


// // Download a specific attachment by UUID and file name
// export const downloadAttachment = async (id: string, fileName: string) => {
//     try {
//         const response = await axios.get(`${API_URL}/${id}/download/${fileName}`, {
//             responseType: 'blob',
//         });
//         const url = window.URL.createObjectURL(new Blob([response.data]));
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', fileName);
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//         // Display success message from backend
//         toast.success(response.data);
//     } catch (error) {
//         if (axios.isAxiosError(error) && error.response) {
//             toast.error(error.response.data); // Display error message from backend
//         } else {
//             toast.error('Failed to upload the attachment');
//         }
//         throw error; // Optionally rethrow the error for further handling
//     }
// };

// // Delete an attachment by UUID and file name
// export const deleteAttachment = async (id: string, fileName: string) => {
//     try {
//         const response = await axios.delete(`${API_URL}/${id}/delete/${fileName}`);
//         toast.success(response.data); // Use the message from the backend
//     } catch (error) {
//         if (axios.isAxiosError(error) && error.response) {
//             toast.error(error.response.data); // Display error message from backend
//         } else {
//             toast.error('Failed to delete the attachment');
//         }
//     }
// };

// // Upload a new attachment to the server with success/error handling
// export const uploadAttachment = async (file: File) => {
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//         const response = await axios.post(`${API_URL}/upload`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });

//         // Display success message from backend
//         toast.success(response.data);

//         return response.data;
//     } catch (error) {
//         if (axios.isAxiosError(error) && error.response) {
//             toast.error(error.response.data); // Display error message from backend
//         } else {
//             toast.error('Failed to upload the attachment');
//         }
//         throw error; // Optionally rethrow the error for further handling
//     }
// };
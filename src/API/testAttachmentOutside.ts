import axios from "axios";

// const API_URL = "http://localhost:8080/api/attactments-outside";
// const API_URL = "https://test-tpd-sb.onrender.com/attactments-outside";
const SB_BASE_URL = import.meta.env.VITE_TPD_SB_APP_API_URL;
const API_URL = `${SB_BASE_URL}/attactments-outside`;

// Function to get the token (adjust where you store it)
const getAuthToken = () => localStorage.getItem("authToken") || "";

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add Authorization header to every request
apiClient.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Upload file
export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    await apiClient.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// Fetch attachments
export const fetchAttachments = async () => {
    const response = await apiClient.get("/");
    return response.data;
};

// Download file
export const downloadFile = async (id: string, fileName: string) => {
    const response = await apiClient.get(`/${id}/download/${fileName}`, {
        responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
};

// Delete file
export const deleteFile = async (id: string, fileName: string) => {
    await apiClient.delete(`/${id}/delete/${fileName}`);
};

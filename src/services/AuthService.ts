import axios from 'axios';

// const API_URL = 'http://localhost:8080';
// const API_URL = 'https://test-tpd-sb.onrender.com';
// const API_URL = import.meta.env.VITE_TPD_SB_APP_API_URL;
const API_URL = import.meta.env.VITE_TPD_SB_APP_API_URL;
console.log("API_URL = ", API_URL);
// const API_URL = import.meta.env.LOCAL_TPD_SB_APP_API_URL;
// const API_URL = 'https://matching-production-b463.up.railway.app';
// const API_URL = 'https://matching-render.onrender.com';
// const API_URL = '/api/auth';

export const login = async (usernameOrEmail: string, password: string) => {
    const response = await axios.post(`${API_URL}/authenticate`, { usernameOrEmail, password });
    return response.data; // This should now include token, username, and email
};

export const logout = async (token: string): Promise<void> => {
    await axios.post(`${API_URL}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export interface UserData {
    username: string;
    email: string;
    password: string;
}

//   const URL = 'http://localhost:8080';
// const URL = 'https://matching-production-b463.up.railway.app';

export const registerUser = async (userData: UserData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
    // return await axios.post(`${API_URL}/register`, userData);
    // return await axios.post(`${URL}/register`, userData);
    // return await axios.post('http://localhost:8080/register', userData);
};

export interface User {
    userId: string;
    username: string;
    email: string;
}

export interface UpdateResponse {
    message: string;
    username: string;
    email: string;
    userId: number;
}

// const API_URL = 'http://localhost:8080';

export const updateUser = async (token: string, user: User): Promise<UpdateResponse> => {
    const response = await axios.put<UpdateResponse>(`${API_URL}/user/${user.userId}`, user, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// export const deleteUser = async (token: string, userId: number): Promise<void> => {
export const deleteUser = async (token: string, userId: string): Promise<void> => {
    await axios.delete(`${API_URL}/user/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
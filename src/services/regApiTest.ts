import axios, { } from 'axios';
// import axios, { AxiosError } from 'axios';

interface UserData {
  username: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
}

// Define a function to register a new user
export const registerUser = async (userData: UserData): Promise<string> => {
  try {
    const response = await axios.post<RegisterResponse>('http://localhost:8080/register', userData);
    return response.data.message; // Success message from backend
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Axios-specific error handling
      if (error.response?.data && typeof error.response.data === 'string') {
        throw new Error(error.response.data); // Backend error message as string
      } else {
        throw new Error('An unknown error occurred. Please try again.');
      }
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
};

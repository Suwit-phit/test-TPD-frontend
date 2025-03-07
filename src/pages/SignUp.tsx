import React, { useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { registerUser, UserData } from "../services/AuthService";
// import axios from 'axios';
import axios, { AxiosError } from 'axios';

const isAxiosError = (error: unknown): error is AxiosError => {
    return axios.isAxiosError(error);
};

const SignUp: React.FC = () => {
    const [formData, setFormData] = useState<UserData>({
        username: '',
        email: '',
        password: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        // Check if passwords match
        if (formData.password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            // Register user
            const response = await registerUser(formData);
            setSuccess(response);
        } catch (error: unknown) {
            // Handle error response
            // if (axios.isAxiosError(error)) {
            //     // Axios-specific error handling
            //     if (error.response?.data && typeof error.response.data === 'string') {
            //         throw new Error(error.response.data); // Backend error message as string
            //     } else {
            //         throw new Error('An unknown error occurred. Please try again.');
            //     }
            // } else {
            //     throw new Error('An unexpected error occurred.');
            // }
            // if (error instanceof Error) {
            //     // setErrorMessage(error.message);
            //     // const errorMessage = error.message;
            //     const errorMessage = error.message;
            //     setError(`Registration failed: ${errorMessage}`);
            // } else {
            //     // setErrorMessage('An unexpected error occurred.');
            //     setError('An unexpected error occurred.');
            // }
            
            // if (isAxiosError(error) && error.response) {
            //     const errorMessage = error.response.data;
            //     setError(`Registration failed: ${errorMessage}`);
            // } else {
            //     setError('An unexpected error occurred.');
            // }

            if (isAxiosError(error) && error.response) {
                // const errorMessage = (error.response.data as { message: string }).message;
                const errorMessage = (error.response.data);
                console.log("errorMessage = ", errorMessage);
                setError(`Registration failed because, ${errorMessage}` || 'Registration failed');
                // setError(errorMessage || 'Registration failed');
            } else {
                setError('Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <header className="bg-white py-6">
                <div className="flex justify-center">
                    <img src="../assets/ATALogo.png" alt="ATA logo" className="h-20" />
                </div>
                <div className="flex justify-center">
                    <h1 className="text-1xl font-bold">Talent Pool Database</h1>
                </div>
            </header>
            <main className="container mx-auto px-4 py-0 max-w-md">
                <div className="bg-white p-6 rounded shadow-md">
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    {success && <div className="text-green-500 mb-4">{success}. You can <strong>login</strong> now!</div>}
                    {loading && (
                        <div className="flex justify-center items-center mb-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                    <form onSubmit={handleSignUp}>
                        <div className="mb-4">
                            <input
                                required
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full border border-black p-1 rounded"
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                required
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-black p-1 rounded"
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-4 relative">
                            <input
                                required
                                name="password"
                                placeholder="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border border-black p-1 rounded"
                                disabled={loading}
                            />
                            <div className="absolute top-0 right-1 h-full w-10 flex items-center justify-center" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </div>
                        </div>
                        <div className="mb-6 relative">
                            <input
                                required
                                placeholder="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                className="w-full border border-black p-1 rounded"
                                disabled={loading}
                            />
                            <div className="absolute top-0 right-1 h-full w-10 flex items-center justify-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                            </div>
                        </div>
                        <div className="mt-4 flex justify-center">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white py-1 px-4 rounded"
                                disabled={loading}
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                    <div className="flex items-center my-4 mx-6">
                        <div className="border-t border-gray-900 flex-grow mr-3"></div>
                        <span className="text-gray-900">OR</span>
                        <div className="border-t border-gray-900 flex-grow ml-3"></div>
                    </div>
                    <div className="flex justify-center">
                        <p>Already have an account?
                            <a href="/" className="text-blue-500 underline ml-2">Login</a>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SignUp;


//! Below code is good
// import React, { useState } from 'react';
// import { registerUser } from '../services/regApiTest';
// // import { registerUser } from './api';

// const SignUp: React.FC = () => {
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setErrorMessage('');

//         try {
//             const responseMessage = await registerUser({ username, email, password });
//             alert(responseMessage); // Success message from backend
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//                 setErrorMessage(error.message);
//             } else {
//                 setErrorMessage('An unexpected error occurred.');
//             }
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100">
//             <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
//                 <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
//                 {errorMessage && (
//                     <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">
//                         {errorMessage}
//                     </div>
//                 )}
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
//                         <input
//                             type="text"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             className="w-full px-3 py-2 border rounded-lg"
//                             required
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
//                         <input
//                             type="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             className="w-full px-3 py-2 border rounded-lg"
//                             required
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
//                         <input
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="w-full px-3 py-2 border rounded-lg"
//                             required
//                         />
//                     </div>
//                     <button
//                         type="submit"
//                         className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
//                     >
//                         Sign Up
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default SignUp;


//! Below good code but there no Error message
// // // src/components/SignUp.tsx
// import React, { useState } from "react";
// // import PasswordInput from "./PasswordInput";
// // import ConfirmPassword from "./ConfirmPassword";
// // import { navigate } from "wouter/use-browser-location";

// import axios, { AxiosError } from 'axios';
// // import { UserData, registerUser } from '../API/userApi';
// // import { useNavigate } from 'react-router-dom';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import { registerUser, UserData } from "../services/AuthService";

// const isAxiosError = (error: unknown): error is AxiosError => {
//     return axios.isAxiosError(error);
// };

// const SignUp: React.FC = () => {
//     const [successMessage, setSuccessMessage] = useState("");
//     // const navigate = useNavigate();
//     const [formData, setFormData] = useState<UserData>({
//         username: '',
//         email: '',
//         password: '',
//     });
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [error, setError] = useState<string | null>(null);
//     const [success, setSuccess] = useState<string | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });
//     };
//     const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setConfirmPassword(e.target.value);
//     };
//     const handleSignUp = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError(null);
//         setSuccess(null);
//         setLoading(true);

//         // Check if passwords match
//         if (formData.password !== confirmPassword) {
//             setError('Password does not match');
//             setLoading(false);
//             return;
//         }

//         try {
//             // Register user
//             const respond = await registerUser(formData);
//             console.log("response under const respond = await registerUser(formData); = ", respond.data);
//             // Handle successful registration
//             setSuccess(respond.data);
//             // setSuccess('User registered successfully');
//         } catch (error: unknown) {
//             // Handle error response
//             if (isAxiosError(error) && error.response) {
//                 // const errorMessage = (error.response.data as { message: string }).message;
//                 const errorMessage = (error.response.data);
//                 console.log("errorMessage = ", errorMessage);
//                 setError(`Registration failed because, ${errorMessage}` || 'Registration failed');
//                 // setError(errorMessage || 'Registration failed');
//             } else {
//                 setError('Registration failed');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     // const goToHomePage = () => {
//     //     navigate('/');
//     // }
//     // const handleSignUp = (e: React.FormEvent) => {
//     //     e.preventDefault();
//     //     // You can simulate successful signup here by setting a success message
//     //     setSuccessMessage("Signup successful! You can now login.");
//     // };

//     return (
//         <div className="min-h-screen">
//             <header className="bg-white py-6">
//                 <div className="flex justify-center">
//                     <img src="../src/assets/ATALogo.png" alt="ATA logo" className="h-20" />
//                 </div>
//                 <div className="flex justify-center">
//                     <h1 className="text-1xl font-bold">Talent Pool Database</h1>
//                 </div>
//             </header>
//             <main className="container mx-auto px-4 py-0 max-w-md">
//                 <div className="bg-white p-6 rounded shadow-md">
//                     {error && <div className="text-red-500 mb-4">{error}</div>}
//                     {success && <div className="text-green-500 mb-4">{success}. Please use this information to <strong>login</strong></div>}
//                     {loading && (
//                         <div className="flex justify-center items-center mb-4">
//                             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//                         </div>
//                     )}
//                     <form onSubmit={handleSignUp}>
//                         <div className="mb-4">
//                             <input
//                                 required
//                                 type="username"
//                                 placeholder="Username"
//                                 className="w-full border border-black p-1 rounded"
//                             />
//                         </div>
//                         <div className="mb-4">
//                             <input
//                                 required
//                                 type="email"
//                                 placeholder="E-mail"
//                                 className="w-full border border-black p-1 rounded"
//                             />
//                         </div>
//                         {/* <div className="mb-4">
//                             <PasswordInput />
//                         </div>
//                         <div>
//                             <ConfirmPassword />
//                         </div> */}
//                         <div className="mb-4 relative">
//                             {/* <label className="block text-gray-700">Password:</label> */}
//                             <input
//                                 required
//                                 placeholder="Password"
//                                 // type="password"
//                                 type={showPassword ? 'text' : 'password'}
//                                 name="password"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 // className="mt-1 p-2 border border-gray-300 rounded w-full"
//                                 className="w-full border border-black p-1 rounded"
//                                 disabled={loading}
//                             />
//                             <div className="absolute top-0 right-1 h-full w-10 flex items-center justify-center" onClick={() => setShowPassword(!showPassword)}>
//                                 {showPassword ? <FaEye /> : <FaEyeSlash />}
//                             </div>
//                         </div>
//                         <div className="mb-6 relative">
//                             {/* <label className="block text-gray-700">Confirm Password:</label> */}
//                             <input
//                                 required
//                                 placeholder="Confirm Password"
//                                 // type="password"
//                                 type={showConfirmPassword ? 'text' : 'password'}
//                                 value={confirmPassword}
//                                 onChange={handleConfirmPasswordChange}
//                                 // className="mt-1 p-2 border border-gray-300 rounded w-full"
//                                 className="w-full border border-black p-1 rounded"
//                                 disabled={loading}
//                             />
//                             <div className="absolute top-0 right-1 h-full w-10 flex items-center justify-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
//                                 {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
//                             </div>
//                         </div>
//                         <div className="mt-4 flex justify-center">
//                             <button
//                                 type="submit"
//                                 className="bg-blue-500 text-white py-1 px-4 rounded"
//                             >
//                                 Sign Up
//                             </button>
//                         </div>
//                     </form>
//                     {successMessage && (
//                         <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
//                             <div className="relative bg-white rounded-lg p-8">
//                                 <span
//                                     className="absolute top-0 right-0 cursor-pointer"
//                                     onClick={() => setSuccessMessage("")}
//                                 >
//                                     <svg
//                                         className="fill-current h-6 w-6 text-green-500"
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         viewBox="0 0 20 20"
//                                     >
//                                         <title>Close</title>
//                                         <path
//                                             fillRule="evenodd"
//                                             d="M14.354 5.354a1 1 0 0 1 0 1.414L11.414 10l2.94 2.94a1 1 0 1 1-1.414 1.414L10 11.414l-2.94 2.94a1 1 0 1 1-1.414-1.414L8.586 10 5.646 7.06a1 1 0 0 1 1.414-1.414L10 8.586l2.94-2.94a1 1 0 0 1 1.414 0z"
//                                             clipRule="evenodd"
//                                         />
//                                     </svg>
//                                 </span>
//                                 <p className="text-lg text-gray-800">{successMessage}</p>
//                             </div>
//                         </div>
//                     )}
//                     <div className="flex items-center my-4 mx-6">
//                         <div className="border-t border-gray-900 flex-grow mr-3"></div>
//                         <span className="text-gray-900">OR</span>
//                         <div className="border-t border-gray-900 flex-grow ml-3"></div>
//                     </div>
//                     <div className="flex justify-center">
//                         <p>Already have an account?
//                             {/* <a href="/login" className="text-blue-500 underline ml-2">Login</a> */}
//                             <a href="/" className="text-blue-500 underline ml-2">Login</a>
//                         </p>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default SignUp;

//! Below code is Good
// // src/components/SignUp.tsx
// import React, { useState } from "react";
// import PasswordInput from "./PasswordInput";
// import ConfirmPassword from "./ConfirmPassword";
// // import { navigate } from "wouter/use-browser-location";

// const SignUp: React.FC = () => {
//     const [successMessage, setSuccessMessage] = useState("");

//     // const goToHomePage = () => {
//     //     navigate('/');
//     // }
//     const handleSignUp = (e: React.FormEvent) => {
//         e.preventDefault();
//         // You can simulate successful signup here by setting a success message
//         setSuccessMessage("Signup successful! You can now login.");
//     };

//     return (
//         <div className="min-h-screen">
//             <header className="bg-white py-6">
//                 <div className="flex justify-center">
//                     <img src="../src/assets/ATALogo.png" alt="ATA logo" className="h-20" />
//                 </div>
//                 <div className="flex justify-center">
//                     <h1 className="text-1xl font-bold">Talent Pool Database</h1>
//                 </div>
//             </header>
//             <main className="container mx-auto px-4 py-0 max-w-md">
//                 <div className="bg-white p-6 rounded shadow-md">
//                     {/* <form onSubmit={handleSignUp}>
//                         <div className="mb-4">
//                             <input type="username" placeholder="Username" className="w-full border border-black p-1 rounded" />
//                         </div>
//                         <div className="mb-4">
//                             <input type="email" placeholder="E-mail" className="w-full border border-black p-1 rounded" />
//                         </div>
//                         <div className="mb-4">
//                             <PasswordInput />
//                         </div>
//                         <div>
//                             <ConfirmPassword />
//                         </div>
//                         <div className="mt-4 flex justify-center">
//                             <button type="submit" className="bg-blue-500 text-white py-1 px-4 rounded" onClick={goToHomePage}>Sign Up</button>
//                         </div>
//                     </form> */}
//                     <form onSubmit={handleSignUp}>
//                         <div className="mb-4">
//                             <input
//                                 type="username"
//                                 placeholder="Username"
//                                 className="w-full border border-black p-1 rounded"
//                             />
//                         </div>
//                         <div className="mb-4">
//                             <input
//                                 type="email"
//                                 placeholder="E-mail"
//                                 className="w-full border border-black p-1 rounded"
//                             />
//                         </div>
//                         <div className="mb-4">
//                             <PasswordInput />
//                         </div>
//                         <div>
//                             <ConfirmPassword />
//                         </div>
//                         <div className="mt-4 flex justify-center">
//                             <button
//                                 type="submit"
//                                 className="bg-blue-500 text-white py-1 px-4 rounded"
//                             >
//                                 Sign Up
//                             </button>
//                         </div>
//                     </form>
//                     {successMessage && (
//                         <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
//                             <div className="relative bg-white rounded-lg p-8">
//                                 <span
//                                     className="absolute top-0 right-0 cursor-pointer"
//                                     onClick={() => setSuccessMessage("")}
//                                 >
//                                     <svg
//                                         className="fill-current h-6 w-6 text-green-500"
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         viewBox="0 0 20 20"
//                                     >
//                                         <title>Close</title>
//                                         <path
//                                             fillRule="evenodd"
//                                             d="M14.354 5.354a1 1 0 0 1 0 1.414L11.414 10l2.94 2.94a1 1 0 1 1-1.414 1.414L10 11.414l-2.94 2.94a1 1 0 1 1-1.414-1.414L8.586 10 5.646 7.06a1 1 0 0 1 1.414-1.414L10 8.586l2.94-2.94a1 1 0 0 1 1.414 0z"
//                                             clipRule="evenodd"
//                                         />
//                                     </svg>
//                                 </span>
//                                 <p className="text-lg text-gray-800">{successMessage}</p>
//                             </div>
//                         </div>
//                     )}
//                     <div className="flex items-center my-4 mx-6">
//                         <div className="border-t border-gray-900 flex-grow mr-3"></div>
//                         <span className="text-gray-900">OR</span>
//                         <div className="border-t border-gray-900 flex-grow ml-3"></div>
//                     </div>
//                     <div className="flex justify-center">
//                         <p>Already have an account?
//                             {/* <a href="/login" className="text-blue-500 underline ml-2">Login</a> */}
//                             <a href="/" className="text-blue-500 underline ml-2">Login</a>
//                         </p>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default SignUp;



// // src/components/SignUp.tsx
// import React from "react";
// import PasswordInput from "./PasswordInput";
// import ConfirmPassword from "./ConfirmPassword";
// import { navigate } from "wouter/use-browser-location";

// const SignUp: React.FC = () => {
//     const goToHomePage = () => {
//         navigate('/');
//     }

//     return (
//         <div className="min-h-screen">
//             <header className="bg-white py-6">
//                 <div className="flex justify-center">
//                     <img src="../src/assets/ATALogo.png" alt="ATA logo" className="h-20" />
//                 </div>
//                 <div className="flex justify-center">
//                     <h1 className="text-1xl font-bold">Talent Pool Database</h1>
//                 </div>
//             </header>
//             <main className="container mx-auto px-4 py-0 max-w-md">
//                 <div className="bg-white p-6 rounded shadow-md">
//                     <form action="">
//                         <div className="mb-4">
//                             <input type="username" placeholder="Username" className="w-full border border-black p-1 rounded" />
//                         </div>
//                         <div className="mb-4">
//                             <input type="email" placeholder="E-mail" className="w-full border border-black p-1 rounded" />
//                         </div>
//                         <div className="mb-4">
//                             <PasswordInput />
//                         </div>
//                         <div>
//                             <ConfirmPassword />
//                         </div>
//                         <div className="mt-4 flex justify-center">
//                             <button type="submit" className="bg-blue-500 text-white py-1 px-4 rounded" onClick={goToHomePage}>Sign Up</button>
//                         </div>
//                     </form>
//                     <div className="flex items-center my-4 mx-6">
//                         <div className="border-t border-gray-900 flex-grow mr-3"></div>
//                         <span className="text-gray-900">OR</span>
//                         <div className="border-t border-gray-900 flex-grow ml-3"></div>
//                     </div>
//                     <div className="flex justify-center">
//                         <p>Already have an account?
//                             <a href="/login" className="text-blue-500 underline ml-2">Login</a>
//                         </p>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default SignUp;


// src/components/SignUp.tsx
// import React from "react";

// const SignUp: React.FC = () => {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
//       <p>Already have an account? <a href="/login" className="text-blue-500">Login</a></p>
//     </div>
//   );
// };

// export default SignUp;


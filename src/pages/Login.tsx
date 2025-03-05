// src/components/Login.tsx
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/AuthService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";
import { notification } from "antd";
// import './App.css';
// import PasswordInput from "./PasswordInput";
// import { navigate } from "wouter/use-browser-location";

interface LoginProps {
    setToken: (token: string) => void;
    // setUser: (user: { userId: number; username: string; email: string }) => void;
}

// const Login: React.FC<LoginProps> = ({ setToken, setUser }) => {
const Login: React.FC<LoginProps> = ({ setToken }) => {
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    // const [error, setError] = useState("");
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    // const handleLogin = (e: React.FormEvent) => {
    //     e.preventDefault();

    //     // Check if email and password match the expected values
    //     if (email === "hello123@gmail.com" && password === "1234") {
    //         // Successful login, navigate to home page
    //         navigate("/");
    //     } else {
    //         // Display error message for incorrect credentials
    //         setError("Invalid email or password. Please try again.");
    //     }
    // };
    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true); // Start loading
        setErrorMessage(''); // Clear any previous error messages
        try {
            const response = await login(usernameOrEmail, password);
            setToken(response.token);
            console.log("response.token", response.token);
            // setUser({ userId: response.userId, username: response.username, email: response.email });
            console.log("response.user", { userId: response.userId, username: response.username, email: response.email });
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify({ userId: response.userId, username: response.username, email: response.email }));
            // navigate('/');
            // Show success notification
            openNotification();

            // Navigate to home page after 2 seconds
            setTimeout(() => {
                navigate('/');
                // navigate('/home');
            }, 2000);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Login failed', error);
                if (error.response && error.response.data) {
                    setErrorMessage(error.response.data); // Set the error message from the response
                } else {
                    setErrorMessage('An unexpected error occurred. Please try again.');
                }
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const openNotification = () => {
        notification.success({
            message: 'Successfully Logged In',
            description: 'You will be redirected to the home page shortly.',
            placement: 'topRight',
        });
    };

    return (
        // <div className="min-h-screen bg-gray-100">
        <>
            <div className="min-h-screen">
                <header className="bg-white py-6">
                    <div className="flex justify-center">
                        <img src="../src/assets/ATALogo.png" alt="ATA logo" className="h-20" />
                    </div>
                    <div className="flex justify-center">
                        <h1 className="text-1xl font-bold">Talent Pool Database</h1>
                    </div>
                </header>
                <main className="container mx-auto px-4 py-0 max-w-md">
                    <div className="bg-white p-6 rounded shadow-md">
                        {errorMessage && (
                            <div className=" mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Error! </strong>
                                <span className="block sm:inline">{errorMessage}</span>
                            </div>
                        )}
                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <input
                                    required
                                    placeholder="E-mail or Username"
                                    className="w-full border border-black p-1 rounded"
                                    type="text"
                                    value={usernameOrEmail}
                                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                                // required
                                // type="email"
                                // placeholder="E-mail"
                                // className="w-full border border-black p-1 rounded"
                                // value={email}
                                // onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Password"
                                    className="w-full border border-black p-1 rounded"
                                // type="password"
                                // placeholder="Password"
                                // className="w-full border border-black p-1 rounded"
                                // value={password}
                                // onChange={(e) => setPassword(e.currentTarget.value)}
                                />
                                <div
                                    className=" absolute inset-y-2 right-3 cursor-pointer"
                                    // className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {/* {showPassword ? <FaEyeSlash /> : <FaEye />} */}
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </div>
                            </div>
                            {/* {error && <p className="text-red-500">{error}</p>} */}
                            {/* <a
                                href="/requestForgotPassword"
                                className="flex justify-end text-sm text-blue-500 hover:text-blue-300 underline mt-2"
                            >
                                Forgot your password?
                            </a> */}
                            <div className="mt-4 flex justify-center">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-500 hover:bg-blue-300 text-white py-1 px-4 rounded"
                                >
                                    {loading ? (
                                        < LoadingSpinner />
                                    ) : (
                                        'Login'
                                    )}
                                </button>
                            </div>
                        </form>
                        <div className="flex items-center my-4 mx-6">
                            <div className="border-t border-gray-900 flex-grow mr-3"></div>
                            <span className="text-gray-900">OR</span>
                            <div className="border-t border-gray-900 flex-grow ml-3"></div>
                        </div>
                        <div className="flex justify-center">
                            <p>
                                Don’t have an account?
                                <a href="/signUp" className="text-blue-500 hover:text-blue-300 underline ml-2">
                                    SIGN UP
                                </a>
                            </p>
                        </div>
                    </div>
                </main>
                {/* {errorMessage && (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error! </strong>
                        <span className="block sm:inline">{errorMessage}</span>
                    </div>
                )} */}
            </div>
        </>
    );
};

export default Login;


// // src/components/Login.tsx
// import React from "react";
// // import './App.css';
// import PasswordInput from "./PasswordInput";
// import { navigate } from "wouter/use-browser-location";

// const Login: React.FC = () => {
//     const goToHomePage = () => {
//         navigate('/');
//     }

//     return (
//         // <div className="min-h-screen bg-gray-100">
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
//                             <input type="email" placeholder="E-mail" className="w-full border border-black p-1 rounded" />
//                         </div>
//                         <div>
//                             <PasswordInput />
//                         </div>
//                         <a href="/forgotPassword" className="flex justify-end text-sm text-blue-500 underline mt-2">Forgot your password?</a>
//                         {/* <p onClick={handleClick} className="text-right text-sm text-blue-500 underline mt-2" >Forgot your password?</p> */}
//                         <div className="mt-4 flex justify-center">
//                             <button type="submit" className="bg-blue-500 text-white py-1 px-4 rounded" onClick={goToHomePage}>Login</button>
//                         </div>
//                     </form>
//                     <div className="flex items-center my-4 mx-6">
//                         <div className="border-t border-gray-900 flex-grow mr-3"></div>
//                         <span className="text-gray-900">OR</span>
//                         <div className="border-t border-gray-900 flex-grow ml-3"></div>
//                     </div>
//                     <div className="flex justify-center">
//                         <p>Don’t have an account?
//                             <a href="/signup" className="text-blue-500 underline ml-2">SIGN UP</a>
//                         </p>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default Login;

// import React from "react";

// const Login: React.FC = () => {
//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen">
//             <h2 className="text-2xl font-bold mb-4">Login</h2>
//             <p>Don't have an account? <a href="/signup" className="text-blue-500">Sign up</a></p>
//             <p>Don't have an account? <a href="/ForgotPassword" className="text-blue-500">ForgotPassword</a></p>
//         </div>
//     );
// };

// export default Login;

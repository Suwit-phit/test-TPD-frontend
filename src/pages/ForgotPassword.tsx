import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../services/ApiResetPassword";
import axios from "axios";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const [loading, setLoading] = useState<boolean>(false);
    const [nextVisible, setNextVisible] = useState<boolean>(false);

    // const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage(''); // Clear any previous error messages
        try {
            const response = await requestPasswordReset(email);
            setMessage(response.message);
            setNextVisible(true);
        } catch (error) {
            setNextVisible(true);
            // setErrorMessage('Error sending password reset email.');
            if (axios.isAxiosError(error)) {
                console.error('Login failed', error);
                if (error.response && error.response.data) {
                    // setMessage(error.response.data); // Set the error message from the response
                    setErrorMessage(error.response.data); // Set the error message from the response
                } else {
                    setErrorMessage('An unexpected error occurred. Please try again.');
                }
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
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
                    <p className="text-sm text-center text-gray-600">
                        Forgot your password? Enter your email address below, and we'll send you instructions to reset it.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 mt-4">
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="E-mail"
                                className="w-full border border-black p-1 rounded"
                            // type="email"
                            // placeholder="E-mail"
                            // className="w-full border border-black p-1 rounded"
                            />
                        </div>
                        {message && <p className="mt-4 p-2 bg-green-200 text-green-800 rounded">{message}</p>}
                        {errorMessage && (
                            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Error! </strong>
                                <span className="block sm:inline">{errorMessage}</span>
                            </div>
                        )}
                        {nextVisible && (
                            <div className="mt-4 flex justify-center">
                                <a href="/validate" className="text-blue-500 hover:text-blue-300 underline ml-2">
                                    Next
                                </a>
                                {/* <button onClick={() => navigate('/validate')} className=" outline outline-blue-500 hover:bg-blue-500 py-1 px-4 rounded" >
                                    Next
                                </button> */}
                            </div>
                            // <button onClick={() => navigate('/validate')} className="bg-blue-500 text-white py-1 px-4 rounded">
                            //     Next
                            // </button>
                        )}
                        <div className="mt-4 flex justify-center">
                            <button
                                // onClick={handleSubmit}
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-300 text-white py-1 px-4 rounded"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex justify-center items-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                        <span className=' ml-2'>Sending...</span>
                                    </div>
                                ) : (
                                    "Request reset link"
                                )}
                            </button>
                        </div>
                        {/* {nextVisible && (
                            <div className="mt-4 flex justify-center">
                                <button onClick={() => navigate('/validate')} className=" outline outline-blue-500 hover:bg-blue-500 py-1 px-4 rounded" >
                                    Next
                                </button>
                            </div>
                            // <button onClick={() => navigate('/validate')} className="bg-blue-500 text-white py-1 px-4 rounded">
                            //     Next
                            // </button>
                        )} */}
                    </form>
                    <div className="flex items-center my-4 mx-6">
                        <div className="border-t border-gray-900 flex-grow mr-3"></div>
                        <span className="text-gray-900">OR</span>
                        <div className="border-t border-gray-900 flex-grow ml-3"></div>
                    </div>
                    <div className="flex justify-center">
                        <p>Back to
                            {/* <a href="/login" className="text-blue-500 underline ml-2">Login</a> */}
                            <a href="/" className="text-blue-500 hover:text-blue-300 underline ml-2">Login</a>
                        </p>
                    </div>
                </div>
            </main>
            {/* </header> */}
        </div>
    );
};

export default ForgotPassword;

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const ForgotPassword: React.FC = () => {
//     const navigate = useNavigate();
//     const [email, setEmail] = useState('');

//     const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         // Handle form submission logic here
//         console.log('Email:', email);
//         navigate('/login');
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center">
//             <div className="w-full max-w-md">
//                 <div className="text-center">
//                     <h1 className="text-4xl font-bold mb-4">Advanced Technology Asia</h1>
//                     <p className="text-gray-600">Forgot your password? Enter your email address below, and we'll send you instructions to reset it.</p>
//                 </div>
//                 <form onSubmit={handleSubmit} className="mt-8 bg-white shadow-md rounded-lg p-8">
//                     <div className="mb-4">
//                         <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
//                             Email
//                         </label>
//                         <input
//                             type="email"
//                             id="email"
//                             value={email}
//                             onChange={(event) => setEmail(event.target.value)}
//                             className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                             placeholder="Enter your email"
//                             required
//                         />
//                     </div>
//                     <div className="flex items-center justify-between">
//                         <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
//                             Request Reset Link
//                         </button>
//                         <Link to="/login" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
//                             Back to Login
//                         </Link>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default ForgotPassword;

// import React from "react";

// const ForgotPassword: React.FC = () => {
//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen">
//             <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
//             <p>Already have an account? <a href="/login" className="text-blue-500">Login</a></p>
//         </div>
//     );
// };

// export default ForgotPassword;
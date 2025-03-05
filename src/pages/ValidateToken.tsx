import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { validateToken } from '../services/ApiResetPassword';
// import { validateToken } from './api';
// import { useHistory } from 'react-router-dom';

const ValidateToken: React.FC = () => {
    const [token, setToken] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [nextVisible, setNextVisible] = useState<boolean>(false);
    // const history = useHistory();
    // const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage(''); // Clear any previous error messages
        try {
            const response = await validateToken(token);
            setMessage(response.message);
            setNextVisible(true);
        } catch (error) {
            setNextVisible(true);
            setErrorMessage('Invalid or expired token.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <header className="bg-white py-6">
                <div className="flex justify-center">
                    <img src="../src/assets/ATALogo.png" alt="ATA logo" className="h-20" />
                </div>
                <div className="flex justify-center">
                    <h1 className="text-1xl font-bold">Talent Pool Database</h1>
                </div>
                <main className="container mx-auto px-4 py-0 max-w-md">
                    <div className="bg-white p-6 rounded shadow-md">
                        <p className="text-sm text-center text-gray-600">
                            Enter the <strong>Token</strong> that was sent to your email address below. We'll check the Token and allow you to create a new password.
                        </p>
                        {/* <p className="text-sqm text-center text-gray-600">Forgot your password? Enter your email address below, and we'll send you instructions to reset it.</p> */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4 mt-4">
                                <input
                                    type="text"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    required
                                    placeholder="Token"
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
                                <div className=" mt-4 flex justify-center">
                                    <a href="/reset" className="text-blue-500 hover:text-blue-300 underline ml-2">
                                        Next
                                    </a>
                                    {/* <button onClick={() => navigate('/reset')} className=" outline outline-blue-500 hover:bg-blue-500 py-1 px-4 rounded">
                                        Next
                                    </button> */}
                                </div>
                            )}
                            <div className="mt-4 flex justify-center">
                                <a href="/requestForgotPassword" className="text-blue-500 hover:text-blue-300 mr-4 mt-1">
                                    Back
                                </a>
                                {/* <button onClick={() => navigate('/requestForgotPassword')} className=" outline outline-blue-500 hover:bg-blue-500 py-1 px-4 rounded mr-2" >
                                    Back
                                </button> */}
                                <button type='submit' className="bg-blue-500 hover:bg-blue-300 text-white py-1 px-4 rounded" >
                                    {loading
                                        ?
                                        <div className="flex justify-center items-center mb-4">
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                            <span className=' ml-2'>Validating...</span>
                                        </div>
                                        :
                                        'Validate Token'
                                    }
                                    {/* {loading ? 'Validating...' : 'Validate Token'} */}
                                </button>
                            </div>
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
            </header>
        </div>
    );
};

export default ValidateToken;

// src/components/TalentPoolDatabase.tsx

import React, { useEffect, useRef, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import Header from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { searchCandidates, Candidate as SearchCandidate } from '../API/searchApi';
import { useNavigate } from 'react-router-dom';
import GenerateExcelButton from '../components/GenerateExcelButton';
import GenerateCsvButton from '../components/GenerateCsvButton';
import SearchResults from '../components/SearchResults';
import { deleteCandidate, fetchCandidates } from '../API/candidatesApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import Modal from 'react-modal';
import Modal from "react-modal";
import UploadAttachmentOutsideForm from '../components/UploadAttachmentOutsideForm';

import { jwtDecode } from 'jwt-decode';

import {
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Button
} from '@mui/material';
import { logout } from '../services/AuthService';
import { deleteComment } from '../API/commentsApi';

// Ensure that React Modal binds to your app element
Modal.setAppElement('#root');

interface CandidateType {
    id: string; // UUID as string
    candidateName: string;
    position: string;
    skills: string | string[]; // skills can be either a string or an array of strings
}

interface HomePageProps {
    token: string;
    setToken: (token: string | null) => void;  // Add this line to define the prop type
}

interface JwtPayload {
    exp: number;
    iat?: number;
    sub?: string;
    // Add any other fields you expect to find in your JWT payload here
}

// const HomePage: React.FC = () => {
const HomePage: React.FC<HomePageProps> = ({ token, setToken }) => {
    const [candidates, setCandidates] = useState<CandidateType[]>([]);
    const [clickedIndex, setClickedIndex] = useState<number | null>(null);
    const [noDataSearch, setNoDataSearch] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchCandidate[]>([]);
    const [searching, setSearching] = useState(false);
    const [noData, setNoData] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState({ id: '', candidateName: '' });

    const [sortOrder, setSortOrder] = useState("Original");
    const [modalIsOpen, setModalIsOpen] = useState(false);

    // const [countVacancy, setCountVacancy] = useState(false);

    const [sessionOpen, setSessionOpen] = useState(false);

    const [loading, setLoading] = useState(false); // State for loading indicator

    const navigate = useNavigate();

    const togglePopup = (index: number) => {
        if (clickedIndex === index) {
            setClickedIndex(null);
        } else {
            setClickedIndex(index);
        }
    };

    const confirmDelete = async (id: string) => {
        try {
            await deleteComment(token, id);
            await deleteCandidate(token, id);
            setCandidates(candidates.filter(candidate => candidate.id !== id));
            toast.success('Candidate deleted successfully!');
        } catch (error) {
            console.error('Error deleting candidate:', error);
            toast.error('Failed to delete candidate. Please try again.');
        } finally {
            setIsModalOpen(false); // Close modal after action
        }
    };

    const handleDeleteClick = (id: string, candidateName: string) => {
        setCandidateToDelete({ id, candidateName }); // Store candidate info
        setIsModalOpen(true); // Open the modal
    };

    const handleConfirm = () => {
        setClickedIndex(null);
        setQuery('')
        setSearching(false);
        confirmDelete(candidateToDelete.id); // Proceed with deletion
    };

    const handleCancel = () => {
        setIsModalOpen(false); // Close the modal without action
        setClickedIndex(null);
    };

    const handleSearch = async () => {
        console.log("Inside handleSearch");
        const data = await searchCandidates(query, token);
        setResults(data);
        setSearching(true);
        console.log("In handleSearch data.length = ", data.length);

        if (data.length === 0) {
            openNoDataSearchPopup(query);
            toast.info('No candidates found.');

            setNoDataSearch(query);
            setNoData(true);
            setModalIsOpen(true); // Open the modal
        } else {
            // toast.success(`Found ${data.length} candidates.`);
        }
    };

    const openNoDataSearchPopup = (query: string) => {
        setNoDataSearch(query);
    };

    const closeNoDataSearchPopup = () => {
        setNoDataSearch(null);
        setNoDataSearch('');
        setModalIsOpen(false); // Close the modal
    };


    const goToEditCandidate = (id: string) => {
        // navigate(`/update-Candidate/${id}`);
        navigate(`/view-Candidate/${id}`);
    };

    const goToViewCandidate = (id: string) => {
        console.log("ID in goToViewCandidate = ", id);
        navigate(`/view-Candidate/${id}`);
    };

    //* Upload attachment
    const [showUploadModal, setShowUploadModal] = useState(false);
    const handleUploadClick = () => setShowUploadModal(true);
    const handleCloseModal = () => setShowUploadModal(false);
    const handleManageClick = () => navigate('/attachment-list');

    // const sortedCandidates = [...candidates].sort((a, b) => a.candidateName.localeCompare(b.candidateName));

    const handleSortChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setSortOrder(e.target.value);
    };

    const sortedCandidates = [...candidates];
    // let sortedCandidates = [...candidates];

    if (sortOrder === 'Ascending') {
        sortedCandidates.sort((a, b) => a.candidateName.localeCompare(b.candidateName));
    } else if (sortOrder === 'Descending') {
        sortedCandidates.sort((a, b) => b.candidateName.localeCompare(a.candidateName));
    }

    // Fetch all candidates on initial load
    useEffect(() => {
        const getCandidates = async () => {
            try {
                toast.success('Candidates loaded successfully!');
                const data = await fetchCandidates(token);
                console.log("data from backend = ", data);
                setCandidates(data || []); // Fallback to empty array if no data
                // toast.success('Candidates loaded successfully!');
            } catch (error) {
                console.error('Error fetching candidates:', error);
                toast.error('Failed to load candidates.');
            }
        };
        getCandidates();
    }, []); // Runs once on component mount

    const typingDelay = 500;  // Delay before search is triggered after typing stops
    const typingTimer = useRef<number | null>(null);  // Using useRef to store the typing timer

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    useEffect(() => {
        // Clear the timer if query changes (while user is typing)
        if (typingTimer.current) {
            clearTimeout(typingTimer.current);
        }

        if (query) {
            // Set a new timer; search will only be triggered when typing has stopped
            typingTimer.current = window.setTimeout(() => {
                const search = async () => {
                    const data = await searchCandidates(query, token);
                    setResults(data);
                    setSearching(true);
                    setNoData(data.length === 0);

                    if (data.length === 0) {
                        toast.info(`No candidates found for "${query}".`);
                    }
                };
                search();
            }, typingDelay);
        }

        // Cleanup function to clear the timeout when component unmounts or query changes
        return () => {
            if (typingTimer.current) {
                clearTimeout(typingTimer.current);
            }
        };
    }, [query]);

    // Handle "Enter" key press
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission (if needed)
            // Trigger search manually if Enter is pressed
            handleSearch();
        }
    };

    useEffect(() => {
        const checkTokenExpiration = () => {
            try {
                const decodedToken = jwtDecode<JwtPayload>(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                    setSessionOpen(true);
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                setSessionOpen(true); // In case of any error, show the dialog
            }
        };

        const interval = setInterval(checkTokenExpiration, 60000); // Check every minute

        return () => clearInterval(interval); // Cleanup on unmount
    }, [token]);
    const handleSessionClose = () => {
        setSessionOpen(false);
        // handleLogout();
        handleLogoutConfirm();
    };

    const handleLogoutConfirm = async () => {
        setLoading(true); // Start loading
        try {
            await logout(token);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);  // This ensures the token state is cleared
            navigate('/');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div>
            <header>
                <Header
                    token={token}
                    setToken={setToken}
                    candidateButtonClass='bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'
                    vacanciesButtonClass='hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'
                />
            </header>
            <main className="p-4">
                <div className="flex mb-4">
                    <div className="w-96 mr-4">
                        <div className="p-6 max-w-xs bg-white rounded-xl shadow-md">
                            <div className='flex items-center justify-center'>
                                <img src="../src/assets/NewCandidate.png" alt="NewCandidate.png" className='h-10' />
                                <h1 className='text-lg ml-2 mt-5'>New Candidate</h1>
                            </div>
                            <hr className="my-2 w-full border-gray-300" />
                            <a href='/create-Candidate' className='cursor-pointer flex items-center'>
                                <img src="../src/assets/AddCandidate.png" alt="AddCandidate.png" className='h-8' />
                                <h4 className='ml-2 hover:text-slate-300'>Create Candidate</h4>
                                {/* <h4 className='ml-2 hover:text-slate-300'>Add Candidate</h4> */}
                            </a>
                            <a onClick={handleUploadClick} className='cursor-pointer flex items-center mt-2'>
                                <img src="../src/assets/upload (1).png" alt="AddCandidate.png" className='h-8' />
                                <h4 className='ml-2 hover:text-slate-300'>Upload attachment</h4>
                                {/* <h4 className='ml-2 hover:text-slate-300'>Add Candidate</h4> */}
                            </a>
                            <a onClick={handleManageClick} className='cursor-pointer flex items-center mt-2'>
                                <img src="../src/assets/file.png" alt="AddCandidate.png" className='h-8' />
                                <h4 className='ml-2 hover:text-slate-300'>Attachments</h4>
                            </a>
                        </div>
                        <br />
                        <div className="p-6 max-w-xs bg-white rounded-xl shadow-md">
                            <div className='flex items-center justify-center'>
                                <img src="../src/assets/ReportFunction.png" alt="ReportFunction.png" className='h-10' />
                                <h1 className='text-lg ml-2 mt-5'>Report Function</h1>
                            </div>
                            <hr className="my-2 w-full border-gray-300" />
                            <GenerateExcelButton />
                            <GenerateCsvButton
                                token={token}
                            />
                        </div>
                    </div>
                    <div className="w-full relative">

                        <div className="mb-4 relative">
                            <input
                                type="text"
                                placeholder="Search Candidate"
                                value={query}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown} // Use onKeyDown instead of onKeyPress
                                className="w-96 p-2 pr-10 border rounded border-gray-400"
                            />

                            {query ? (
                                <button
                                    type="button"
                                    onClick={() => setQuery('')} // Clear the search input
                                    className="absolute inset-y-0 left-80 ml-8 flex items-center pr-3"
                                >
                                    <i className="fas fa-times text-gray-600"></i> {/* Cross Icon */}
                                </button>
                            ) : (
                                <div
                                    onClick={() => handleSearch()}
                                    className="absolute inset-y-0 left-80 ml-8 flex items-center pr-3 cursor-pointer"
                                >
                                    <i className="fas fa-search text-gray-600"></i>
                                </div>
                            )}

                            {searching && !noData && (
                                <div className="absolute mt-2 w-full bg-white shadow-lg rounded-md z-50">
                                    {/* Close button for the popup */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setQuery('')
                                            setSearching(false);
                                        }}
                                        className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-800"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                    <div className='w-52 rounded p-0 underline'>
                                        <h1 className='ml-2'>Found: {results.length} candidates</h1>
                                    </div>
                                    <table className='p-6 w-full bg-white rounded-xl shadow-md'>
                                        <thead>
                                            <tr>
                                                <th className='p-2 font-normal border-b border-gray-300'>Profile</th>
                                                <th className='p-2 font-normal border-b border-gray-300'>Candidate</th>
                                                <th className='p-2 font-normal border-b border-gray-300'>Position</th>
                                                <th className='p-2 font-normal border-b border-gray-300'>Skills</th>
                                                <th className='p-2 font-normal border-b border-gray-300'></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <SearchResults
                                                results={results}
                                                searching={searching}
                                                clickedIndex={clickedIndex}
                                                togglePopup={togglePopup}
                                                goToEditCandidate={goToEditCandidate}
                                                handleDeleteClick={handleDeleteClick}
                                                noData={noData}
                                            />
                                        </tbody>
                                    </table>
                                </div>
                            )}


                            <Modal
                                isOpen={modalIsOpen}
                                onRequestClose={closeNoDataSearchPopup}
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
                                contentLabel="No Data Found"
                            >
                                <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
                                    <div className="text-center">
                                        <h3 className="mb-4">No candidates found for "{noDataSearch}"</h3>
                                        <button
                                            onClick={closeNoDataSearchPopup}
                                            className="px-4 py-2 bg-red-500 text-white rounded"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </Modal>
                        </div>

                        <div className='mb-4 flex justify-between items-center'>
                            <div className='border border-gray-400 w-52 rounded p-2'>
                                <h1 className='ml-2'>Found: {candidates.length} candidates</h1>

                            </div>

                            <select
                                className="border border-gray-300 rounded p-1"
                                value={sortOrder}
                                onChange={handleSortChange}
                            >
                                <option value="Original">Original</option>
                                <option value="Ascending">Ascending</option>
                                <option value="Descending">Descending</option>
                            </select>
                        </div>

                        <table className='p-6 w-full bg-white rounded-xl shadow-md'>
                            <thead>
                                <tr>
                                    <th className='p-2 font-normal border-b border-gray-300'>Profile</th>
                                    <th className='p-2 font-normal border-b border-gray-300'>Candidate</th>
                                    <th className='p-2 font-normal border-b border-gray-300'>Position</th>
                                    <th className='p-2 font-normal border-b border-gray-300'>Skills</th>
                                    <th className='p-2 font-normal border-b border-gray-300'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {!searching && sortedCandidates.map((candidate, index) => (
                                    <tr key={candidate.id} className='cursor-pointer hover:bg-slate-100' onClick={() => goToViewCandidate(candidate.id)}>
                                        <td className='p-2 flex items-center justify-center'>
                                            <img src="../src/assets/ProfileImage.png" alt="ProfileImage.png" className='h-8' />
                                        </td>
                                        <td className='p-2 text-center'>
                                            {candidate.candidateName}
                                        </td>
                                        <td className='p-2 text-center'>
                                            {candidate.position}
                                        </td>
                                        <td className='p-2 text-center'>
                                            {
                                                typeof candidate.skills === 'string'
                                                    ? candidate.skills.split(/(?=[A-Z])/).join(", ")
                                                    : Array.isArray(candidate.skills)
                                                        ? (candidate.skills as string[]).join(", ")
                                                        : 'N/A'
                                            }
                                        </td>
                                        <td className='p-2 relative'>
                                            <FontAwesomeIcon icon={faEllipsisVertical} onClick={(e) => {
                                                e.stopPropagation();
                                                togglePopup(index);
                                            }} className='p-2 hover:bg-slate-200 rounded-full cursor-pointer' />

                                            {clickedIndex === index && (
                                                <div className="absolute right-0 mt-2 mr-2 z-10">
                                                    <div className="p-4 bg-white rounded-xl shadow-xl">
                                                        <div className="flex flex-col">
                                                            <div className="flex justify-between mb-2">
                                                                <div className="p-2 mr-2 flex items-center">
                                                                    <img src="../src/assets/vacancies/Edit.png" alt="Edit.png" className='h-8 mr-4' />
                                                                    <span className='mr-8 text-lg hover:text-slate-300'><a href="" onClick={(e) => { e.stopPropagation(); goToEditCandidate(candidate.id) }}>Edit</a></span>
                                                                </div>
                                                                <div className="p-2 justify-end text-end">
                                                                    <FontAwesomeIcon icon={faCircleXmark} onClick={(e) => { e.stopPropagation(); togglePopup(-1) }} className="text-red-500 h-8 mr-2 cursor-pointer" />
                                                                </div>
                                                            </div>
                                                            <div key={candidate.id} className="flex justify-between mb-2">
                                                                <div className="p-2 mr-2 flex items-center">
                                                                    <img src="../src/assets/vacancies/Delete.png" alt="Delete.png" className="h-8 mr-3" />
                                                                    <span
                                                                        className="text-lg hover:text-slate-300 cursor-pointer"
                                                                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(candidate.id, candidate.candidateName); }}
                                                                    >
                                                                        Delete
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <div className="p-2 mr-2"></div>
                                                                <div className="p-2 px-32 mr-2"></div>
                                                                <div className="p-2"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            {/* Modal for confirming deletion */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCancel}
                contentLabel="Confirm Deletion"
                ariaHideApp={false}
                className="bg-white p-5 max-w-md mx-auto my-16 shadow-lg rounded-lg relative z-60" // z-60 ensures it is above other elements
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            >
                <h2>Are you sure you want to delete candidate <strong>{candidateToDelete.candidateName}</strong>?</h2>
                <div className="flex justify-end mt-4">
                    <button onClick={handleCancel} className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mr-2">
                        Cancel
                    </button>
                    <button onClick={handleConfirm} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                        Confirm
                    </button>
                </div>
            </Modal>

            {/* Modal for Upload Attachment */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-xl font-semibold mb-4">Upload Attachment</h2>
                        <UploadAttachmentOutsideForm token={token} />
                        <div className="flex justify-end mt-4">
                            <button
                                className="btn btn-secondary"
                                onClick={handleCloseModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer
                position="top-left" // Keeps toasts in the top-right corner
                autoClose={5000} // Auto closes after 3 seconds
                hideProgressBar={false}
                newestOnTop={false} // Change this to false to allow stacking
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                limit={5} // Optionally limit the number of toasts
                style={{ top: '1em', right: '1em' }} // Adjust spacing as needed
            />

            <Dialog open={sessionOpen} onClose={handleSessionClose}>
                <DialogTitle>Session Expired</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your session has expired. Please log in again to continue using our site.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSessionClose} color="primary">
                        {/* OK */}
                        {loading ? ("Loading..") : ("Ok")}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default HomePage;
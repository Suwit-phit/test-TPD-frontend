import React, { useState } from 'react'
import Header from '../../components/Header'
import { useNavigate } from 'react-router-dom'
import { Vacancy as SearchVacancy, searchVacancies } from '../../API/searchApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { deleteVacancy } from '../../API/vacanciesApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface VacancyType {
    id: string; // UUID as string
    positionTitle: string; // Updated from title to positionTitle
    positionApplied: string; // Corresponds to position_applied from backend
    skills: string;
}

interface VacancySearchPageProps {
    token: string;
    setToken: (token: string | null) => void;  // Add this line to define the prop type
}


const VacancySearchPage: React.FC<VacancySearchPageProps> = ({ token, setToken }) => {
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchVacancy[]>([]);
    const [searching, setSearching] = useState(false);
    const [noData, setNoData] = useState(false);
    // const [countVacancy, setCountVacancy] = useState(false);
    const [noDataSearch, setNoDataSearch] = useState<string | null>(null);

    const [clickedIndex, setClickedIndex] = useState<number | null>(null);

    const [confirmData, setConfirmData] = useState<{ id: string; positionApplied: string; index: number } | null>(null);

    const [vacancies, setVacancies] = useState<VacancyType[]>([]);

    const handleSearch = async () => {
        try {
            const data = await searchVacancies(query, token);
            setResults(data);
            setSearching(true);
            // setCountVacancy(true);
            setQuery(''); // Clear the search bar after search
            console.log("data.length = ", data.length);
            setNoData(data.length === 0);
            if (data.length === 0) {
                openNoDataSearchPopup(query);
            }
        } catch (error) {
            openNoDataSearchPopup(query);
            console.error('Error fetching search results:', error);
        }
    };

    const openNoDataSearchPopup = (query: string) => {
        setNoDataSearch(query);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const togglePopup = (index: number) => {
        if (clickedIndex === index) {
            setClickedIndex(null); // Close the popup if clicking the same icon again
        } else {
            setClickedIndex(index);
        }
    };

    const closeNoDataSearchPopup = () => {
        setNoDataSearch(null);
    };

    const goToViewRecommendCan = (vacancy: VacancyType) => {
        console.log("goToViewRecommendCan");
        navigate(`/matching-candidates?title=${vacancy.positionTitle}&position=${vacancy.positionApplied}&skills=${vacancy.skills}`);
        // navigate(`/matching-candidates?title=${vacancy.title}&position=${vacancy.position}&skills=${vacancy.skills}`);
        // navigate(`/viewRecommendCan?title=${vacancy.title}&position=${vacancy.position}&skills=${vacancy.skills}`);
    };

    const openConfirmation = (id: string, positionApplied: string, index: number) => {
        setClickedIndex(null);
        setConfirmData({ id, positionApplied, index });
    };

    const closeConfirmation = () => {
        setConfirmData(null);
    };

    const handleConfirm = async () => {
        if (confirmData) {
            const { id } = confirmData;
            try {
                await deleteVacancy(id, token);
                setVacancies(vacancies.filter(vacancy => vacancy.id !== id));
                setClickedIndex(null);
                closeConfirmation();
                toast.success('Vacancy delete successfully!');
            } catch (error) {
                console.error('Error deleting vacancy:', error);
            }
        }
    };

    const goToViewVacancy = (id: string, mode: 'view' | 'edit') => {
        console.log("ID in goToViewVacancy = ", id);
        navigate(`/view-vacancy/${id}?mode=${mode}`);
    };


    return (
        <>
            <header>
                <Header
                    token={token}
                    setToken={setToken}
                    candidateButtonClass='hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'
                    vacanciesButtonClass='bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'
                />
            </header>

            {/* Replace <body> with a <main> */}
            <main className='p-6'>

                {/* <div className="flex justify-center items-center h-screen"> */}
                <div className="flex justify-center items-center mt-4">
                    <div className="flex items-center space-x-4">
                        {/* Search Input Field */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search Vacancy"
                                // onClick={() => navigate("/vacancyPage/vacancy-searchPage")}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus // This will automatically focus the input
                                className="w-96 p-2 pr-10 border rounded border-gray-400"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                                <i className="fas fa-search text-gray-600"></i>
                            </div>
                        </div>

                        {/* Buttons Positioned to the Right */}
                        <div className="flex items-center space-x-2">
                            {/* <button onClick={() => navigate('/VacancyPage')} className="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded border border-black"> */}
                            <button onClick={() => navigate('/vacancy-page')} className="hover:bg-gray-600 text-black font-bold py-2 px-4 rounded border border-black">
                                Available position
                            </button>
                            <button onClick={() => navigate('/AddVacancies')} className="hover:bg-gray-600 text-black font-bold py-2 px-4 rounded border border-black">
                                Add Vacancies
                            </button>
                        </div>
                    </div>
                </div>

                <div className='flex justify-between items-center mt-5'>
                    <div className=' flex items-center'>
                        <div className="mb-4 relative">
                            <h1>Available position</h1>
                        </div>
                    </div>
                    <div className='flex items-center space-x-2 px-2 mb-4'>
                        <h1>Total data: {results.length}</h1>
                    </div>
                </div>

                {
                    searching ? (
                        <table className='p-6 w-full bg-white rounded-xl shadow-md'>
                            <thead>
                                <tr>
                                    <th className="p-2 font-normal border-b border-gray-300">No</th>
                                    <th className='p-2 font-normal border-b border-gray-300'>Position title</th>
                                    <th className='p-2 font-normal border-b border-gray-300'>Position applied</th>
                                    {/* <th className='p-2 font-normal border-b border-gray-300'>Salary</th>
                <th className='p-2 font-normal border-b border-gray-300'>Date of application</th> */}
                                    <th className='p-2 font-normal border-b border-gray-300'>Skills</th>
                                    <th className='p-2 font-normal border-b border-gray-300' />
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                <>
                                    {noData ? (
                                        <p></p>
                                    ) : (
                                        <>
                                            {results.map((result, index) => (
                                                // <tr key={index}>
                                                <tr key={index} className='cursor-pointer hover:bg-slate-100'
                                                    onClick={() => {
                                                        // setEditMode(false); // Ensure edit mode is false for viewing
                                                        goToViewVacancy(result.id, 'view'); // Navigate with view mode
                                                    }}
                                                >
                                                    <th className="p-2">{index + 1}</th>
                                                    {/* <th className="p-2">{vacancy.id}</th> */}
                                                    <td className='p-2 text-center'>{result.positionTitle}</td>
                                                    {/* <td className='p-2 text-center'>{result.title}</td> */}
                                                    <td className='p-2 flex items-center justify-center'>
                                                        {/* <img src="../assets/ProfileImage.png" alt="ProfileImage.png" className='h-8 mr-3' /> */}
                                                        <span>{result.positionApplied}</span>
                                                        {/* <span>{result.position}</span> */}
                                                    </td>
                                                    <td className='p-2 text-center'>{result.skills}</td>
                                                    <td className='p-2 relative'>
                                                        <FontAwesomeIcon icon={faEllipsisVertical}
                                                            // onClick={() => togglePopup(index)}
                                                            onClick={(e) => { e.stopPropagation(); togglePopup(index) }}
                                                            className='p-2 hover:bg-slate-200 rounded-full cursor-pointer'
                                                        />
                                                        {clickedIndex === index && (
                                                            <div className="absolute right-0 mt-2 mr-2 z-10"> {/* Adjust mt-10 for positioning */}
                                                                <div className="p-4 bg-white rounded-xl shadow-xl">
                                                                    <div className="flex flex-col">
                                                                        {/* First Row */}
                                                                        <div className="flex justify-between mb-2">
                                                                            <div className=" p-2 mr-2 flex items-center">
                                                                                <img src="../assets/vacancies/Edit.png" alt="Edit.png" className='h-8 mr-4' />
                                                                                <span className=' mr-8 text-lg hover:text-green-400'
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();  // Prevent triggering row click
                                                                                        // setEditMode(true);    // Enable edit mode from parent
                                                                                        goToViewVacancy(result.id, 'edit');  // Navigate to edit mode
                                                                                    }}
                                                                                >
                                                                                    <a>Edit</a>
                                                                                </span>
                                                                            </div>
                                                                            <div className="p-2 justify-end text-end">
                                                                                <FontAwesomeIcon icon={faCircleXmark}
                                                                                    onClick={(e) => { e.stopPropagation(); togglePopup(-1) }}
                                                                                    className="text-red-500 h-8 mr-2 cursor-pointer"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {/* Second Row */}
                                                                        <div className="mb-2  flex items-center">
                                                                            {/* <div className="bg-gray-200 p-2 mr-2 flex items-center px-20"> */}
                                                                            <img src="../assets/vacancies/RecommendedCandidates.png" alt="RecommendedCandidates.png" className='h-8 mr-5' />
                                                                            <span className=' text-lg hover:text-green-400'>
                                                                                {/* <a href="" onClick={() => goToViewRecommendCan(result)}>
                                                                                    Recommended candidates</a> */}
                                                                                <a
                                                                                    onClick={(e) => { e.stopPropagation(); goToViewRecommendCan(result) }}
                                                                                >
                                                                                    Recommended candidates</a>
                                                                            </span>
                                                                            {/* </div> */}
                                                                        </div>

                                                                        <div className="flex justify-between mb-2">
                                                                            <div className=" p-2 mr-2 flex items-center">
                                                                                <img src="../assets/vacancies/Delete.png" alt="Delete.png" className='h-8 mr-3' />
                                                                                <span className=' text-lg hover:text-green-400 cursor-pointer'
                                                                                    onClick={(e) => { e.stopPropagation(); openConfirmation(result.id, result.positionApplied, index) }}
                                                                                >
                                                                                    Delete
                                                                                </span>
                                                                                {/* <span className=' text-lg hover:text-green-400 cursor-pointer' onClick={() => openConfirmation(result.id, result.position, index)}>Delete</span> */}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <div className="p-2 mr-2"></div>
                                                                            <div className=" p-2 px-32 mr-2"></div>
                                                                            <div className="p-2"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                </>
                            </tbody>
                        </table>
                    ) : (
                        <div className=" flex justify-center items-center py-4">
                            <div className="  flex flex-col items-center px-72">
                                <img src="../assets/vacancies/vacancySearch/seo.png" alt="VacancyNDA.png" className='h-48' />
                                <h1 className='text-center mt-2 py-2 text-3xl font-bold'>No Data</h1>
                                <h1 className='text-center text-lg'>Please Search something to make the data appear.</h1>
                            </div>
                        </div>
                    )
                }

            </main>

            {/* Confirmation dialog */}
            {confirmData && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg">
                        <p className="text-xl mb-4">Are you sure to delete vacancy {confirmData.index + 1} and "{confirmData.positionApplied}"?</p>
                        <div className="flex justify-end">
                            <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={handleConfirm}>Yes</button>
                            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeConfirmation}>No</button>
                        </div>
                    </div>
                </div>
            )}

            {/* No data search pop-up */}
            {noDataSearch && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg">
                        <h1 className=' text-center text-2xl'>NO DATA!</h1>
                        <p className="text-xl mb-4">There is no data matching your search "{noDataSearch}"</p>
                        <div className='flex justify-center'>
                            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeNoDataSearchPopup}>Close</button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </>
    )
}

export default VacancySearchPage
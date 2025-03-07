import React, { ChangeEvent, useState } from 'react';
import { toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify
import Header from '../../components/Header';
import { navigate } from 'wouter/use-browser-location';
import { addVacancy, VacancyType } from '../../API/vacanciesApi';
import axios from 'axios';

// Define Vacancy type according to the updated backend model
// interface Vacancy {
//     id: string; // UUID as string
//     title: string;
//     position: string;
//     skills: string;
//     salary: number;
//     currencyCode: string;
//     createdAt?: string; // Optional as this will be set by the backend
//     updatedAt?: string; // Optional as this will be set by the backend
// }

interface AddVacanciesProps {
    token: string;
    setToken: (token: string | null) => void;  // Add this line to define the prop type
}

const AddVacancies: React.FC<AddVacanciesProps> = ({ token, setToken }) => {
    // const [vacancy, setVacancy] = useState<Vacancy>({
    const [vacancy, setVacancy] = useState<VacancyType>({
        id: '', // UUID will be generated by the backend
        positionTitle: '',
        positionApplied: '',
        skills: '',
        salary: 0, // Default salary value
        currencyCode: 'USD' // Default currency
    });

    const currencies = ['USD', 'Baht', 'Kyat'];
    const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

    const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedCurrency(e.target.value);
        setVacancy((prevVacancy) => ({
            ...prevVacancy,
            currencyCode: e.target.value
        }));
    };

    const GoToAvailablePosition = () => {
        navigate('/VacancyPage');
    };

    const GoToAddVacancies = () => {
        navigate('/AddVacancies');
    };

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVacancy((prevVacancy) => ({
            ...prevVacancy,
            [name]: value
        }));
    };

    const GoToAddVacancyAndRecommendedCandidates = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try {
            console.log("Adding new vacancy...");
            await addVacancy(vacancy, token); // Call backend API to add vacancy
            navigate(`/matching-candidates?title=${vacancy.positionTitle}&position=${vacancy.positionApplied}&skills=${vacancy.skills}`);
            toast.success('Vacancy added successfully!'); // Success notification
        } catch (error: unknown) {
            // Ensure proper error handling with types
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data?.error || 'An error occurred while adding the vacancy';
                toast.error(errorMessage); // Show the error message from backend
            } else {
                toast.error('An unexpected error occurred.');
            }
        }
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
            <main className='p-4'>
                <div className='flex justify-end space-x-2 px-2 mb-4'>
                    <button onClick={GoToAvailablePosition} className='hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'>
                        Available positions
                    </button>
                    <button onClick={GoToAddVacancies} className='bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'>
                        Add Vacancies
                    </button>
                </div>
                <div className='px-60'>
                    <div className="rounded shadow-lg p-5">
                        {/* Form Fields */}
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <div className="p-2 mr-2">
                                    <img src="assets/vacancies/PositionTitle.png" alt="PositionTitle.png" className='h-10' />
                                </div>
                                <div className="p-2">
                                    <input
                                        placeholder='Vacancy Title'
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={vacancy.positionTitle}
                                        onChange={handleChangeInput}
                                        className="w-full px-3 py-2 mr-20 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="mr-2">
                                    <img src="assets/vacancies/Salary.png" alt="Salary.png" className='h-10' />
                                </div>
                                <div className="mr-2">
                                    <input
                                        placeholder='Salary'
                                        type="number"
                                        id="salary"
                                        name="salary"
                                        value={vacancy.salary}
                                        onChange={handleChangeInput}
                                        className="w-full px-3 py-2 mr-20 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="bg-gray-200 p-1">
                                    <select
                                        value={selectedCurrency}
                                        onChange={handleCurrencyChange}
                                        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        {currencies.map(currency => (
                                            <option key={currency} value={currency}>{currency}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Other Fields */}
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <div className="p-2 mr-2">
                                    <img src="assets/vacancies/PositionApplied.png" alt="PositionApplied.png" className='h-10' />
                                </div>
                                <div className="p-2">
                                    <input
                                        placeholder='Position Applied'
                                        type="text"
                                        id="position"
                                        name="position"
                                        value={vacancy.positionApplied}
                                        onChange={handleChangeInput}
                                        className="w-full px-3 py-2 mr-20 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center py-4">
                            <button onClick={GoToAddVacancyAndRecommendedCandidates} className='bg-blue-500 p-2 rounded text-white'>
                                Add Vacancy
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default AddVacancies;



//! Below code is good but it doesn't include every that I have set in the "model Vacancy"
// import React, { ChangeEvent, useState } from 'react'
// import Header from '../../components/Header'
// import { navigate } from 'wouter/use-browser-location'
// import { addVacancy } from '../../API/vacanciesApi';

// //! Backend
// interface Vacancy {
//     id: number;
//     title: string;
//     position: string;
//     skills: string;
// }

// const AddVacancies = () => {
//     const [vacancy, setVacancy] = useState<Vacancy>({
//         id: 0,
//         title: '',
//         position: '',
//         skills: ''
//     });

//     const currencies = ['USD', 'Baht', 'Kyat'];
//     const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

//     const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
//         setSelectedCurrency(e.target.value);
//     };

//     const GoToAvailableposition = () => {
//         navigate('/VacancyPage')
//     }
//     const GoToAddVacancies = () => {
//         navigate('/AddVacancies')
//     }

//     const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setVacancy(prevVacancy => ({
//             ...prevVacancy,
//             [name]: value
//         }));
//     };

//     const GoToAddVacancyAndRecommendedCandidates = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
//     // const GoToAddVacancyAndRecommendedCandidates = async (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//     // const GoToAddVacancyAndRecommendedCandidates = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
//     // // const GoToAddVacancyAndRecommendedCandidates = async (e: FormEvent<HTMLFormElement>) => {
//     //     e.preventDefault();
//         try {
//             console.log("handleAddVacancy in AddNewVacancy.tsx");
//             await addVacancy(vacancy);
//             // const matchingCandidatesData = await fetchMatchingCandidates(vacancy);
//             // console.log("matchingCandidatesData = ", matchingCandidatesData);
//             // setMatchingCandidates(matchingCandidatesData);
//             // Navigate to MatchingCandidates page with vacancy data as query parameters
//             // navigate('/VacancyPage');
//             navigate(`/matching-candidates?title=${vacancy.title}&position=${vacancy.position}&skills=${vacancy.skills}`);
//             // navigate('/matching-candidates', { replace: true, state: { vacancy } });
//         } catch (error) {
//             console.error('Error fetching matching candidates:', error);
//         }
//     };
//     // const GoToRecommendedCandidates = () => {
//     //     navigate("/RecommendedCandidates");
//     // }

//     return (
//         <>
//             <header>
//                 <Header
//                     candidateButtonClass='hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'
//                     vacanciesButtonClass='bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'
//                 />
//             </header>
//             <main className=' p-4'>
//                 <div className='flex justify-end space-x-2 px-2 mb-4'>
//                     <button onClick={GoToAvailableposition} className='hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'>Available position</button>
//                     <button onClick={GoToAddVacancies} className='bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'>Add Vacancies</button>
//                 </div>
//                 <div className=' px-60'>
//                     <div className="rounded shadow-lg p-5">
//                         {/* <div className="border border-gray-300 rounded shadow-lg p-4"> */}
//                         <div className="flex justify-between">
//                             <div className="flex items-center">
//                                 {/* First column */}
//                                 <div className=" p-2 mr-2">
//                                     {/* <div className="bg-gray-200 p-2 mr-2"> */}
//                                     <img src="assets/vacancies/PositionTitle.png" alt="PositionTitle.png" className='h-10' />
//                                 </div>
//                                 {/* Second column */}
//                                 <div className=" p-2">
//                                     <input
//                                         placeholder='Position Title'
//                                         type="text"
//                                         id="title"
//                                         name="title"
//                                         // value={formData.positionApplied}
//                                         value={vacancy.title}
//                                         onChange={handleChangeInput}
//                                         className="w-full px-3 py-2 mr-20 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                     />
//                                 </div>
//                             </div>
//                             <div className="flex items-center">
//                                 {/* Third column */}
//                                 <div className="mr-2">
//                                     <img src="../src/assets/vacancies/Salary.png" alt="Salary.png" className='h-10' />
//                                 </div>
//                                 {/* Fourth column */}
//                                 <div className="mr-2">
//                                     {/* <div className="bg-gray-200 p-2 mr-2 px-20"> */}
//                                     <input
//                                         placeholder='Salary'
//                                         type="text"
//                                         id="salary"
//                                         name="salary"
//                                         // value={formData.positionApplied}
//                                         onChange={handleChangeInput}
//                                         className="w-full px-3 py-2 mr-20 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                     />
//                                 </div>
//                                 {/* Fifth column */}
//                                 <div className="bg-gray-200 p-1">
//                                     <div className="relative">
//                                         <select
//                                             value={selectedCurrency}
//                                             onChange={handleChange}
//                                             className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
//                                         >
//                                             {currencies.map(currency => (
//                                                 <option key={currency} value={currency}>{currency}</option>
//                                             ))}
//                                         </select>
//                                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                                             <svg
//                                                 className="fill-current h-4 w-4"
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 viewBox="0 0 20 20"
//                                             >
//                                                 <path
//                                                     fillRule="evenodd"
//                                                     d="M9.293 14.293a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L10 11.586l-3.293-3.293a1 1 0 1 0-1.414 1.414l4 4z"
//                                                 />
//                                             </svg>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="flex justify-between">
//                             <div className="flex items-center">
//                                 {/* First column */}
//                                 <div className=" p-2 mr-2">
//                                     <img src="../src/assets/vacancies/PositionApplied.png" alt="PositionApplied.png" className='h-10' />
//                                 </div>
//                                 {/* Second column */}
//                                 <div className=" p-2">
//                                     <input
//                                         placeholder='Position Applied'
//                                         type="text"
//                                         id="position"
//                                         name="position"
//                                         // value={formData.positionApplied}
//                                         value={vacancy.position}
//                                         onChange={handleChangeInput}
//                                         className="w-full px-3 py-2 mr-20 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                     />
//                                 </div>
//                             </div>
//                             <div className="flex items-center" style={{ marginRight: '98px' }}>
//                                 {/* Third column */}
//                                 <div className="mr-2">
//                                     <img src="../src/assets/vacancies/Dateofapplication.png" alt="Salary.png" className='h-10' />
//                                 </div>
//                                 {/* Fourth column */}
//                                 <div>
//                                     {/* <div className="bg-gray-200 p-2 mr-2 px-20"> */}
//                                     <input
//                                         placeholder='Date of application'
//                                         type="date"
//                                         id="positionApplied"
//                                         name="positionApplied"
//                                         // value={formData.positionApplied}
//                                         // onChange={handleChange}
//                                         className="w-full px-3 py-2 mr-32 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                         style={{ marginRight: '122px' }}
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="flex justify-between">
//                             <div className="flex items-center">
//                                 {/* First column */}
//                                 <div className=" p-2 mr-2">
//                                     <img src="../src/assets/vacancies/Nationalities.png" alt="PositionApplied.png" className='h-10' />
//                                 </div>
//                                 {/* Second column */}
//                                 <div className=" p-2">
//                                     <input
//                                         // placeholder='Nationalities'
//                                         placeholder='Skills'
//                                         type="text"
//                                         id="skills"
//                                         name="skills"
//                                         // value={formData.positionApplied}
//                                         value={vacancy.skills}
//                                         onChange={handleChangeInput}
//                                         className="w-full px-3 py-2 mr-20 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                         <div className=" flex justify-center items-center py-4">
//                             <div className="  flex flex-col items-center px-72">
//                                 <button onClick={GoToAddVacancyAndRecommendedCandidates} className=' bg-blue-500 p-2 rounded text-white'>Add</button>
//                             </div>
//                         </div>
//                         <br />
//                     </div>
//                 </div>
//             </main>
//         </>
//     )
// }

// export default AddVacancies
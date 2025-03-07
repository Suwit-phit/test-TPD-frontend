import React, { ChangeEvent, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { addVacancy, VacancyType } from '../../API/vacanciesApi';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CreateVacancyProps {
    token: string;
    setToken: (token: string | null) => void;
}

const CreateVacancy: React.FC<CreateVacancyProps> = ({ token, setToken }) => {
    const [vacancy, setVacancy] = useState<VacancyType>({
        id: '',
        positionTitle: '',
        salary: 0,
        currencyCode: 'USD',
        positionApplied: '',
        dateOfApplication: '',
        skills: '',
    });

    const currencies = ['USD', 'Baht', 'EUR', 'GBP', 'JPY', 'AUD', 'Kyat'];
    const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
    const navigate = useNavigate();

    const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedCurrency(e.target.value);
        setVacancy((prevVacancy) => ({
            ...prevVacancy,
            currencyCode: e.target.value
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setVacancy((prevVacancy) => ({
            ...prevVacancy,
            [name]: value,
        }));
    };

    // Validation function
    const validateFields = () => {
        const { positionTitle, salary, positionApplied, dateOfApplication, skills } = vacancy;
        if (!positionTitle || !salary || !positionApplied || !dateOfApplication || !skills) {
            toast.error('All fields must be filled in before creating a vacancy!');
            return false;
        }
        return true;
    };

    const GoToAddVacancyAndRecommendedCandidates = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        // Check if all fields are valid before submitting
        if (!validateFields()) return;

        try {
            console.log("Adding new vacancy...");
            await addVacancy(vacancy, token); // Call backend API to add vacancy
            toast.success('Vacancy created successfully!'); // Success notification
            setTimeout(() => {
                navigate(`/vacancy-page/matching-candidates?title=${vacancy.positionTitle}&position=${vacancy.positionApplied}&skills=${vacancy.skills}`);
            }, 2000);
        } catch (error: unknown) {
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
            <div className="bg-white p-8 rounded-md shadow-md w-2/3 mx-auto mt-8">
                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Vacancy Title */}
                    <div className="flex items-center space-x-3">
                        <img src="assets/vacancies/PositionTitle.png" alt="PositionTitle.png" className='h-10' />
                        <input
                            required
                            type="text"
                            name="positionTitle"
                            placeholder="Position Title"
                            value={vacancy.positionTitle}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Salary with Currency Dropdown */}
                    <div className="flex items-center space-x-3">
                        <img src="assets/vacancies/Salary.png" alt="Salary.png" className='h-10' />
                        <input
                            required
                            type="number"
                            name="salary"
                            placeholder="Salary"
                            value={vacancy.salary}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            required
                            value={selectedCurrency}
                            onChange={handleCurrencyChange}
                            className="border appearance-none w-24 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {currencies.map(currency => (
                                <option key={currency} value={currency}>{currency}</option>
                            ))}
                        </select>
                    </div>

                    {/* Position Applied */}
                    <div className="flex items-center space-x-3">
                        <img src="assets/vacancies/PositionApplied.png" alt="PositionApplied.png" className='h-10' />
                        <input
                            required
                            type="text"
                            name="positionApplied"
                            placeholder="Position Applied"
                            value={vacancy.positionApplied}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Date of Vacancy Opening */}
                    <div className="flex items-center space-x-3">
                        <img src="assets/vacancies/Dateofapplication.png" alt="Dateofapplication.png" className='h-10' />
                        <input
                            required
                            type="date"
                            name="dateOfApplication"
                            value={vacancy.dateOfApplication}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Skills Required */}
                    <div className="flex items-center space-x-3">
                        <img src="assets/vacancies/skills.png" alt="skills.png" className='h-10' />
                        <input
                            required
                            type="text"
                            name="skills"
                            placeholder='Example: skill abc, skill abc, skill abc'
                            value={vacancy.skills}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex justify-center">
                    <button className="bg-[#00324E] text-white px-6 py-2 rounded-lg hover:bg-[#006EAB] transition-all"
                        onClick={GoToAddVacancyAndRecommendedCandidates}
                    >
                        Create Vacancy
                    </button>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default CreateVacancy;


//? Below code is like upper code but without test the input is fill out or not
// import React, { ChangeEvent, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Header from '../../components/Header';
// import { addVacancy, VacancyType } from '../../API/vacanciesApi';

// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const CreateVacancy: React.FC = () => {
//     // const { id } = useParams<{ id: string }>(); // Get the vacancy ID from the URL
//     // const [searchParams] = useSearchParams(); // Get query parameters
//     // const mode = searchParams.get('mode'); // Get 'mode' query parameter
//     // const [editMode, setEditMode] = useState<boolean>(false); // State for edit mode

//     const [vacancy, setVacancy] = useState<VacancyType>({
//         id: '',
//         positionTitle: '',
//         salary: 0,
//         currencyCode: 'USD',
//         positionApplied: '',
//         dateOfApplication: '',
//         skills: '',
//     });

//     // const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
//     //     const { name, value } = e.target;
//     //     setVacancy((prevVacancy) => ({
//     //         ...prevVacancy,
//     //         [name]: value
//     //     }));
//     // };

//     const currencies = ['USD', 'Baht', 'EUR', 'GBP', 'JPY', 'AUD', 'Kyat'];
//     const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
//     const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
//         setSelectedCurrency(e.target.value);
//         setVacancy((prevVacancy) => ({
//             ...prevVacancy,
//             currencyCode: e.target.value
//         }));
//     };

//     const navigate = useNavigate();

//     // Set editMode based on the query parameter
//     // useEffect(() => {
//     //     if (mode === 'edit') {
//     //         setEditMode(true); // Enable edit mode
//     //     } else {
//     //         setEditMode(false); // Default to view mode
//     //     }
//     // }, [mode]);

//     // Load vacancy data
//     // useEffect(() => {
//     //     const loadVacancy = async () => {
//     //         try {
//     //             const vacancyData = await fetchVacancyById(id!);
//     //             setVacancy(vacancyData);
//     //         } catch (error) {
//     //             console.error('Error loading vacancy:', error);
//     //         }
//     //     };

//     //     loadVacancy();
//     // }, [id]);

//     // Update handler for inputs
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setVacancy((prevVacancy) => ({
//             ...prevVacancy,
//             [name]: value,
//         }));
//     };

//     // const handleVacancyUpdate = (e: React.FormEvent<HTMLFormElement>) => {
//     //     e.preventDefault();
//     //     handleUpdate();
//     // };
//     // const handleVacancyUpdate = () => {
//     //     handleUpdate();
//     // };

//     // const handleUpdate = async () => {
//     //     if (vacancy) {
//     //         try {
//     //             const vacancyResponse = await updateVacancy(id!, vacancy);
//     //             setVacancy(vacancyResponse!);
//     //             // setVacancy(vacancyResponse || null);
//     //             toast.success('Vacancy update successfully!');
//     //             // navigate("/vacancy-page");
//     //             // Delay the navigation to give time for the toast to show
//     //             setTimeout(() => {
//     //                 navigate("/vacancy-page");
//     //             }, 2000); // 2 seconds delay (you can adjust this)
//     //         } catch (error) {
//     //             console.error('Error updating profile:', error);
//     //             alert('Failed to update vacancy');
//     //         }
//     //     }
//     // }

//     const GoToAddVacancyAndRecommendedCandidates = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
//         e.preventDefault();
//         try {
//             console.log("Adding new vacancy...");
//             await addVacancy(vacancy); // Call backend API to add vacancy
//             // navigate(`/vacancy-page/matching-candidates?title=${vacancy.positionTitle}&position=${vacancy.positionApplied}&skills=${vacancy.skills}`);
//             toast.success('Vacancy created successfully!'); // Success notification
//             setTimeout(() => {
//                 // navigate("/vacancy-page");
//                 navigate(`/vacancy-page/matching-candidates?title=${vacancy.positionTitle}&position=${vacancy.positionApplied}&skills=${vacancy.skills}`);
//             }, 2000);
//         } catch (error: unknown) {
//             // Ensure proper error handling with types
//             if (axios.isAxiosError(error) && error.response) {
//                 const errorMessage = error.response.data?.error || 'An error occurred while adding the vacancy';
//                 toast.error(errorMessage); // Show the error message from backend
//             } else {
//                 toast.error('An unexpected error occurred.');
//             }
//         }
//     };

//     return (
//         <>
//             <header>
//                 <Header
//                     candidateButtonClass='hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'
//                     vacanciesButtonClass='bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'
//                 />
//             </header>
//             <div className="bg-white p-8 rounded-md shadow-md w-2/3 mx-auto mt-8">
//                 <div className="grid grid-cols-2 gap-6 mb-6">
//                     {/* Vacancy Title */}
//                     <div className="flex items-center space-x-3">
//                         <img src="assets/vacancies/PositionTitle.png" alt="PositionTitle.png" className='h-10' />
//                         <input
//                             required
//                             type="text"
//                             name="positionTitle"
//                             placeholder="Position Title"
//                             value={vacancy.positionTitle}
//                             onChange={handleChange}
//                             className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         // disabled={!editMode} // Disable input based on editMode
//                         />
//                     </div>

//                     {/* Salary with Currency Dropdown */}
//                     <div className="flex items-center space-x-3">
//                         <img src="../src/assets/vacancies/Salary.png" alt="Salary.png" className='h-10' />
//                         <input
//                             required
//                             type="number"
//                             name="salary"
//                             placeholder="Salary"
//                             value={vacancy.salary}
//                             onChange={handleChange}
//                             className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         // disabled={!editMode} // Disable input based on editMode
//                         />
//                         {/* <select
//                             name="currencyCode"
//                             value={vacancy.currencyCode}
//                             onChange={handleChange}
//                             className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         // disabled={!editMode} // Disable if not in edit mode
//                         >
//                             <option value="USD">USD</option>
//                             <option value="EUR">EUR</option>
//                             <option value="GBP">GBP</option>
//                             <option value="JPY">JPY</option>
//                             <option value="AUD">AUD</option>
//                         </select> */}
//                         <select
//                             required
//                             value={selectedCurrency}
//                             onChange={handleCurrencyChange}
//                             className="border appearance-none w-24 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         // className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
//                         >
//                             {currencies.map(currency => (
//                                 <option key={currency} value={currency}>{currency}</option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Position Applied */}
//                     <div className="flex items-center space-x-3">
//                         <img src="../src/assets/vacancies/PositionApplied.png" alt="PositionApplied.png" className='h-10' />
//                         <input
//                             required
//                             type="text"
//                             name="positionApplied"
//                             placeholder="Position Applied"
//                             value={vacancy.positionApplied}
//                             onChange={handleChange}
//                             className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         // disabled={!editMode} // Disable if not in edit mode
//                         />
//                     </div>

//                     {/* Date of Vacancy Opening */}
//                     <div className="flex items-center space-x-3">
//                         <img src="../src/assets/vacancies/Dateofapplication.png" alt="Dateofapplication.png" className='h-10' />
//                         <input
//                             required
//                             type="date"
//                             name="dateOfApplication"
//                             value={vacancy.dateOfApplication}
//                             onChange={handleChange}
//                             className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         // disabled={!editMode} // Disable if not in edit mode
//                         />
//                     </div>

//                     {/* Skills Required */}
//                     <div className="flex items-center space-x-3">
//                         <img src="../src/assets/vacancies/skills.png" alt="skills.png" className='h-10' />
//                         <input
//                             required
//                             type="text"
//                             name="skills"
//                             // placeholder="Skills Required"
//                             placeholder='Example: skill abc, skill abc, skill abc'
//                             value={vacancy.skills}
//                             onChange={handleChange}
//                             className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         // disabled={!editMode} // Disable if not in edit mode
//                         />
//                     </div>
//                 </div>

//                 <div className="flex justify-center">
//                     {/* <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all" */}
//                     <button className="bg-[#00324E] text-white px-6 py-2 rounded-lg hover:bg-[#006EAB] transition-all"
//                         // onClick={handleVacancyUpdate}
//                         onClick={GoToAddVacancyAndRecommendedCandidates}
//                     >
//                         Create Vacancy
//                     </button>
//                 </div>

//                 {/* {editMode && (
//                     <div className="flex justify-center">
//                         <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all"
//                             onClick={handleVacancyUpdate}
//                         >
//                             Update Vacancy
//                         </button>
//                     </div>
//                 )} */}
//             </div>
//             <ToastContainer />
//         </>
//     );
// };

// export default CreateVacancy;
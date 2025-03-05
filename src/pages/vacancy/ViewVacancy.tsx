import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import { fetchVacancyById, updateVacancy, VacancyType } from '../../API/vacanciesApi';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ViewVacancyProps {
    token: string;
    setToken: (token: string | null) => void;  // Add this line to define the prop type
}

const ViewVacancy: React.FC<ViewVacancyProps> = ({ token, setToken }) => {
    const { id } = useParams<{ id: string }>(); // Get the vacancy ID from the URL
    const [searchParams] = useSearchParams(); // Get query parameters
    const mode = searchParams.get('mode'); // Get 'mode' query parameter
    const [editMode, setEditMode] = useState<boolean>(false); // State for edit mode

    const [vacancy, setVacancy] = useState<VacancyType>({
        id: '',
        positionTitle: '',
        salary: 0,
        currencyCode: 'USD',
        positionApplied: '',
        dateOfApplication: '',
        skills: '',
    });

    const navigate = useNavigate();

    // Set editMode based on the query parameter
    useEffect(() => {
        if (mode === 'edit') {
            setEditMode(true); // Enable edit mode
        } else {
            setEditMode(false); // Default to view mode
        }
    }, [mode]);

    // Load vacancy data
    useEffect(() => {
        const loadVacancy = async () => {
            try {
                const vacancyData = await fetchVacancyById(id!, token);
                setVacancy(vacancyData);
            } catch (error) {
                console.error('Error loading vacancy:', error);
            }
        };

        loadVacancy();
    }, [id]);

    // Update handler for inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setVacancy((prevVacancy) => ({
            ...prevVacancy,
            [name]: value,
        }));
    };

    // const handleVacancyUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     handleUpdate();
    // };
    const handleVacancyUpdate = () => {
        handleUpdate();
    };

    const handleUpdate = async () => {
        if (vacancy) {
            try {
                const vacancyResponse = await updateVacancy(id!, vacancy, token);
                setVacancy(vacancyResponse!);
                // setVacancy(vacancyResponse || null);
                toast.success('Vacancy update successfully!');
                // navigate("/vacancy-page");
                // Delay the navigation to give time for the toast to show
                setTimeout(() => {
                    navigate("/vacancy-page");
                }, 2000); // 2 seconds delay (you can adjust this)
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Failed to update vacancy');
            }
        }
    }

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
                        <img src="../src/assets/vacancies/PositionTitle.png" alt="PositionTitle.png" className='h-10' />
                        <input
                            type="text"
                            name="positionTitle"
                            placeholder="Position Title"
                            value={vacancy.positionTitle}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!editMode} // Disable input based on editMode
                        />
                    </div>

                    {/* Salary with Currency Dropdown */}
                    <div className="flex items-center space-x-3">
                        <img src="../src/assets/vacancies/Salary.png" alt="Salary.png" className='h-10' />
                        <input
                            type="number"
                            name="salary"
                            placeholder="Salary"
                            value={vacancy.salary}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!editMode} // Disable input based on editMode
                        />
                        <select
                            name="currencyCode"
                            value={vacancy.currencyCode}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!editMode} // Disable if not in edit mode
                        >
                            <option value="USD">USD</option>
                            <option value="USD">Baht</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="JPY">JPY</option>
                            <option value="AUD">AUD</option>
                            <option value="AUD">Kyat</option>
                        </select>
                    </div>

                    {/* Position Applied */}
                    <div className="flex items-center space-x-3">
                        <img src="../src/assets/vacancies/PositionApplied.png" alt="PositionApplied.png" className='h-10' />
                        <input
                            type="text"
                            name="positionApplied"
                            placeholder="Position Applied"
                            value={vacancy.positionApplied}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!editMode} // Disable if not in edit mode
                        />
                    </div>

                    {/* Date of Vacancy Opening */}
                    <div className="flex items-center space-x-3">
                        <img src="../src/assets/vacancies/Dateofapplication.png" alt="Dateofapplication.png" className='h-10' />
                        <input
                            type="date"
                            name="dateOfApplication"
                            value={vacancy.dateOfApplication}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!editMode} // Disable if not in edit mode
                        />
                    </div>

                    {/* Skills Required */}
                    <div className="flex items-center space-x-3">
                        <img src="../src/assets/vacancies/skills.png" alt="skills.png" className='h-10' />
                        <input
                            type="text"
                            name="skills"
                            placeholder="Skills Required"
                            value={vacancy.skills}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!editMode} // Disable if not in edit mode
                        />
                    </div>
                </div>

                {editMode && (
                    <div className="flex justify-center">
                        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all"
                            onClick={handleVacancyUpdate}
                        >
                            Update Vacancy
                        </button>
                    </div>
                )}
            </div>
            <ToastContainer />
        </>
    );
};

export default ViewVacancy;


// //! Fix edit input and click button update vacancy
// import React, { useEffect, useState } from 'react';
// // import { FaBriefcase, FaDollarSign, FaCalendarAlt, FaLaptop, FaGlobe } from 'react-icons/fa';
// import { useParams, useSearchParams } from 'react-router-dom';
// import Header from '../../components/Header';
// import { fetchVacancyById, VacancyType } from '../../API/vacanciesApi';

// // interface ViewVacancyProps {
// //     editMode: boolean;
// // }

// // // const ViewVacancy: React.FC = () => {
// // const ViewVacancy: React.FC<ViewVacancyProps> = ({ editMode }) => {
// //     const { id } = useParams<{ id: string }>();

// const ViewVacancy: React.FC = () => {
//     const { id } = useParams<{ id: string }>();  // Get the vacancy ID from the URL
//     const [searchParams] = useSearchParams();    // Get query parameters
//     const mode = searchParams.get('mode');       // Get 'mode' query parameter
//     const [editMode, setEditMode] = useState<boolean>(false);  // State for edit mode

//     const [vacancy, setVacancy] = useState<VacancyType | null>(null);

//     // Set editMode based on the query parameter
//     // useEffect(() => {
//     //     if (mode === 'edit') {
//     //         setEditMode(true);  // Enable edit mode
//     //     } else {
//     //         setEditMode(false); // Default to view mode
//     //     }
//     // }, [mode]);  // Effect will run whenever the mode changes

//     // useEffect(() => {
//     //     const loadVacancy = async () => {
//     //         try {
//     //             // const vacancyData = await fetchVacancyById(id || "");
//     //             const vacancyData = await fetchVacancyById(id!);
//     //             setVacancy(vacancyData)
//     //             // Example logic: set editMode based on some condition
//     //             if (mode === 'edit') {
//     //                 setEditMode(true);  // Enable edit mode
//     //             } else {
//     //                 setEditMode(false); // Default to view mode
//     //             }
//     //         } catch (error) {
//     //             console.error('Error loading vacancy:', error);
//     //         }
//     //     };

//     //     loadVacancy();
//     // }, [id, mode]); // The hook will trigger when id or mode changes

//     // Set editMode based on the query parameter
//     useEffect(() => {
//         console.log('Mode:', mode); // Debugging mode
//         if (mode === 'edit') {
//             setEditMode(true);  // Enable edit mode
//             console.log('Edit mode enabled');
//         } else {
//             setEditMode(false); // Default to view mode
//             console.log('Edit mode disabled');
//         }
//     }, [mode]);  // Effect will run whenever the mode changes

//     useEffect(() => {
//         const loadVacancy = async () => {
//             try {
//                 const vacancyData = await fetchVacancyById(id!);
//                 setVacancy(vacancyData);
//             } catch (error) {
//                 console.error('Error loading vacancy:', error);
//             }
//         };

//         loadVacancy();
//     }, [id]);

//     return (
//         <>
//             <header>
//                 <Header
//                     candidateButtonClass='hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'
//                     vacanciesButtonClass='bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'
//                 />
//             </header>
//             {/* <div>ViewVacancy = {id}</div>
//             <div>currencyCode = {vacancy?.currencyCode}</div> */}
//             <div className="bg-white p-8 rounded-md shadow-md w-2/3 mx-auto mt-8">
//                 <div className="grid grid-cols-2 gap-6 mb-6">
//                     {/* Vacancy Title */}
//                     <div className="flex items-center space-x-3">
//                         {/* <FaBriefcase size={30} /> */}
//                         <img src="../src/assets/vacancies/PositionTitle.png" alt="PositionTitle.png" className='h-10' />
//                         <input
//                             type="text"
//                             placeholder="Position Title"
//                             value={vacancy?.positionTitle || ''}
//                             className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             disabled={!editMode}  // Disable input based on editMode
//                         />
//                     </div>

//                     {/* Salary with Currency Dropdown */}
//                     <div className="flex items-center space-x-3">
//                         {/* <FaDollarSign size={30} /> */}
//                         <img src="../src/assets/vacancies/Salary.png" alt="Salary.png" className='h-10' />
//                         <input
//                             type="number"
//                             placeholder="Salary"
//                             value={vacancy?.salary || 0}
//                             className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             disabled={!editMode}  // Disable input based on editMode
//                         />
//                         <select className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             value={vacancy?.currencyCode || 'USD'}
//                             disabled={!editMode}  // Disable if not in edit mode
//                         >
//                             <option value="USD">USD</option>
//                             <option value="EUR">EUR</option>
//                             <option value="GBP">BAHT</option>
//                             <option value="JPY">JPY</option>
//                             <option value="AUD">AUD</option>
//                             <option value="Tes">Tes</option>
//                         </select>

//                     </div>

//                     {/* Position Applied */}
//                     <div className="flex items-center space-x-3">
//                         {/* <FaLaptop size={30} /> */}
//                         <img src="../src/assets/vacancies/PositionApplied.png" alt="PositionApplied.png" className='h-10' />
//                         <input
//                             type="text"
//                             placeholder="Position Applied"
//                             value={vacancy?.positionApplied || ''}
//                             disabled={!editMode}  // Disable if not in edit mode
//                             className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     {/* Date of Vacancy Opening */}
//                     <div className="flex items-center space-x-3">
//                         {/* <FaCalendarAlt size={30} /> */}
//                         <img src="../src/assets/vacancies/Dateofapplication.png" alt="PositionApplied.png" className='h-10' />
//                         <input
//                             type="date"
//                             value={vacancy?.dateOfApplication || ''}
//                             disabled={!editMode}  // Disable if not in edit mode
//                             className="cursor-pointer border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     {/* Skills Required */}
//                     <div className="flex items-center space-x-3">
//                         {/* <FaGlobe size={30} /> */}
//                         <img src="../src/assets/vacancies/skills.png" alt="PositionApplied.png" className='h-10' />
//                         <input
//                             type="text"
//                             placeholder="Skills Required"
//                             value={vacancy?.skills || ''}
//                             disabled={!editMode}  // Disable if not in edit mode
//                             className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>
//                 </div>

//                 {/* Center the button */}
//                 {/* <div className="flex justify-center">
//                     <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all">
//                         Add Vacancy
//                     </button>
//                 </div> */}
//                 {editMode && (
//                     <div className="flex justify-center">
//                         <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all">
//                             Update Vacancy
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// };

// export default ViewVacancy;

//! Below code is like upper code but without mode edit or view
// //! Below code currencies hardcorded
// import React from 'react';
// // import { FaBriefcase, FaDollarSign, FaCalendarAlt, FaLaptop, FaGlobe } from 'react-icons/fa';
// import { useParams } from 'react-router-dom';
// import Header from '../../components/Header';

// interface ViewVacancyProps {
//     editMode: boolean;
// }

// // const ViewVacancy: React.FC = () => {
// const ViewVacancy: React.FC<ViewVacancyProps> = ({ editMode }) => {
//     const { id } = useParams<{ id: string }>();

//     return (
//         <>
//             <header>
//                 <Header
//                     candidateButtonClass='hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'
//                     vacanciesButtonClass='bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'
//                 />
//             </header>
//             <div>ViewVacancy = {id}</div>
//             <div className="bg-white p-8 rounded-md shadow-md w-2/3 mx-auto">
//                 <div className="grid grid-cols-2 gap-6 mb-6">
//                     {/* Vacancy Title */}
//                     <div className="flex items-center space-x-3">
//                         {/* <FaBriefcase size={30} /> */}
//                         <img src="../src/assets/vacancies/PositionTitle.png" alt="PositionTitle.png" className='h-10' />
//                         <input
//                             type="text"
//                             placeholder="Position Title"
//                             className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             // disabled={!editMode}  // Disable input based on editMode
//                         />
//                     </div>

//                     {/* Salary with Currency Dropdown */}
//                     <div className="flex items-center space-x-3">
//                         {/* <FaDollarSign size={30} /> */}
//                         <img src="../src/assets/vacancies/Salary.png" alt="Salary.png" className='h-10' />
//                         <input
//                             type="number"
//                             placeholder="Salary"
//                             className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             // disabled={!editMode}  // Disable input based on editMode
//                         />
//                         <select className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
//                             <option value="USD">USD</option>
//                             <option value="EUR">EUR</option>
//                             <option value="GBP">BAHT</option>
//                             <option value="JPY">JPY</option>
//                             <option value="AUD">AUD</option>
//                         </select>
//                     </div>

//                     {/* Position Applied */}
//                     <div className="flex items-center space-x-3">
//                         {/* <FaLaptop size={30} /> */}
//                         <img src="../src/assets/vacancies/PositionApplied.png" alt="PositionApplied.png" className='h-10' />
//                         <input
//                             type="text"
//                             placeholder="Position Applied"
//                             className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     {/* Date of Vacancy Opening */}
//                     <div className="flex items-center space-x-3">
//                         {/* <FaCalendarAlt size={30} /> */}
//                         <img src="../src/assets/vacancies/Dateofapplication.png" alt="PositionApplied.png" className='h-10' />
//                         <input
//                             type="date"
//                             className="cursor-pointer border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     {/* Skills Required */}
//                     <div className="flex items-center space-x-3">
//                         {/* <FaGlobe size={30} /> */}
//                         <img src="../src/assets/vacancies/skills.png" alt="PositionApplied.png" className='h-10' />
//                         <input
//                             type="text"
//                             placeholder="Skills Required"
//                             className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>
//                 </div>

//                 {/* Center the button */}
//                 {/* <div className="flex justify-center">
//                     <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all">
//                         Add Vacancy
//                     </button>
//                 </div> */}
//                 {editMode && (
//                     <div className="flex justify-center">
//                         <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all">
//                             Add Vacancy
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// };

// export default ViewVacancy;
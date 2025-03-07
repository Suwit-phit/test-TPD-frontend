import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
// import { navigate } from 'wouter/use-browser-location'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
// import ShowConfirmationDialog from '../../components/ShowConfirmationDialog';
import { deleteVacancy, fetchVacancy } from '../../API/vacanciesApi';
// import ReactLoading from 'react-loading';
// import { ClipLoader } from 'react-spinners';
// import { Circles } from 'react-loader-spinner';
import { BallSpinner } from 'react-spinners-kit'; // Import a unique spinner
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// interface VacancyType {
//   id: number;
//   title: string;
//   position: string;
//   skills: string;
// }

interface VacancyType {
  id: string; // UUID as string
  positionTitle: string; // Updated from title to positionTitle
  positionApplied: string; // Corresponds to position_applied from backend
  skills: string;
}

interface VacancyPageProps {
  token: string;
  setToken: (token: string | null) => void;  // Add this line to define the prop type
}

// interface VacancyPageProps {
//   setEditMode: (value: boolean) => void; // Add prop type for setEditMode
// }

// const VacancyPage = () => {
// const VacancyPage: React.FC<VacancyPageProps> = ({ setEditMode }) => {
const VacancyPage: React.FC<VacancyPageProps> = ({ token, setToken }) => {

  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [confirmData, setConfirmData] = useState<{ id: string; positionApplied: string; index: number } | null>(null);
  const [noDataSearch, setNoDataSearch] = useState<string | null>(null);

  //!Backend
  const [vacancies, setVacancies] = useState<VacancyType[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // State to track loading

  const navigate = useNavigate();

  const togglePopup = (index: number) => {
    if (clickedIndex === index) {
      setClickedIndex(null); // Close the popup if clicking the same icon again
    } else {
      setClickedIndex(index);
    }
  };

  const GoToCreateVacancies = () => {
    navigate('/create-vacancy')
  }
  // const GoToAddVacancies = () => {
  //   navigate('/AddVacancies')
  // }

  // const confirmDelete = async (id: number) => {
  //   try {
  //     await deleteVacancy(id);
  //     setVacancies(vacancies.filter(vacancy => vacancy.id !== id));
  //     setClickedIndex(null);
  //   } catch (error) {
  //     console.error('Error deleting vacancy:', error);
  //   }
  // };
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

  const closeNoDataSearchPopup = () => {
    setNoDataSearch(null);
  };

  // const goToViewVacancy = (id: string) => {
  //   console.log("ID in goToViewCandidate = ", id);
  //   navigate(`/view-vacancy/${id}`);
  // };
  const goToViewVacancy = (id: string, mode: 'view' | 'edit') => {
    console.log("ID in goToViewVacancy = ", id);
    navigate(`/view-vacancy/${id}?mode=${mode}`);
  };

  const goToViewRecommendCan = (vacancy: VacancyType) => {
    console.log("goToViewRecommendCan");
    navigate(`/vacancy-page/matching-candidates?title=${vacancy.positionTitle}&position=${vacancy.positionApplied}&skills=${vacancy.skills}`);
    // navigate(`/matching-candidates?title=${vacancy.positionTitle}&position=${vacancy.positionApplied}&skills=${vacancy.skills}`);
    // navigate(`/matching-candidates?title=${vacancy.title}&position=${vacancy.position}&skills=${vacancy.skills}`);
    // navigate(`/viewRecommendCan?title=${vacancy.title}&position=${vacancy.position}&skills=${vacancy.skills}`);
  };

  // const getVacancies = async () => {
  //   const data = await fetchVacancy();
  //   setVacancies(data);
  // };
  // Fetch vacancies and update the state
  const getVacancies = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const data = await fetchVacancy(token);
      setVacancies(data); // Set vacancies after fetching data
    } catch (error) {
      console.error('Error fetching vacancies:', error);
    } finally {
      setLoading(false); // Stop loading after data is fetched
    }
  };

  useEffect(() => {
    getVacancies();
  }, []);

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
      <main className="p-4">

        <div className='flex justify-between items-center'>
          <div className=' flex items-center'>
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search Vacancy"
                onClick={() => navigate("/vacancy-page/vacancy-search")}
                className="w-96 p-2 pr-10 border rounded border-gray-400"
              />

              <div className=" absolute inset-y-0 left-80 ml-8 flex items-center pr-3 cursor-pointer">
                <i className="fas fa-search text-gray-600"></i>
              </div>
            </div>
          </div>
          <div className='flex items-center space-x-2 px-2 mb-4'>
            <button className=' bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'>Available position</button>
            <button onClick={GoToCreateVacancies} className=' hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'>Create Vacancies</button>
            {/* <button onClick={GoToAddVacancies} className=' hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'>Add Vacancies</button> */}
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <div className=' flex items-center'>
            <div className="mb-4 relative">
              <h1>Available position</h1>
            </div>
          </div>
          <div className='flex items-center space-x-2 px-2 mb-4'>
            <h1>Total data: {vacancies.length}</h1>
          </div>
        </div>

        {
          loading ? (
            // Show CombSpinner while data is being fetched
            <div className="loading-container" style={{ textAlign: 'center', marginTop: '20px' }}>
              <BallSpinner size={100} color="#ED1C24" />
              {/* <BallSpinner size={100} color="#4fa94d" /> */}
              <p>Fetching vacancies, please hang tight...</p>
            </div>
          ) : (
            vacancies.length === 0 ? (
              // {candidatesData.length === 0 ? (
              <div className=" flex justify-center items-center py-4">
                <div className="  flex flex-col items-center px-72">
                  <img src="../assets/vacancies/VacancyNDA.png" alt="VacancyNDA.png" className='h-48' />
                  <h1 className='text-center mt-2 py-2 text-3xl font-bold'>No Data Available</h1>
                  <h1 className='text-center text-lg'>Please add a vacancy to make the data appear.</h1>
                </div>
              </div>
            ) : (
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
                  {
                    (
                      <>
                        {vacancies.map((vacancy, index) => (
                          // <tr key={index} className='cursor-pointer hover:bg-slate-100'
                          //   onClick={() => { setEditMode(false); goToViewVacancy(vacancy.id) }}
                          // >
                          <tr key={index} className='cursor-pointer hover:bg-slate-100'
                            onClick={() => {
                              // setEditMode(false); // Ensure edit mode is false for viewing
                              goToViewVacancy(vacancy.id, 'view'); // Navigate with view mode
                            }}
                          >
                            <th className="p-2">{index + 1}</th>
                            <td className='p-2 text-center'>{vacancy.positionTitle}</td>
                            {/* <td className='p-2 text-center'>{vacancy.title}</td> */}
                            {/* <td className='p-2 flex items-center justify-center'> */}
                            <td className='p-2 flex text-center justify-center mt-2'>
                              <span>{vacancy.positionApplied}</span>
                            </td>
                            <td className='p-2 text-center'>{vacancy.skills}</td>
                            <td className='p-2 relative'>
                              <FontAwesomeIcon icon={faEllipsisVertical}
                                onClick={(e) => { e.stopPropagation(); togglePopup(index) }}
                                className='p-2 hover:bg-slate-200 rounded-full cursor-pointer'
                              />
                              {clickedIndex === index && (
                                <div className="absolute right-0 mt-2 mr-2 z-10"> {/* Adjust mt-10 for positioning */}
                                  <div className="p-4 bg-white rounded-xl shadow-xl">
                                    <div className="flex flex-col">
                                      {/* First Row */}
                                      <div className="flex justify-between mb-2">
                                        {/* <div className=" p-2 mr-2 flex items-center">
                                          <img src="../assets/vacancies/Edit.png" alt="Edit.png" className='h-8 mr-4' />
                                          <span className=' mr-8 text-lg hover:text-green-400'
                                            onClick={(e) => { e.stopPropagation(); goToViewVacancy(vacancy.id) }}><a href="">Edit</a>
                                          </span>
                                        </div> */}
                                        {/* <div className="p-2 mr-2 flex items-center">
                                          <img src="../assets/vacancies/Edit.png" alt="Edit.png" className="h-8 mr-4" />
                                          <span className="mr-8 text-lg hover:text-green-400"
                                            onClick={(e) => {
                                              // e.preventDefault();
                                              e.stopPropagation();
                                              setEditMode(true);  // Enable edit mode from parent
                                              goToViewVacancy(vacancy.id);  // Navigate to view vacancy
                                            }}>
                                            <a>Edit</a>
                                          </span>
                                        </div> */}
                                        <div className="p-2 mr-2 flex items-center">
                                          <img src="../assets/vacancies/Edit.png" alt="Edit.png" className="h-8 mr-4" />
                                          <span className="mr-8 text-lg hover:text-slate-300"
                                            onClick={(e) => {
                                              e.stopPropagation();  // Prevent triggering row click
                                              // setEditMode(true);    // Enable edit mode from parent
                                              goToViewVacancy(vacancy.id, 'edit');  // Navigate to edit mode
                                            }}
                                          >
                                            <a>Edit</a>
                                          </span>
                                        </div>


                                        <div className="p-2 justify-end text-end">
                                          <FontAwesomeIcon icon={faCircleXmark}
                                            onClick={(e) => { e.stopPropagation(); togglePopup(-1) }}
                                            className="text-red-500 h-8 mr-2 cursor-pointer" />
                                        </div>
                                      </div>
                                      {/* Second Row */}
                                      <div className="mb-2  flex items-center">
                                        <img src="../assets/vacancies/RecommendedCandidates.png" alt="RecommendedCandidates.png" className='h-8 mr-5' />
                                        <span className=' text-lg hover:text-slate-300'>
                                          {/* <a href=""
                                            onClick={(e) => { e.stopPropagation(); goToViewRecommendCan(vacancy) }}
                                          > */}
                                          <a
                                            onClick={(e) => { e.stopPropagation(); goToViewRecommendCan(vacancy) }}
                                          >
                                            Recommended candidates
                                          </a>
                                        </span>
                                      </div>

                                      <div className="flex justify-between mb-2">
                                        <div className=" p-2 mr-2 flex items-center">
                                          <img src="../assets/vacancies/Delete.png" alt="Delete.png" className='h-8 mr-3' />
                                          <span className=' text-lg hover:text-slate-300 cursor-pointer'
                                            onClick={(e) => { e.stopPropagation(); openConfirmation(vacancy.id, vacancy.positionApplied, index) }}
                                          >
                                            Delete
                                          </span>
                                          {/* <span className=' text-lg hover:text-green-400 cursor-pointer' onClick={() => openConfirmation(vacancy.id, vacancy.position, index)}>Delete</span> */}
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
                    )
                  }
                </tbody>
              </table>
            )
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

export default VacancyPage

//! Below code is like upper code but I don't separate search yet
// import React, { useEffect, useState } from 'react'
// import Header from '../../components/Header'
// // import { navigate } from 'wouter/use-browser-location'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCircleXmark, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
// // import ShowConfirmationDialog from '../../components/ShowConfirmationDialog';
// import { deleteVacancy, fetchVacancy } from '../../API/vacanciesApi';
// import { Vacancy as SearchVacancy, searchVacancies } from '../../API/searchApi';
// // import ReactLoading from 'react-loading';
// // import { ClipLoader } from 'react-spinners';
// // import { Circles } from 'react-loader-spinner';
// import { BallSpinner } from 'react-spinners-kit'; // Import a unique spinner
// import { useNavigate } from 'react-router-dom';

// // interface VacancyType {
// //   id: number;
// //   title: string;
// //   position: string;
// //   skills: string;
// // }

// interface VacancyType {
//   id: string; // UUID as string
//   positionTitle: string; // Updated from title to positionTitle
//   positionApplied: string; // Corresponds to position_applied from backend
//   skills: string;
// }

// const VacancyPage = () => {
//   const [clickedIndex, setClickedIndex] = useState<number | null>(null);
//   const [confirmData, setConfirmData] = useState<{ id: string; positionApplied: string; index: number } | null>(null);
//   const [noDataSearch, setNoDataSearch] = useState<string | null>(null);

//   //!Backend
//   const [vacancies, setVacancies] = useState<VacancyType[]>([]);
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState<SearchVacancy[]>([]);
//   const [searching, setSearching] = useState(false);
//   const [noData, setNoData] = useState(false);
//   const [countVacancy, setCountVacancy] = useState(false);
//   const [loading, setLoading] = useState<boolean>(true); // State to track loading

//   const navigate = useNavigate();

//   const togglePopup = (index: number) => {
//     if (clickedIndex === index) {
//       setClickedIndex(null); // Close the popup if clicking the same icon again
//     } else {
//       setClickedIndex(index);
//     }
//   };

//   const GoToAddVacancies = () => {
//     navigate('/AddVacancies')
//   }

//   // const confirmDelete = async (id: number) => {
//   //   try {
//   //     await deleteVacancy(id);
//   //     setVacancies(vacancies.filter(vacancy => vacancy.id !== id));
//   //     setClickedIndex(null);
//   //   } catch (error) {
//   //     console.error('Error deleting vacancy:', error);
//   //   }
//   // };
//   const openConfirmation = (id: string, positionApplied: string, index: number) => {
//     setClickedIndex(null);
//     setConfirmData({ id, positionApplied, index });
//   };

//   const closeConfirmation = () => {
//     setConfirmData(null);
//   };

//   const handleConfirm = async () => {
//     if (confirmData) {
//       const { id } = confirmData;
//       try {
//         await deleteVacancy(id);
//         setVacancies(vacancies.filter(vacancy => vacancy.id !== id));
//         setClickedIndex(null);
//         closeConfirmation();
//       } catch (error) {
//         console.error('Error deleting vacancy:', error);
//       }
//     }
//   };


//   const handleSearch = async () => {
//     try {
//       const data = await searchVacancies(query);
//       setResults(data);
//       setSearching(true);
//       setCountVacancy(true);
//       setQuery(''); // Clear the search bar after search
//       setNoData(data.length === 0);
//       if (data.length === 0) {
//         openNoDataSearchPopup(query);
//       }
//     } catch (error) {
//       console.error('Error fetching search results:', error);
//     }
//   };

//   // const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
//   //   if (event.key === 'Enter') {
//   //     handleSearch();
//   //   }
//   // };

//   const openNoDataSearchPopup = (query: string) => {
//     setNoDataSearch(query);
//   };

//   const closeNoDataSearchPopup = () => {
//     setNoDataSearch(null);
//   };

//   const goToViewRecommendCan = (vacancy: VacancyType) => {
//     console.log("goToViewRecommendCan");
//     navigate(`/matching-candidates?title=${vacancy.positionTitle}&position=${vacancy.positionApplied}&skills=${vacancy.skills}`);
//     // navigate(`/matching-candidates?title=${vacancy.title}&position=${vacancy.position}&skills=${vacancy.skills}`);
//     // navigate(`/viewRecommendCan?title=${vacancy.title}&position=${vacancy.position}&skills=${vacancy.skills}`);
//   };

//   // const getVacancies = async () => {
//   //   const data = await fetchVacancy();
//   //   setVacancies(data);
//   // };
//   // Fetch vacancies and update the state
//   const getVacancies = async () => {
//     setLoading(true); // Set loading to true before fetching data
//     try {
//       const data = await fetchVacancy();
//       setVacancies(data); // Set vacancies after fetching data
//     } catch (error) {
//       console.error('Error fetching vacancies:', error);
//     } finally {
//       setLoading(false); // Stop loading after data is fetched
//     }
//   };

//   useEffect(() => {
//     getVacancies();
//   }, []);

//   return (
//     <>
//       <header>
//         <Header
//           candidateButtonClass='hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'
//           vacanciesButtonClass='bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'
//         />
//       </header>
//       <main className="p-4">
//         <div className='flex justify-between items-center'>
//           <div className=' flex items-center'>
//             <div className="mb-4 relative">
//               <input
//                 type="text"
//                 placeholder="Search Vacancy"
//                 onClick={() => navigate("/vacancyPage/vacancy-searchPage")}
//                 // value={query}
//                 // onChange={(e) => setQuery(e.target.value)}
//                 // onKeyPress={handleKeyPress}

//                 className="w-96 p-2 pr-10 border rounded border-gray-400"
//               />
//               {/* <button
//                 onClick={() => navigate("/vacancy-searchPage")}
//                 className="w-96 p-2 pr-10 border rounded border-gray-400"
//               >
//                 Search Vacancy
//               </button> */}

//               <div className=" absolute inset-y-0 left-80 ml-8 flex items-center pr-3 cursor-pointer">
//                 <i onClick={handleSearch} className="fas fa-search text-gray-600"></i>
//               </div>
//             </div>
//           </div>
//           <div className='flex items-center space-x-2 px-2 mb-4'>
//             <button className=' bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'>Available position</button>
//             <button onClick={GoToAddVacancies} className=' hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'>Add Vacancies</button>
//           </div>
//         </div>
//         <div className='flex justify-between items-center'>
//           <div className=' flex items-center'>
//             <div className="mb-4 relative">
//               <h1>Available position</h1>
//             </div>
//           </div>
//           <div className='flex items-center space-x-2 px-2 mb-4'>
//             {/* <h1>Total data: {vacancies.length}</h1> */}
//             {
//               countVacancy ? (
//                 <h1>Total data: {results.length}</h1>
//               ) : (
//                 <h1>Total data: {vacancies.length}</h1>
//               )
//             }
//             {/* <h1>Total data: {candidatesData.length}</h1> */}
//           </div>
//         </div>

//         {
//           loading ? (
//             // Show CombSpinner while data is being fetched
//             <div className="loading-container" style={{ textAlign: 'center', marginTop: '20px' }}>
//               <BallSpinner size={100} color="#ED1C24" />
//               {/* <BallSpinner size={100} color="#4fa94d" /> */}
//               <p>Fetching vacancies, please hang tight...</p>
//             </div>
//           ) : (
//             vacancies.length === 0 ? (
//               // {candidatesData.length === 0 ? (
//               <div className=" flex justify-center items-center py-4">
//                 <div className="  flex flex-col items-center px-72">
//                   <img src="../assets/vacancies/VacancyNDA.png" alt="VacancyNDA.png" className='h-48' />
//                   <h1 className='text-center mt-2 py-2 text-3xl font-bold'>No Data Available</h1>
//                   <h1 className='text-center text-lg'>Please add a vacancy to make the data appear.</h1>
//                 </div>
//               </div>
//             ) : (
//               <table className='p-6 w-full bg-white rounded-xl shadow-md'>
//                 <thead>
//                   <tr>
//                     <th className="p-2 font-normal border-b border-gray-300">No</th>
//                     <th className='p-2 font-normal border-b border-gray-300'>Position title</th>
//                     <th className='p-2 font-normal border-b border-gray-300'>Position applied</th>
//                     {/* <th className='p-2 font-normal border-b border-gray-300'>Salary</th>
//                 <th className='p-2 font-normal border-b border-gray-300'>Date of application</th> */}
//                     <th className='p-2 font-normal border-b border-gray-300'>Skills</th>
//                     <th className='p-2 font-normal border-b border-gray-300' />
//                   </tr>
//                 </thead>
//                 <tbody className='divide-y divide-gray-200'>
//                   {
//                     searching ? (
//                       <>
//                         {noData ? (
//                           <p></p>
//                         ) : (
//                           <>
//                             {results.map((result, index) => (
//                               <tr key={index}>
//                                 <th className="p-2">{index + 1}</th>
//                                 {/* <th className="p-2">{vacancy.id}</th> */}
//                                 <td className='p-2 text-center'>{result.positionTitle}</td>
//                                 {/* <td className='p-2 text-center'>{result.title}</td> */}
//                                 <td className='p-2 flex items-center justify-center'>
//                                   {/* <img src="../src/assets/ProfileImage.png" alt="ProfileImage.png" className='h-8 mr-3' /> */}
//                                   <span>{result.positionApplied}</span>
//                                   {/* <span>{result.position}</span> */}
//                                 </td>
//                                 <td className='p-2 text-center'>{result.skills}</td>
//                                 <td className='p-2 relative'>
//                                   <FontAwesomeIcon icon={faEllipsisVertical} onClick={() => togglePopup(index)} className=' cursor-pointer' />
//                                   {clickedIndex === index && (
//                                     <div className="absolute right-0 mt-2 mr-2 z-10"> {/* Adjust mt-10 for positioning */}
//                                       <div className="p-4 bg-white rounded-xl shadow-xl">
//                                         <div className="flex flex-col">
//                                           {/* First Row */}
//                                           <div className="flex justify-between mb-2">
//                                             <div className=" p-2 mr-2 flex items-center">
//                                               <img src="../src/assets/vacancies/Edit.png" alt="Edit.png" className='h-8 mr-4' />
//                                               <span className=' mr-8 text-lg hover:text-green-400'><a href="">Edit</a></span>
//                                             </div>
//                                             <div className="p-2 justify-end text-end">
//                                               <FontAwesomeIcon icon={faCircleXmark} onClick={() => togglePopup(-1)} className="text-red-500 h-8 mr-2 cursor-pointer" />
//                                             </div>
//                                           </div>
//                                           {/* Second Row */}
//                                           <div className="mb-2  flex items-center">
//                                             {/* <div className="bg-gray-200 p-2 mr-2 flex items-center px-20"> */}
//                                             <img src="../src/assets/vacancies/RecommendedCandidates.png" alt="RecommendedCandidates.png" className='h-8 mr-5' />
//                                             <span className=' text-lg hover:text-green-400'><a href="" onClick={() => goToViewRecommendCan(result)}>Recommended candidates</a></span>
//                                             {/* </div> */}
//                                           </div>

//                                           <div className="flex justify-between mb-2">
//                                             <div className=" p-2 mr-2 flex items-center">
//                                               <img src="../src/assets/vacancies/Delete.png" alt="Delete.png" className='h-8 mr-3' />
//                                               <span className=' text-lg hover:text-green-400 cursor-pointer' onClick={() => openConfirmation(result.id, result.positionApplied, index)}>Delete</span>
//                                               {/* <span className=' text-lg hover:text-green-400 cursor-pointer' onClick={() => openConfirmation(result.id, result.position, index)}>Delete</span> */}
//                                             </div>
//                                           </div>
//                                           <div className="flex justify-between">
//                                             <div className="p-2 mr-2"></div>
//                                             <div className=" p-2 px-32 mr-2"></div>
//                                             <div className="p-2"></div>
//                                           </div>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   )}
//                                 </td>
//                               </tr>
//                             ))}
//                           </>
//                         )}
//                       </>
//                     ) : (
//                       <>
//                         {vacancies.map((vacancy, index) => (
//                           <tr key={index}>
//                             <th className="p-2">{index + 1}</th>
//                             <td className='p-2 text-center'>{vacancy.positionTitle}</td>
//                             {/* <td className='p-2 text-center'>{vacancy.title}</td> */}
//                             <td className='p-2 flex items-center justify-center'>
//                               <span>{vacancy.positionApplied}</span>
//                             </td>
//                             <td className='p-2 text-center'>{vacancy.skills}</td>
//                             <td className='p-2 relative'>
//                               <FontAwesomeIcon icon={faEllipsisVertical} onClick={() => togglePopup(index)} className=' cursor-pointer' />
//                               {clickedIndex === index && (
//                                 <div className="absolute right-0 mt-2 mr-2 z-10"> {/* Adjust mt-10 for positioning */}
//                                   <div className="p-4 bg-white rounded-xl shadow-xl">
//                                     <div className="flex flex-col">
//                                       {/* First Row */}
//                                       <div className="flex justify-between mb-2">
//                                         <div className=" p-2 mr-2 flex items-center">
//                                           <img src="../src/assets/vacancies/Edit.png" alt="Edit.png" className='h-8 mr-4' />
//                                           <span className=' mr-8 text-lg hover:text-green-400'><a href="">Edit</a></span>
//                                         </div>
//                                         <div className="p-2 justify-end text-end">
//                                           <FontAwesomeIcon icon={faCircleXmark} onClick={() => togglePopup(-1)} className="text-red-500 h-8 mr-2 cursor-pointer" />
//                                         </div>
//                                       </div>
//                                       {/* Second Row */}
//                                       <div className="mb-2  flex items-center">
//                                         <img src="../src/assets/vacancies/RecommendedCandidates.png" alt="RecommendedCandidates.png" className='h-8 mr-5' />
//                                         <span className=' text-lg hover:text-green-400'><a href="" onClick={() => goToViewRecommendCan(vacancy)}>Recommended candidates</a></span>
//                                       </div>

//                                       <div className="flex justify-between mb-2">
//                                         <div className=" p-2 mr-2 flex items-center">
//                                           <img src="../src/assets/vacancies/Delete.png" alt="Delete.png" className='h-8 mr-3' />
//                                           <span className=' text-lg hover:text-green-400 cursor-pointer' onClick={() => openConfirmation(vacancy.id, vacancy.positionApplied, index)}>Delete</span>
//                                           {/* <span className=' text-lg hover:text-green-400 cursor-pointer' onClick={() => openConfirmation(vacancy.id, vacancy.position, index)}>Delete</span> */}
//                                         </div>
//                                       </div>
//                                       <div className="flex justify-between">
//                                         <div className="p-2 mr-2"></div>
//                                         <div className=" p-2 px-32 mr-2"></div>
//                                         <div className="p-2"></div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               )}
//                             </td>
//                           </tr>
//                         ))}
//                       </>
//                     )
//                   }
//                 </tbody>
//               </table>
//             )
//           )
//         }

//         {

//         }
//         {/* Confirmation dialog */}
//         {confirmData && (
//           <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
//             <div className="bg-white p-8 rounded-lg">
//               <p className="text-xl mb-4">Are you sure to delete vacancy {confirmData.index + 1} and "{confirmData.positionApplied}"?</p>
//               <div className="flex justify-end">
//                 <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={handleConfirm}>Yes</button>
//                 <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeConfirmation}>No</button>
//               </div>
//             </div>
//           </div>
//         )}
//         {/* No data search pop-up */}
//         {noDataSearch && (
//           <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
//             <div className="bg-white p-8 rounded-lg">
//               <h1 className=' text-center text-2xl'>NO DATA!</h1>
//               <p className="text-xl mb-4">There is no data matching your search "{noDataSearch}"</p>
//               <div className='flex justify-center'>
//                 <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeNoDataSearchPopup}>Close</button>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </>
//   )
// }

// export default VacancyPage

//! Below code is like upper code but I don't separate search yet
// import React, { useEffect, useState } from 'react'
// import Header from '../../components/Header'
// // import { navigate } from 'wouter/use-browser-location'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCircleXmark, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
// // import ShowConfirmationDialog from '../../components/ShowConfirmationDialog';
// import { deleteVacancy, fetchVacancy } from '../../API/vacanciesApi';
// import { Vacancy as SearchVacancy, searchVacancies } from '../../API/searchApi';
// // import ReactLoading from 'react-loading';
// // import { ClipLoader } from 'react-spinners';
// // import { Circles } from 'react-loader-spinner';
// import { BallSpinner } from 'react-spinners-kit'; // Import a unique spinner
// import { useNavigate } from 'react-router-dom';

// // interface VacancyType {
// //   id: number;
// //   title: string;
// //   position: string;
// //   skills: string;
// // }

// interface VacancyType {
//   id: string; // UUID as string
//   positionTitle: string; // Updated from title to positionTitle
//   positionApplied: string; // Corresponds to position_applied from backend
//   skills: string;
// }

// const VacancyPage = () => {
//   const [clickedIndex, setClickedIndex] = useState<number | null>(null);
//   const [confirmData, setConfirmData] = useState<{ id: string; position: string; index: number } | null>(null);
//   const [noDataSearch, setNoDataSearch] = useState<string | null>(null);

//   //!Backend
//   const [vacancies, setVacancies] = useState<VacancyType[]>([]);
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState<SearchVacancy[]>([]);
//   const [searching, setSearching] = useState(false);
//   const [noData, setNoData] = useState(false);
//   const [countVacancy, setCountVacancy] = useState(false);
//   const [loading, setLoading] = useState<boolean>(true); // State to track loading

//   const navigate = useNavigate();

//   const togglePopup = (index: number) => {
//     if (clickedIndex === index) {
//       setClickedIndex(null); // Close the popup if clicking the same icon again
//     } else {
//       setClickedIndex(index);
//     }
//   };

//   const GoToAddVacancies = () => {
//     navigate('/AddVacancies')
//   }

//   // const confirmDelete = async (id: number) => {
//   //   try {
//   //     await deleteVacancy(id);
//   //     setVacancies(vacancies.filter(vacancy => vacancy.id !== id));
//   //     setClickedIndex(null);
//   //   } catch (error) {
//   //     console.error('Error deleting vacancy:', error);
//   //   }
//   // };
//   const openConfirmation = (id: string, position: string, index: number) => {
//     setClickedIndex(null);
//     setConfirmData({ id, position, index });
//   };

//   const closeConfirmation = () => {
//     setConfirmData(null);
//   };

//   const handleConfirm = async () => {
//     if (confirmData) {
//       const { id } = confirmData;
//       try {
//         await deleteVacancy(id);
//         setVacancies(vacancies.filter(vacancy => vacancy.id !== id));
//         setClickedIndex(null);
//         closeConfirmation();
//       } catch (error) {
//         console.error('Error deleting vacancy:', error);
//       }
//     }
//   };


//   const handleSearch = async () => {
//     try {
//       const data = await searchVacancies(query);
//       setResults(data);
//       setSearching(true);
//       setCountVacancy(true);
//       setQuery(''); // Clear the search bar after search
//       setNoData(data.length === 0);
//       if (data.length === 0) {
//         openNoDataSearchPopup(query);
//       }
//     } catch (error) {
//       console.error('Error fetching search results:', error);
//     }
//   };

//   // const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
//   //   if (event.key === 'Enter') {
//   //     handleSearch();
//   //   }
//   // };

//   const openNoDataSearchPopup = (query: string) => {
//     setNoDataSearch(query);
//   };

//   const closeNoDataSearchPopup = () => {
//     setNoDataSearch(null);
//   };

//   const goToViewRecommendCan = (vacancy: VacancyType) => {
//     console.log("goToViewRecommendCan");
//     navigate(`/matching-candidates?title=${vacancy.positionTitle}&position=${vacancy.positionApplied}&skills=${vacancy.skills}`);
//     // navigate(`/matching-candidates?title=${vacancy.title}&position=${vacancy.position}&skills=${vacancy.skills}`);
//     // navigate(`/viewRecommendCan?title=${vacancy.title}&position=${vacancy.position}&skills=${vacancy.skills}`);
//   };

//   // const getVacancies = async () => {
//   //   const data = await fetchVacancy();
//   //   setVacancies(data);
//   // };
//   // Fetch vacancies and update the state
//   const getVacancies = async () => {
//     setLoading(true); // Set loading to true before fetching data
//     try {
//       const data = await fetchVacancy();
//       setVacancies(data); // Set vacancies after fetching data
//     } catch (error) {
//       console.error('Error fetching vacancies:', error);
//     } finally {
//       setLoading(false); // Stop loading after data is fetched
//     }
//   };

//   useEffect(() => {
//     getVacancies();
//   }, []);

//   return (
//     <>
//       <header>
//         <Header
//           candidateButtonClass='hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'
//           vacanciesButtonClass='bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'
//         />
//       </header>
//       <main className="p-4">
//         <div className='flex justify-between items-center'>
//           <div className=' flex items-center'>
//             <div className="mb-4 relative">
//               <input
//                 type="text"
//                 placeholder="Search Vacancy"
//                 onClick={() => navigate("/vacancyPage/vacancy-searchPage")}
//                 // value={query}
//                 // onChange={(e) => setQuery(e.target.value)}
//                 // onKeyPress={handleKeyPress}

//                 className="w-96 p-2 pr-10 border rounded border-gray-400"
//               />
//               {/* <button
//                 onClick={() => navigate("/vacancy-searchPage")}
//                 className="w-96 p-2 pr-10 border rounded border-gray-400"
//               >
//                 Search Vacancy
//               </button> */}

//               <div className=" absolute inset-y-0 left-80 ml-8 flex items-center pr-3 cursor-pointer">
//                 <i onClick={handleSearch} className="fas fa-search text-gray-600"></i>
//               </div>
//             </div>
//           </div>
//           <div className='flex items-center space-x-2 px-2 mb-4'>
//             <button className=' bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'>Available position</button>
//             <button onClick={GoToAddVacancies} className=' hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'>Add Vacancies</button>
//           </div>
//         </div>
//         <div className='flex justify-between items-center'>
//           <div className=' flex items-center'>
//             <div className="mb-4 relative">
//               <h1>Available position</h1>
//             </div>
//           </div>
//           <div className='flex items-center space-x-2 px-2 mb-4'>
//             {/* <h1>Total data: {vacancies.length}</h1> */}
//             {
//               countVacancy ? (
//                 <h1>Total data: {results.length}</h1>
//               ) : (
//                 <h1>Total data: {vacancies.length}</h1>
//               )
//             }
//             {/* <h1>Total data: {candidatesData.length}</h1> */}
//           </div>
//         </div>

//         {
//           loading ? (
//             // Show loading message or spinner while data is being fetched
//             // <div className="loading-container">
//             //   <ReactLoading type="spin" color="#000" height={50} width={50} />
//             //   <p>Loading vacancies, please wait...</p>
//             // </div>
//             // Show loading spinner while data is being fetched
//             // <div className="loading-container" style={{ textAlign: 'center', marginTop: '20px' }}>
//             //   <ClipLoader color="#000" loading={loading} size={50} />
//             //   <p>Loading vacancies, please wait...</p>
//             // </div>
//             // Show loading spinner while data is being fetched
//             // <div className="loading-container" style={{ textAlign: 'center', marginTop: '20px' }}>
//             //   <Circles
//             //     height="80"
//             //     width="80"
//             //     color="#4fa94d"
//             //     ariaLabel="loading-indicator"
//             //     visible={true} // Shows loader when true
//             //   />
//             //   <p>Loading vacancies, please wait...</p>
//             // </div>
//             // Show AtomSpinner while data is being fetched
//             // Show CombSpinner while data is being fetched
//             <div className="loading-container" style={{ textAlign: 'center', marginTop: '20px' }}>
//               <BallSpinner size={100} color="#ED1C24" />
//               {/* <BallSpinner size={100} color="#4fa94d" /> */}
//               <p>Fetching vacancies, please hang tight...</p>
//             </div>
//           ) : (
//             vacancies.length === 0 ? (
//               // {candidatesData.length === 0 ? (
//               <div className=" flex justify-center items-center py-4">
//                 <div className="  flex flex-col items-center px-72">
//                   <img src="../src/assets/vacancies/VacancyNDA.png" alt="VacancyNDA.png" className='h-48' />
//                   <h1 className='text-center mt-2 py-2 text-3xl font-bold'>No Data Available</h1>
//                   <h1 className='text-center text-lg'>Please add a vacancy to make the data appear.</h1>
//                 </div>
//               </div>
//             ) : (<table className='p-6 w-full bg-white rounded-xl shadow-md'>
//               <thead>
//                 <tr>
//                   <th className="p-2 font-normal border-b border-gray-300">No</th>
//                   <th className='p-2 font-normal border-b border-gray-300'>Position title</th>
//                   <th className='p-2 font-normal border-b border-gray-300'>Position applied</th>
//                   {/* <th className='p-2 font-normal border-b border-gray-300'>Salary</th>
//                 <th className='p-2 font-normal border-b border-gray-300'>Date of application</th> */}
//                   <th className='p-2 font-normal border-b border-gray-300'>Skills</th>
//                   <th className='p-2 font-normal border-b border-gray-300' />
//                 </tr>
//               </thead>
//               <tbody className='divide-y divide-gray-200'>
//                 {
//                   searching ? (
//                     <>
//                       {noData ? (
//                         <p></p>
//                       ) : (
//                         <>
//                           {results.map((result, index) => (
//                             <tr key={index}>
//                               <th className="p-2">{index + 1}</th>
//                               {/* <th className="p-2">{vacancy.id}</th> */}
//                               <td className='p-2 text-center'>{result.positionTitle}</td>
//                               {/* <td className='p-2 text-center'>{result.title}</td> */}
//                               <td className='p-2 flex items-center justify-center'>
//                                 {/* <img src="../src/assets/ProfileImage.png" alt="ProfileImage.png" className='h-8 mr-3' /> */}
//                                 <span>{result.positionApplied}</span>
//                                 {/* <span>{result.position}</span> */}
//                               </td>
//                               <td className='p-2 text-center'>{result.skills}</td>
//                               <td className='p-2 relative'>
//                                 <FontAwesomeIcon icon={faEllipsisVertical} onClick={() => togglePopup(index)} className=' cursor-pointer' />
//                                 {clickedIndex === index && (
//                                   <div className="absolute right-0 mt-2 mr-2 z-10"> {/* Adjust mt-10 for positioning */}
//                                     <div className="p-4 bg-white rounded-xl shadow-xl">
//                                       <div className="flex flex-col">
//                                         {/* First Row */}
//                                         <div className="flex justify-between mb-2">
//                                           <div className=" p-2 mr-2 flex items-center">
//                                             <img src="../src/assets/vacancies/Edit.png" alt="Edit.png" className='h-8 mr-4' />
//                                             <span className=' mr-8 text-lg hover:text-green-400'><a href="">Edit</a></span>
//                                           </div>
//                                           <div className="p-2 justify-end text-end">
//                                             <FontAwesomeIcon icon={faCircleXmark} onClick={() => togglePopup(-1)} className="text-red-500 h-8 mr-2 cursor-pointer" />
//                                           </div>
//                                         </div>
//                                         {/* Second Row */}
//                                         <div className="mb-2  flex items-center">
//                                           {/* <div className="bg-gray-200 p-2 mr-2 flex items-center px-20"> */}
//                                           <img src="../src/assets/vacancies/RecommendedCandidates.png" alt="RecommendedCandidates.png" className='h-8 mr-5' />
//                                           <span className=' text-lg hover:text-green-400'><a href="" onClick={() => goToViewRecommendCan(result)}>Recommended candidates</a></span>
//                                           {/* </div> */}
//                                         </div>

//                                         <div className="flex justify-between mb-2">
//                                           <div className=" p-2 mr-2 flex items-center">
//                                             <img src="../src/assets/vacancies/Delete.png" alt="Delete.png" className='h-8 mr-3' />
//                                             <span className=' text-lg hover:text-green-400 cursor-pointer' onClick={() => openConfirmation(result.id, result.positionApplied, index)}>Delete</span>
//                                             {/* <span className=' text-lg hover:text-green-400 cursor-pointer' onClick={() => openConfirmation(result.id, result.position, index)}>Delete</span> */}
//                                           </div>
//                                         </div>
//                                         <div className="flex justify-between">
//                                           <div className="p-2 mr-2"></div>
//                                           <div className=" p-2 px-32 mr-2"></div>
//                                           <div className="p-2"></div>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 )}
//                               </td>
//                             </tr>
//                           ))}
//                         </>
//                       )}
//                     </>
//                   ) : (
//                     <>
//                       {vacancies.map((vacancy, index) => (
//                         <tr key={index}>
//                           <th className="p-2">{index + 1}</th>
//                           <td className='p-2 text-center'>{vacancy.positionTitle}</td>
//                           {/* <td className='p-2 text-center'>{vacancy.title}</td> */}
//                           <td className='p-2 flex items-center justify-center'>
//                             <span>{vacancy.positionApplied}</span>
//                           </td>
//                           <td className='p-2 text-center'>{vacancy.skills}</td>
//                           <td className='p-2 relative'>
//                             <FontAwesomeIcon icon={faEllipsisVertical} onClick={() => togglePopup(index)} className=' cursor-pointer' />
//                             {clickedIndex === index && (
//                               <div className="absolute right-0 mt-2 mr-2 z-10"> {/* Adjust mt-10 for positioning */}
//                                 <div className="p-4 bg-white rounded-xl shadow-xl">
//                                   <div className="flex flex-col">
//                                     {/* First Row */}
//                                     <div className="flex justify-between mb-2">
//                                       <div className=" p-2 mr-2 flex items-center">
//                                         <img src="../src/assets/vacancies/Edit.png" alt="Edit.png" className='h-8 mr-4' />
//                                         <span className=' mr-8 text-lg hover:text-green-400'><a href="">Edit</a></span>
//                                       </div>
//                                       <div className="p-2 justify-end text-end">
//                                         <FontAwesomeIcon icon={faCircleXmark} onClick={() => togglePopup(-1)} className="text-red-500 h-8 mr-2 cursor-pointer" />
//                                       </div>
//                                     </div>
//                                     {/* Second Row */}
//                                     <div className="mb-2  flex items-center">
//                                       <img src="../src/assets/vacancies/RecommendedCandidates.png" alt="RecommendedCandidates.png" className='h-8 mr-5' />
//                                       <span className=' text-lg hover:text-green-400'><a href="" onClick={() => goToViewRecommendCan(vacancy)}>Recommended candidates</a></span>
//                                     </div>

//                                     <div className="flex justify-between mb-2">
//                                       <div className=" p-2 mr-2 flex items-center">
//                                         <img src="../src/assets/vacancies/Delete.png" alt="Delete.png" className='h-8 mr-3' />
//                                         <span className=' text-lg hover:text-green-400 cursor-pointer' onClick={() => openConfirmation(vacancy.id, vacancy.positionApplied, index)}>Delete</span>
//                                         {/* <span className=' text-lg hover:text-green-400 cursor-pointer' onClick={() => openConfirmation(vacancy.id, vacancy.position, index)}>Delete</span> */}
//                                       </div>
//                                     </div>
//                                     <div className="flex justify-between">
//                                       <div className="p-2 mr-2"></div>
//                                       <div className=" p-2 px-32 mr-2"></div>
//                                       <div className="p-2"></div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </>
//                   )
//                 }
//               </tbody>
//             </table>)
//           )
//         }

//         {

//         }
//         {/* Confirmation dialog */}
//         {confirmData && (
//           <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
//             <div className="bg-white p-8 rounded-lg">
//               <p className="text-xl mb-4">Are you sure to delete vacancy {confirmData.index + 1} and "{confirmData.position}"?</p>
//               <div className="flex justify-end">
//                 <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={handleConfirm}>Yes</button>
//                 <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeConfirmation}>No</button>
//               </div>
//             </div>
//           </div>
//         )}
//         {/* No data search pop-up */}
//         {noDataSearch && (
//           <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
//             <div className="bg-white p-8 rounded-lg">
//               <h1 className=' text-center text-2xl'>NO DATA!</h1>
//               <p className="text-xl mb-4">There is no data matching your search "{noDataSearch}"</p>
//               <div className='flex justify-center'>
//                 <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeNoDataSearchPopup}>Close</button>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </>
//   )
// }

// export default VacancyPage

//! Below code is like above but with comments and without separate the search
// import React, { useEffect, useState } from 'react'
// import Header from '../../components/Header'
// import { navigate } from 'wouter/use-browser-location'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCircleXmark, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
// // import ShowConfirmationDialog from '../../components/ShowConfirmationDialog';
// import { deleteVacancy, fetchVacancy } from '../../API/vacanciesApi';
// import { Vacancy as SearchVacancy, searchVacancies } from '../../API/searchApi';
// // import ReactLoading from 'react-loading';
// // import { ClipLoader } from 'react-spinners';
// // import { Circles } from 'react-loader-spinner';
// import { BallSpinner } from 'react-spinners-kit'; // Import a unique spinner

// // interface VacancyType {
// //   id: number;
// //   title: string;
// //   position: string;
// //   skills: string;
// // }

// interface VacancyType {
//   id: string; // UUID as string
//   positionTitle: string; // Updated from title to positionTitle
//   positionApplied: string; // Corresponds to position_applied from backend
//   skills: string;
// }

// const VacancyPage = () => {
//   const [clickedIndex, setClickedIndex] = useState<number | null>(null);
//   const [confirmData, setConfirmData] = useState<{ id: string; position: string; index: number } | null>(null);
//   const [noDataSearch, setNoDataSearch] = useState<string | null>(null);

//   //!Backend
//   const [vacancies, setVacancies] = useState<VacancyType[]>([]);
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState<SearchVacancy[]>([]);
//   const [searching, setSearching] = useState(false);
//   const [noData, setNoData] = useState(false);
//   const [countVacancy, setCountVacancy] = useState(false);
//   const [loading, setLoading] = useState<boolean>(true); // State to track loading

//   const togglePopup = (index: number) => {
//     if (clickedIndex === index) {
//       setClickedIndex(null); // Close the popup if clicking the same icon again
//     } else {
//       setClickedIndex(index);
//     }
//   };

//   const GoToAddVacancies = () => {
//     navigate('/AddVacancies')
//   }

//   // const confirmDelete = async (id: number) => {
//   //   try {
//   //     await deleteVacancy(id);
//   //     setVacancies(vacancies.filter(vacancy => vacancy.id !== id));
//   //     setClickedIndex(null);
//   //   } catch (error) {
//   //     console.error('Error deleting vacancy:', error);
//   //   }
//   // };
//   const openConfirmation = (id: string, position: string, index: number) => {
//     setClickedIndex(null);
//     setConfirmData({ id, position, index });
//   };

//   const closeConfirmation = () => {
//     setConfirmData(null);
//   };

//   const handleConfirm = async () => {
//     if (confirmData) {
//       const { id } = confirmData;
//       try {
//         await deleteVacancy(id);
//         setVacancies(vacancies.filter(vacancy => vacancy.id !== id));
//         setClickedIndex(null);
//         closeConfirmation();
//       } catch (error) {
//         console.error('Error deleting vacancy:', error);
//       }
//     }
//   };


//   const handleSearch = async () => {
//     try {
//       const data = await searchVacancies(query);
//       setResults(data);
//       setSearching(true);
//       setCountVacancy(true);
//       setQuery(''); // Clear the search bar after search
//       setNoData(data.length === 0);
//       if (data.length === 0) {
//         openNoDataSearchPopup(query);
//       }
//     } catch (error) {
//       console.error('Error fetching search results:', error);
//     }
//   };

//   const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   const openNoDataSearchPopup = (query: string) => {
//     setNoDataSearch(query);
//   };

//   const closeNoDataSearchPopup = () => {
//     setNoDataSearch(null);
//   };

//   const goToViewRecommendCan = (vacancy: VacancyType) => {
//     console.log("goToViewRecommendCan");
//     navigate(`/matching-candidates?title=${vacancy.positionTitle}&position=${vacancy.positionApplied}&skills=${vacancy.skills}`);
//     // navigate(`/matching-candidates?title=${vacancy.title}&position=${vacancy.position}&skills=${vacancy.skills}`);
//     // navigate(`/viewRecommendCan?title=${vacancy.title}&position=${vacancy.position}&skills=${vacancy.skills}`);
//   };

//   // const getVacancies = async () => {
//   //   const data = await fetchVacancy();
//   //   setVacancies(data);
//   // };
//   // Fetch vacancies and update the state
//   const getVacancies = async () => {
//     setLoading(true); // Set loading to true before fetching data
//     try {
//       const data = await fetchVacancy();
//       setVacancies(data); // Set vacancies after fetching data
//     } catch (error) {
//       console.error('Error fetching vacancies:', error);
//     } finally {
//       setLoading(false); // Stop loading after data is fetched
//     }
//   };

//   useEffect(() => {
//     getVacancies();
//   }, []);

//   return (
//     <>
//       <header>
//         <Header
//           candidateButtonClass='hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'
//           vacanciesButtonClass='bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'
//         />
//       </header>
//       <main className="p-4">
//         <div className='flex justify-between items-center'>
//           <div className=' flex items-center'>
//             <div className="mb-4 relative">
//               <input
//                 type="text"
//                 placeholder="Search Vacancy"

//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 onKeyPress={handleKeyPress}

//                 className="w-96 p-2 pr-10 border rounded border-gray-400"
//               />
//               <div className=" absolute inset-y-0 left-80 ml-8 flex items-center pr-3 cursor-pointer">
//                 <i onClick={handleSearch} className="fas fa-search text-gray-600"></i>
//               </div>
//               {/* <div className=" absolute inset-y-0 left-80 ml-8 flex items-center pr-3 pointer-events-none">
//                 <i onClick={handleSearch} className="fas fa-search text-gray-600"></i>
//               </div> */}
//             </div>
//           </div>
//           <div className='flex items-center space-x-2 px-2 mb-4'>
//             <button className=' bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'>Available position</button>
//             <button onClick={GoToAddVacancies} className=' hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'>Add Vacancies</button>
//           </div>
//         </div>
//         <div className='flex justify-between items-center'>
//           <div className=' flex items-center'>
//             <div className="mb-4 relative">
//               <h1>Available position</h1>
//             </div>
//           </div>
//           <div className='flex items-center space-x-2 px-2 mb-4'>
//             {/* <h1>Total data: {vacancies.length}</h1> */}
//             {
//               countVacancy ? (
//                 <h1>Total data: {results.length}</h1>
//               ) : (
//                 <h1>Total data: {vacancies.length}</h1>
//               )
//             }
//             {/* <h1>Total data: {candidatesData.length}</h1> */}
//           </div>
//         </div>

//         {
//           loading ? (
//             // Show loading message or spinner while data is being fetched
//             // <div className="loading-container">
//             //   <ReactLoading type="spin" color="#000" height={50} width={50} />
//             //   <p>Loading vacancies, please wait...</p>
//             // </div>
//             // Show loading spinner while data is being fetched
//             // <div className="loading-container" style={{ textAlign: 'center', marginTop: '20px' }}>
//             //   <ClipLoader color="#000" loading={loading} size={50} />
//             //   <p>Loading vacancies, please wait...</p>
//             // </div>
//             // Show loading spinner while data is being fetched
//             // <div className="loading-container" style={{ textAlign: 'center', marginTop: '20px' }}>
//             //   <Circles
//             //     height="80"
//             //     width="80"
//             //     color="#4fa94d"
//             //     ariaLabel="loading-indicator"
//             //     visible={true} // Shows loader when true
//             //   />
//             //   <p>Loading vacancies, please wait...</p>
//             // </div>
//             // Show AtomSpinner while data is being fetched
//             // Show CombSpinner while data is being fetched
//             <div className="loading-container" style={{ textAlign: 'center', marginTop: '20px' }}>
//               <BallSpinner size={100} color="#ED1C24" />
//               {/* <BallSpinner size={100} color="#4fa94d" /> */}
//               <p>Fetching vacancies, please hang tight...</p>
//             </div>
//           ) : (
//             vacancies.length === 0 ? (
//               // {candidatesData.length === 0 ? (
//               <div className=" flex justify-center items-center py-4">
//                 <div className="  flex flex-col items-center px-72">
//                   <img src="../src/assets/vacancies/VacancyNDA.png" alt="VacancyNDA.png" className='h-48' />
//                   <h1 className='text-center mt-2 py-2 text-3xl font-bold'>No Data Available</h1>
//                   <h1 className='text-center text-lg'>Please add a vacancy to make the data appear.</h1>
//                 </div>
//               </div>
//             ) : (<table className='p-6 w-full bg-white rounded-xl shadow-md'>
//               <thead>
//                 <tr>
//                   <th className="p-2 font-normal border-b border-gray-300">No</th>
//                   <th className='p-2 font-normal border-b border-gray-300'>Position title</th>
//                   <th className='p-2 font-normal border-b border-gray-300'>Position applied</th>
//                   {/* <th className='p-2 font-normal border-b border-gray-300'>Salary</th>
//                 <th className='p-2 font-normal border-b border-gray-300'>Date of application</th> */}
//                   <th className='p-2 font-normal border-b border-gray-300'>Skills</th>
//                   <th className='p-2 font-normal border-b border-gray-300' />
//                 </tr>
//               </thead>
//               <tbody className='divide-y divide-gray-200'>
//                 {
//                   searching ? (
//                     <>
//                       {noData ? (
//                         <p></p>
//                       ) : (
//                         <>
//                           {results.map((result, index) => (
//                             <tr key={index}>
//                               <th className="p-2">{index + 1}</th>
//                               {/* <th className="p-2">{vacancy.id}</th> */}
//                               <td className='p-2 text-center'>{result.positionTitle}</td>
//                               {/* <td className='p-2 text-center'>{result.title}</td> */}
//                               <td className='p-2 flex items-center justify-center'>
//                                 {/* <img src="../src/assets/ProfileImage.png" alt="ProfileImage.png" className='h-8 mr-3' /> */}
//                                 <span>{result.positionApplied}</span>
//                                 {/* <span>{result.position}</span> */}
//                               </td>
//                               <td className='p-2 text-center'>{result.skills}</td>
//                               <td className='p-2 relative'>
//                                 <FontAwesomeIcon icon={faEllipsisVertical} onClick={() => togglePopup(index)} className=' cursor-pointer' />
//                                 {clickedIndex === index && (
//                                   <div className="absolute right-0 mt-2 mr-2 z-10"> {/* Adjust mt-10 for positioning */}
//                                     <div className="p-4 bg-white rounded-xl shadow-xl">
//                                       <div className="flex flex-col">
//                                         {/* First Row */}
//                                         <div className="flex justify-between mb-2">
//                                           <div className=" p-2 mr-2 flex items-center">
//                                             <img src="../src/assets/vacancies/Edit.png" alt="Edit.png" className='h-8 mr-4' />
//                                             <span className=' mr-8 text-lg hover:text-green-400'><a href="">Edit</a></span>
//                                           </div>
//                                           <div className="p-2 justify-end text-end">
//                                             <FontAwesomeIcon icon={faCircleXmark} onClick={() => togglePopup(-1)} className="text-red-500 h-8 mr-2 cursor-pointer" />
//                                           </div>
//                                         </div>
//                                         {/* Second Row */}
//                                         <div className="mb-2  flex items-center">
//                                           {/* <div className="bg-gray-200 p-2 mr-2 flex items-center px-20"> */}
//                                           <img src="../src/assets/vacancies/RecommendedCandidates.png" alt="RecommendedCandidates.png" className='h-8 mr-5' />
//                                           <span className=' text-lg hover:text-green-400'><a href="" onClick={() => goToViewRecommendCan(result)}>Recommended candidates</a></span>
//                                           {/* </div> */}
//                                         </div>

//                                         <div className="flex justify-between mb-2">
//                                           <div className=" p-2 mr-2 flex items-center">
//                                             <img src="../src/assets/vacancies/Delete.png" alt="Delete.png" className='h-8 mr-3' />
//                                             <span className=' text-lg hover:text-green-400 cursor-pointer' onClick={() => openConfirmation(result.id, result.positionApplied, index)}>Delete</span>
//                                             {/* <span className=' text-lg hover:text-green-400 cursor-pointer' onClick={() => openConfirmation(result.id, result.position, index)}>Delete</span> */}
//                                           </div>
//                                         </div>
//                                         <div className="flex justify-between">
//                                           <div className="p-2 mr-2"></div>
//                                           <div className=" p-2 px-32 mr-2"></div>
//                                           <div className="p-2"></div>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 )}
//                               </td>
//                             </tr>
//                           ))}
//                         </>
//                       )}
//                     </>
//                   ) : (
//                     <>
//                       {vacancies.map((vacancy, index) => (
//                         <tr key={index}>
//                           <th className="p-2">{index + 1}</th>
//                           <td className='p-2 text-center'>{vacancy.positionTitle}</td>
//                           {/* <td className='p-2 text-center'>{vacancy.title}</td> */}
//                           <td className='p-2 flex items-center justify-center'>
//                             <span>{vacancy.positionApplied}</span>
//                           </td>
//                           <td className='p-2 text-center'>{vacancy.skills}</td>
//                           <td className='p-2 relative'>
//                             <FontAwesomeIcon icon={faEllipsisVertical} onClick={() => togglePopup(index)} className=' cursor-pointer' />
//                             {clickedIndex === index && (
//                               <div className="absolute right-0 mt-2 mr-2 z-10"> {/* Adjust mt-10 for positioning */}
//                                 <div className="p-4 bg-white rounded-xl shadow-xl">
//                                   <div className="flex flex-col">
//                                     {/* First Row */}
//                                     <div className="flex justify-between mb-2">
//                                       <div className=" p-2 mr-2 flex items-center">
//                                         <img src="../src/assets/vacancies/Edit.png" alt="Edit.png" className='h-8 mr-4' />
//                                         <span className=' mr-8 text-lg hover:text-green-400'><a href="">Edit</a></span>
//                                       </div>
//                                       <div className="p-2 justify-end text-end">
//                                         <FontAwesomeIcon icon={faCircleXmark} onClick={() => togglePopup(-1)} className="text-red-500 h-8 mr-2 cursor-pointer" />
//                                       </div>
//                                     </div>
//                                     {/* Second Row */}
//                                     <div className="mb-2  flex items-center">
//                                       <img src="../src/assets/vacancies/RecommendedCandidates.png" alt="RecommendedCandidates.png" className='h-8 mr-5' />
//                                       <span className=' text-lg hover:text-green-400'><a href="" onClick={() => goToViewRecommendCan(vacancy)}>Recommended candidates</a></span>
//                                     </div>

//                                     <div className="flex justify-between mb-2">
//                                       <div className=" p-2 mr-2 flex items-center">
//                                         <img src="../src/assets/vacancies/Delete.png" alt="Delete.png" className='h-8 mr-3' />
//                                         <span className=' text-lg hover:text-green-400 cursor-pointer' onClick={() => openConfirmation(vacancy.id, vacancy.positionApplied, index)}>Delete</span>
//                                         {/* <span className=' text-lg hover:text-green-400 cursor-pointer' onClick={() => openConfirmation(vacancy.id, vacancy.position, index)}>Delete</span> */}
//                                       </div>
//                                     </div>
//                                     <div className="flex justify-between">
//                                       <div className="p-2 mr-2"></div>
//                                       <div className=" p-2 px-32 mr-2"></div>
//                                       <div className="p-2"></div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </>
//                   )
//                 }
//               </tbody>
//             </table>)
//           )
//         }

//         {

//         }
//         {/* Confirmation dialog */}
//         {confirmData && (
//           <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
//             <div className="bg-white p-8 rounded-lg">
//               <p className="text-xl mb-4">Are you sure to delete vacancy {confirmData.index + 1} and "{confirmData.position}"?</p>
//               <div className="flex justify-end">
//                 <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={handleConfirm}>Yes</button>
//                 <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeConfirmation}>No</button>
//               </div>
//             </div>
//           </div>
//         )}
//         {/* No data search pop-up */}
//         {noDataSearch && (
//           <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
//             <div className="bg-white p-8 rounded-lg">
//               <h1 className=' text-center text-2xl'>NO DATA!</h1>
//               <p className="text-xl mb-4">There is no data matching your search "{noDataSearch}"</p>
//               <div className='flex justify-center'>
//                 <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeNoDataSearchPopup}>Close</button>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </>
//   )
// }

// export default VacancyPage

//! End
// import React, { useState } from 'react'
// import Header from '../../components/Header'
// import { navigate } from 'wouter/use-browser-location'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCircleXmark, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
// import ShowConfirmationDialog from '../../components/ShowConfirmationDialog';

// interface Candidate {
//   No: number;
//   PositionTitle: string;
//   PositionApplied: string;
//   salary: string;
//   DateOfApplication: string;
//   Nationalities: string
// }

// const candidatesData: Candidate[] = [
//   {
//     No: 1,
//     PositionTitle: 'Engineering',
//     PositionApplied: 'Senior Developer',
//     salary: '100 USD',
//     DateOfApplication: 'Nov 28, 2023',
//     Nationalities: 'Chinese'
//   },
//   {
//     No: 2,
//     PositionTitle: 'Developer',
//     PositionApplied: 'Full Stack Developer',
//     salary: '150 USD',
//     DateOfApplication: 'Feb 5, 2024',
//     Nationalities: 'Burmese'
//   },
//   {
//     No: 3,
//     PositionTitle: 'DevOps',
//     PositionApplied: 'DevOps Engineer',
//     salary: '110 USD',
//     DateOfApplication: 'Jun 10, 2023',
//     Nationalities: 'American'
//   },
// ];

// const VacancyPage = () => {
//   const [clickedIndex, setClickedIndex] = useState<number | null>(null);
//   const [showConfirmationDialog, setShowConfirmationDialog] = useState<boolean>(false);
//   const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);


//   const togglePopup = (index: number) => {
//     if (clickedIndex === index) {
//       setClickedIndex(null); // Close the popup if clicking the same icon again
//     } else {
//       setClickedIndex(index);
//     }
//   };

//   const GoToAddVacancies = () => {
//     navigate('/AddVacancies')
//   }

//   const deleteCandidate = (candidate: Candidate) => {
//     // const updatedCandidatesData = candidatesData.filter((c) => c !== candidate);
//     candidatesData.splice(candidate.No - 1, 1);
//     setClickedIndex(null);
//     setCandidateToDelete(null);
//     setShowConfirmationDialog(false);
//   };

//   const confirmDelete = (candidate: Candidate) => {
//     setCandidateToDelete(candidate);
//     setShowConfirmationDialog(true);
//   };

//   const cancelDelete = () => {
//     setShowConfirmationDialog(false);
//   };

//   // const deleteCandidate = (index: number) => {
//   //   const updatedCandidatesData = candidatesData.filter((_, i) => i !== index);
//   //   candidatesData.splice(index, 1);
//   //   setClickedIndex(null);
//   //   console.log(updatedCandidatesData);
//   //   // Here you can perform any additional actions like making an API call to delete the data from the server
//   // };

//   return (
//     <>
//       <header>
//         <Header
//           candidateButtonClass='hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'
//           vacanciesButtonClass='bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'
//         />
//       </header>
//       <main className="p-4">
//         <div className='flex justify-between items-center'>
//           <div className=' flex items-center'>
//             <div className="mb-4 relative">
//               <input
//                 type="text"
//                 placeholder="Search Candidate"
//                 className="w-96 p-2 pr-10 border rounded border-gray-400"
//               />
//               <div className=" absolute inset-y-0 left-80 ml-8 flex items-center pr-3 pointer-events-none">
//                 <i className="fas fa-search text-gray-600"></i>
//               </div>
//             </div>
//           </div>
//           <div className='flex items-center space-x-2 px-2 mb-4'>
//             <button className=' bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'>Available position</button>
//             <button onClick={GoToAddVacancies} className=' hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'>Add Vacancies</button>
//           </div>
//         </div>
//         <div className='flex justify-between items-center'>
//           <div className=' flex items-center'>
//             <div className="mb-4 relative">
//               <h1>Available position</h1>
//             </div>
//           </div>
//           <div className='flex items-center space-x-2 px-2 mb-4'>
//             <h1>Total data: {candidatesData.length}</h1>
//           </div>
//         </div>
//         {candidatesData.length === 0 ? (
//           <div className=" flex justify-center items-center py-4">
//             <div className="  flex flex-col items-center px-72">
//               <img src="../src/assets/vacancies/VacancyNDA.png" alt="VacancyNDA.png" className='h-48' />
//               <h1 className='text-center mt-2 py-2 text-3xl font-bold'>No Data Available</h1>
//               <h1 className='text-center text-lg'>Please add a vacancy to make the data appear.</h1>
//             </div>
//           </div>
//         ) : (<table className='p-6 w-full bg-white rounded-xl shadow-md'>
//           <thead>
//             <tr>
//               <th className="p-2 font-normal border-b border-gray-300">No</th>
//               <th className='p-2 font-normal border-b border-gray-300'>Position title</th>
//               <th className='p-2 font-normal border-b border-gray-300'>Position applied</th>
//               <th className='p-2 font-normal border-b border-gray-300'>Salary</th>
//               <th className='p-2 font-normal border-b border-gray-300'>Date of application</th>
//               <th className='p-2 font-normal border-b border-gray-300'>Nationalities</th>
//               <th className='p-2 font-normal border-b border-gray-300' />
//             </tr>
//           </thead>
//           <tbody className='divide-y divide-gray-200'>
//             {candidatesData.map((candidate, index) => (
//               <tr key={index}>
//                 <th className="p-2">{candidate.No}</th>
//                 <td className='p-2 text-center'>{candidate.PositionTitle}</td>
//                 <td className='p-2 flex items-center justify-center'>
//                   {/* <img src="../src/assets/ProfileImage.png" alt="ProfileImage.png" className='h-8 mr-3' /> */}
//                   <span>{candidate.PositionApplied}</span>
//                 </td>
//                 <td className='p-2 text-center'>{candidate.salary}</td>
//                 <td className='p-2 text-center'>{candidate.DateOfApplication}</td>
//                 <td className='p-2 text-center'>{candidate.Nationalities}</td>
//                 {/* <td className='p-2 flex justify-end'> */}
//                 <td className='p-2 relative'>
//                   <FontAwesomeIcon icon={faEllipsisVertical} onClick={() => togglePopup(index)} className=' cursor-pointer' />
//                   {clickedIndex === index && (
//                     <div className="absolute right-0 mt-2 mr-2 z-10"> {/* Adjust mt-10 for positioning */}
//                       <div className="p-4 bg-white rounded-xl shadow-xl">
//                         <div className="flex flex-col">
//                           {/* First Row */}
//                           <div className="flex justify-between mb-2">
//                             <div className=" p-2 mr-2 flex items-center">
//                               <img src="../src/assets/vacancies/Edit.png" alt="Edit.png" className='h-8 mr-4' />
//                               <span className=' mr-8 text-lg hover:text-green-400'><a href="">Edit</a></span>
//                             </div>
//                             <div className="bg-gray-200 p-2 justify-end text-end">
//                               <FontAwesomeIcon icon={faCircleXmark} onClick={() => togglePopup(-1)} className="text-red-500 h-8 mr-2 cursor-pointer" />
//                             </div>
//                           </div>
//                           {/* Second Row */}
//                           <div className="mb-2  flex items-center">
//                             {/* <div className="bg-gray-200 p-2 mr-2 flex items-center px-20"> */}
//                             <img src="../src/assets/vacancies/RecommendedCandidates.png" alt="RecommendedCandidates.png" className='h-8 mr-5' />
//                             <span className=' text-lg hover:text-green-400'><a href="">Recommended candidates</a></span>
//                             {/* </div> */}
//                           </div>

//                           <div className="flex justify-between mb-2">
//                             <div className=" p-2 mr-2 flex items-center">
//                               <img src="../src/assets/vacancies/Delete.png" alt="Delete.png" className='h-8 mr-3' />
//                               {/* <span className=' text-lg hover:text-green-400 cursor-pointer' onClick={() => deleteCandidate(index)}>Delete</span> */}
//                               <span className=' text-lg hover:text-green-400 cursor-pointer' onClick={() => confirmDelete(candidate)}>Delete</span>
//                             </div>
//                             {/* <div className="bg-gray-200 p-2 mr-2">Third Column</div>
//                             <div className="bg-gray-200 p-2 mr-2 flex-grow">Recommended candidates</div> */}
//                           </div>
//                           {/* <div className="bg-gray-200 p-2 px-14 mr-2">Fourth Column</div>
//                           Second Row */}
//                           <div className="flex justify-between">
//                             <div className="p-2 mr-2"></div>
//                             <div className=" p-2 px-32 mr-2"></div>
//                             <div className="p-2"></div>
//                           </div>
//                           {/* Third Row
//                           <div className="flex justify-center">
//                             <div className="bg-gray-200 p-4">Sixth Column</div>
//                           </div> */}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>)}
//         {showConfirmationDialog && (
//           <ShowConfirmationDialog
//             candidateToDelete={candidateToDelete as Candidate}
//             onDelete={() => deleteCandidate(candidateToDelete as Candidate)}
//             onCancel={cancelDelete}
//           />
//         )}
//       </main>
//     </>
//   )
// }

// export default VacancyPage
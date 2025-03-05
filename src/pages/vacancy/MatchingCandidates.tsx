import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { fetchMatchingCandidates, MatchingCandidate, VacancyType } from '../../API/vacanciesApi';
import { useNavigate } from 'react-router-dom';
import { JellyfishSpinner } from 'react-spinners-kit';

interface MatchingCandidatesProps {
    token: string;
    setToken: (token: string | null) => void;  // Add this line to define the prop type
}

const MatchingCandidates: React.FC<MatchingCandidatesProps> = ({ token, setToken }) => {
    const searchParams = new URLSearchParams(window.location.search);
    const title = searchParams.get('title') || '';
    const position = searchParams.get('position') || '';
    const skills = searchParams.get('skills') || '';
    const [matchingCandidates, setMatchingCandidates] = useState<MatchingCandidate[]>([]);

    const [loading, setLoading] = useState<boolean>(true);


    const navigate = useNavigate();

    const GoToAvailableposition = () => {
        navigate('/vacancy-page');
    };

    const GoToAddVacancies = () => {
        navigate('/create-vacancy');
    };

    useEffect(() => {
        const fetchMatchingCandidatesData = async () => {
            setLoading(true); // Set loading to true before fetching data
            try {
                const vacancy: VacancyType = {
                    id: "", positionTitle: "", positionApplied: "", skills,
                    salary: 0,
                    currencyCode: ''
                };
                // const matchingCandidatesData = await fetchMatchingCandidates(vacancy, token);
                const matchingCandidatesData = await fetchMatchingCandidates(vacancy);
                console.log("matchingCandidatesData = ", matchingCandidatesData);
                setMatchingCandidates(matchingCandidatesData);
            } catch (error) {
                console.error('Error fetching matching candidates:', error);
            } finally {
                setLoading(false); // Stop loading after data is fetched
            }
        };

        fetchMatchingCandidatesData();
    }, [title, position, skills]);

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
                    <div className='flex items-center'></div>
                    <div className='flex items-center space-x-2 px-2 mb-4'>
                        <button onClick={GoToAvailableposition} className='bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'>Available position</button>
                        <button onClick={GoToAddVacancies} className='hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'>Add Vacancies</button>
                    </div>
                </div>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center'>
                        <div className="mb-4 relative">
                            <h1>Recommended candidates</h1>
                        </div>
                    </div>
                    <div className='flex items-center space-x-2 px-2 mb-4'>
                        <h1>Total data: {matchingCandidates.length}</h1>
                    </div>
                </div>

                {
                    loading ? (
                        // Show CombSpinner while data is being fetched
                        // <div className="loading-container" style={{ textAlign: 'center', marginTop: '20px' }}>
                        //     <JellyfishSpinner size={100} color="#ED1C24" />
                        //     <p>Fetching matching data, please hang tight...</p>
                        // </div>
                        // <div className="loading-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginTop: '20px', height: '100vh' }}>
                        <div className="loading-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginTop: '20px' }}>
                            <JellyfishSpinner size={120} color="#ED1C24" />
                            <p>Fetching matching data, please hang tight...</p>
                        </div>

                    ) : (
                        matchingCandidates.length === 0 ? (
                            <div className=" flex justify-center items-center py-4">
                                <div className="  flex flex-col items-center px-72">
                                    <img src="../src/assets/vacancies/matching.png" alt="VacancyNDA.png" className='h-48' />
                                    <h1 className='text-center mt-2 py-2 text-3xl font-bold'>No Data</h1>
                                    <h1 className='text-center text-lg'>No Data matching with the information that you have create vacancy.</h1>
                                </div>
                            </div>
                        ) : (
                            <table className='p-6 w-full bg-white rounded-xl shadow-md'>
                                <thead>
                                    <tr>
                                        <th className="p-2 font-normal border-b border-gray-300">
                                            {/* <input type="checkbox" className='cursor-pointer' /> */}
                                        </th>
                                        <th className='p-2 font-normal border-b border-gray-300'>Matching</th>
                                        <th className='p-2 font-normal border-b border-gray-300'>Candidate</th>
                                        <th className='p-2 font-normal border-b border-gray-300'>Desired position</th>
                                        <th className='p-2 font-normal border-b border-gray-300'>Skill</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-200'>
                                    {
                                        // matchingCandidates.length === 0 ? (
                                        //     <tr>
                                        //         <td colSpan={5} className='p-2 text-center'>
                                        //             No Data matching
                                        //         </td>
                                        //     </tr>
                                        // ) : (
                                        matchingCandidates.map((candidate, index) => (
                                            <tr key={index}>
                                                <th className="p-2">
                                                    {/* <input type="checkbox" className='cursor-pointer' /> */}
                                                </th>
                                                <td className='p-2 text-center'>{candidate.matchPercentage}%</td>
                                                <td className='p-2 flex items-center justify-center'>
                                                    <img src="../src/assets/ProfileImage.png" alt="ProfileImage.png" className='h-8 mr-3' />
                                                    <span>{candidate.candidate.candidateName}</span>
                                                </td>
                                                <td className='p-2 text-center'>{candidate.candidate.position}</td>
                                                <td className='p-2 text-center'>
                                                    {typeof candidate.candidate.skills === 'string'
                                                        ? candidate.candidate.skills.split(/(?=[A-Z])/).join(", ")
                                                        : Array.isArray(candidate.candidate.skills)
                                                            ? (candidate.candidate.skills as string[]).join(", ")
                                                            : 'N/A'}
                                                </td>
                                            </tr>
                                        ))
                                        // )
                                    }
                                </tbody>
                            </table>
                        )
                    )
                }

                {

                }

            </main>
        </>
    );
};

export default MatchingCandidates;


//! Below code is like upper one but without nodata matching message
// import React, { useEffect, useState } from 'react'
// import Header from '../../components/Header'
// // import { navigate } from 'wouter/use-browser-location'
// // import { useLocation } from 'react-router-dom';
// // import { useLocation } from 'react-router-dom';
// import { fetchMatchingCandidates, MatchingCandidate, VacancyType } from '../../API/vacanciesApi';
// import { useNavigate } from 'react-router-dom';

// // interface VacancyType {
// //     id: number;
// //     title: string;
// //     position: string;
// //     skills: string;
// // }

// // interface VacancyType {
// //     id: string;
// //     positionTitle: string;
// //     positionApplied: string;
// //     skills: string;
// // }

// // interface CandidateType {
// //     id: number;
// //     name: string;
// //     position: string;
// //     skills: string;
// // }

// // interface MatchingCandidate {
// //     candidate: CandidateType;
// //     matchPercentage: number;
// // }

// const MatchingCandidates = () => {
//     // const MatchingCandidates: React.FC = () => {
//     // const location = useLocation();
//     // const queryParams = new URLSearchParams(location.search);
//     // const title = queryParams.get('title') || '';
//     // const position = queryParams.get('position') || '';
//     // const skills = queryParams.get('skills') || '';
//     const searchParams = new URLSearchParams(window.location.search);
//     const title = searchParams.get('title') || '';
//     const position = searchParams.get('position') || '';
//     const skills = searchParams.get('skills') || '';
//     const [matchingCandidates, setMatchingCandidates] = useState<MatchingCandidate[]>([]);

//     const navigate = useNavigate();

//     const GoToAvailableposition = () => {
//         navigate('/vacancy-page')
//     }

//     const GoToAddVacancies = () => {
//         navigate('/create-vacancy')
//         // navigate('/AddVacancies')
//     }

//     useEffect(() => {
//         const fetchMatchingCandidatesData = async () => {
//             try {
//                 // const vacancy: VacancyType = { id: 0, title, position, skills };
//                 const vacancy: VacancyType = {
//                     id: "", positionTitle: "", positionApplied: "", skills,
//                     salary: 0,
//                     currencyCode: ''
//                 };
//                 const matchingCandidatesData = await fetchMatchingCandidates(vacancy);
//                 console.log("matchingCandidatesData = ", matchingCandidatesData);
//                 setMatchingCandidates(matchingCandidatesData);
//             } catch (error) {
//                 console.error('Error fetching matching candidates:', error);
//             }
//         };

//         fetchMatchingCandidatesData();
//     }, [title, position, skills]);

//     return (
//         <>
//             <header>
//                 <Header
//                     candidateButtonClass='hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'
//                     vacanciesButtonClass='bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'
//                 />
//             </header>
//             <main className="p-4">
//                 <div className='flex justify-between items-center'>
//                     <div className=' flex items-center'>
//                         {/* <div className="mb-4 relative">
//                             <input
//                                 type="text"
//                                 placeholder="Search Candidate"
//                                 className="w-96 p-2 pr-10 border rounded border-gray-400"
//                             />
//                             <div className=" absolute inset-y-0 left-80 ml-8 flex items-center pr-3 pointer-events-none">
//                                 <i className="fas fa-search text-gray-600"></i>
//                             </div>
//                         </div> */}
//                     </div>
//                     <div className='flex items-center space-x-2 px-2 mb-4'>
//                         <button onClick={GoToAvailableposition} className=' bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'>Available position</button>
//                         <button onClick={GoToAddVacancies} className=' hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'>Add Vacancies</button>
//                     </div>
//                 </div>
//                 <div className='flex justify-between items-center'>
//                     <div className=' flex items-center'>
//                         <div className="mb-4 relative">
//                             <h1>Recommended candidates</h1>
//                         </div>
//                     </div>
//                     <div className='flex items-center space-x-2 px-2 mb-4'>
//                         <h1>Total data: {matchingCandidates.length}</h1>
//                         {/* <h1>Total data: {candidatesData.length}</h1> */}
//                     </div>
//                 </div>

//                 <table className='p-6 w-full bg-white rounded-xl shadow-md'>
//                     <thead>
//                         <tr>
//                             <th className="p-2 font-normal border-b border-gray-300">
//                                 <input type="checkbox" className='cursor-pointer' />
//                             </th>
//                             <th className='p-2 font-normal border-b border-gray-300'>Matching</th>
//                             <th className='p-2 font-normal border-b border-gray-300'>Candidate</th>
//                             <th className='p-2 font-normal border-b border-gray-300'>Desired position</th>
//                             {/* <th className='p-2 font-normal border-b border-gray-300'>Salary</th> */}
//                             <th className='p-2 font-normal border-b border-gray-300'>Skill</th>
//                         </tr>
//                     </thead>
//                     <tbody className='divide-y divide-gray-200'>
//                         {matchingCandidates.map((candidate, index) => (
//                             <tr key={index}>
//                                 <th className="p-2">
//                                     <input type="checkbox" className='cursor-pointer' />
//                                 </th>
//                                 <td className='p-2 text-center'>{candidate.matchPercentage}%</td>
//                                 <td className='p-2 flex items-center justify-center'>
//                                     <img src="../src/assets/ProfileImage.png" alt="ProfileImage.png" className='h-8 mr-3' />
//                                     <span>{candidate.candidate.candidateName}</span>
//                                 </td>
//                                 <td className='p-2 text-center'>{candidate.candidate.position}</td>
//                                 {/* <td className='p-2 text-center'>{candidate.salary}</td> */}
//                                 {/* <td className='p-2 text-center'>
//                                     {candidate.candidate.skills}
//                                 </td> */}
//                                 <td className='p-2 text-center'>
//                                     {/* {candidate.candidate.skills} */}
//                                     {
//                                         typeof candidate.candidate.skills === 'string'
//                                             ? candidate.candidate.skills.split(/(?=[A-Z])/).join(", ")
//                                             : Array.isArray(candidate.candidate.skills)
//                                                 ? (candidate.candidate.skills as string[]).join(", ")
//                                                 : 'N/A'
//                                     }
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </main>
//         </>
//     )
// }

// export default MatchingCandidates;



// import React from 'react'
// import Header from '../../components/Header'
// import { navigate } from 'wouter/use-browser-location'

// interface Candidate {
//     matching: number;
//     candidate: string;
//     position: string;
//     salary: string;
//     skill: string;
// }

// const candidatesData: Candidate[] = [
//     {
//         matching: 80,
//         candidate: 'Mr. Alan',
//         position: 'Senior Developer',
//         salary: '100 USD',
//         skill: 'Java',
//     },
//     {
//         matching: 60,
//         candidate: 'Mr. Kyaw Oo',
//         position: 'Full Stack Developer',
//         salary: '150 USD',
//         skill: 'Angular',
//     },
//     {
//         matching: 30,
//         candidate: 'Mr. Danny',
//         position: 'DevOps Engineer',
//         salary: '110 USD',
//         skill: 'React',
//     },
// ];

// // type Candidate = {
// //     match: number;
// //     name: string;
// //     position: string;
// //     salary: string;
// //     skill: string;
// // };

// // const candidates: Candidate[] = [
// //     { match: 80, name: 'Mr. Alan', position: 'Senior Developer', salary: '100 USD', skill: 'Java' },
// //     { match: 50, name: 'Mr. Kyaw Oo', position: 'Full Stack Developer', salary: '150 USD', skill: 'Angular' },
// //     { match: 70, name: 'Mr. Danny', position: 'DevOps Engineer', salary: '110 USD', skill: 'React' },
// // ];

// // const CandidateRow: React.FC<Candidate> = ({ match, name, position, salary, skill }) => (
// //     <tr>
// //         <td><input type="checkbox" /></td>
// //         <td>{match}%</td>
// //         <td>{name}</td>
// //         <td>{position}</td>
// //         <td>{salary}</td>
// //         <td>{skill}</td>
// //     </tr>
// // );

// const RecommendedCandidates = () => {
//     // const RecommendedCandidates: React.FC = () => {

//     const GoToAvailableposition = () => {
//         navigate('/VacancyPage')
//     }

//     const GoToAddVacancies = () => {
//         navigate('/AddVacancies')
//     }

//     return (
//         <>
//             <header>
//                 <Header
//                     candidateButtonClass='hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'
//                     vacanciesButtonClass='bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'
//                 />
//             </header>
//             <main className="p-4">
//                 <div className='flex justify-between items-center'>
//                     <div className=' flex items-center'>
//                         <div className="mb-4 relative">
//                             <input
//                                 type="text"
//                                 placeholder="Search Candidate"
//                                 className="w-96 p-2 pr-10 border rounded border-gray-400"
//                             />
//                             <div className=" absolute inset-y-0 left-80 ml-8 flex items-center pr-3 pointer-events-none">
//                                 <i className="fas fa-search text-gray-600"></i>
//                             </div>
//                         </div>
//                     </div>
//                     <div className='flex items-center space-x-2 px-2 mb-4'>
//                         <button onClick={GoToAvailableposition} className=' bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'>Available position</button>
//                         <button onClick={GoToAddVacancies} className=' hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'>Add Vacancies</button>
//                     </div>
//                 </div>
//                 <div className='flex justify-between items-center'>
//                     <div className=' flex items-center'>
//                         <div className="mb-4 relative">
//                             <h1>Recommended candidates</h1>
//                         </div>
//                     </div>
//                     <div className='flex items-center space-x-2 px-2 mb-4'>
//                         <h1>Total data: {candidatesData.length}</h1>
//                     </div>
//                 </div>

//                 <table className='p-6 w-full bg-white rounded-xl shadow-md'>
//                     <thead>
//                         <tr>
//                             <th className="p-2 font-normal border-b border-gray-300">
//                                 <input type="checkbox" className='cursor-pointer' />
//                             </th>
//                             <th className='p-2 font-normal border-b border-gray-300'>Matching</th>
//                             <th className='p-2 font-normal border-b border-gray-300'>Candidate</th>
//                             <th className='p-2 font-normal border-b border-gray-300'>Desired position</th>
//                             <th className='p-2 font-normal border-b border-gray-300'>Salary</th>
//                             <th className='p-2 font-normal border-b border-gray-300'>Skill</th>
//                         </tr>
//                     </thead>
//                     <tbody className='divide-y divide-gray-200'>
//                         {candidatesData.map((candidate, index) => (
//                             <tr key={index}>
//                                 <th className="p-2">
//                                     <input type="checkbox" className='cursor-pointer' />
//                                 </th>
//                                 <td className='p-2 text-center'>{candidate.matching}%</td>
//                                 <td className='p-2 flex items-center justify-center'>
//                                     <img src="../src/assets/ProfileImage.png" alt="ProfileImage.png" className='h-8 mr-3' />
//                                     <span>{candidate.candidate}</span>
//                                 </td>
//                                 <td className='p-2 text-center'>{candidate.position}</td>
//                                 <td className='p-2 text-center'>{candidate.salary}</td>
//                                 <td className='p-2 text-center'>{candidate.skill}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//                 {/* <div className="flex flex-col w-full overflow-auto shadow-md rounded-md">
//                     <div className="w-full bg-gray-200 px-4 py-2 flex flex-row justify-between items-center text-xs font-medium">
//                         <span>Recommended candidates</span>
//                         <span>Total data: {candidatesData.length}</span>
//                     </div>
//                     <div className="w-full divide-y divide-gray-200">
//                         <div className="px-4 py-2 flex flex-row justify-between text-xs font-medium">
//                             <span><input type="checkbox" /></span>
//                             <span>Matching</span>
//                             <span>Candidate</span>
//                             <span>Desired position</span>
//                             <span>Salary</span>
//                             <span>Skill</span>
//                         </div>
//                         {candidatesData.map((candidate, index) => (
//                             <div key={index} className="px-4 py-2 flex flex-row justify-between text-sm">
//                                 <span><input type="checkbox" /></span>
//                                 <span>{candidate.matching}%</span>
//                                 <span>{candidate.candidate}</span>
//                                 <span>{candidate.position}</span>
//                                 <span>{candidate.salary}</span>
//                                 <span>{candidate.skill}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 <div className='shadow-xl'>
//                     <table className="w-full rounded overflow-hidden divide-y divide-gray-200">
//                         <thead className="bg-red-500">
//                             <tr>
//                                 <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Matching
//                                 </th>
//                                 <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Candidate
//                                 </th>
//                                 <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Desired Position
//                                 </th>
//                                 <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Salary
//                                 </th>
//                                 <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Skill
//                                 </th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {candidates.map((candidate) => (
//                                 <CandidateRow key={candidate.name} {...candidate} />
//                             ))}
//                         </tbody>
//                     </table>
//                 </div> */}
//             </main>
//         </>
//     )
// }

// export default RecommendedCandidates
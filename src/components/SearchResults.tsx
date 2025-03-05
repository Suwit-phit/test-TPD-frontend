// src/components/SearchResults.tsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { Candidate as SearchCandidate } from '../API/searchApi';
import { useNavigate } from 'react-router-dom';

interface SearchResultsProps {
    results: SearchCandidate[];
    searching: boolean;
    clickedIndex: number | null;
    togglePopup: (index: number) => void;
    goToEditCandidate: (id: string) => void;
    // confirmDelete: (id: string) => void;
    handleDeleteClick: (id: string, candidateName: string) => void;
    noData: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
    results,
    searching,
    clickedIndex,
    togglePopup,
    goToEditCandidate,
    // confirmDelete,
    handleDeleteClick,
    noData
}) => {
    const navigate = useNavigate();
    const goToViewCandidate = (id: string) => {
        console.log("ID in goToViewCandidate = ", id);
        navigate(`/view-Candidate/${id}`);
    };

    return (
        <>
            {searching ? (
                <>
                    {noData ? (
                        null
                    ) : (
                        <>
                            {results.map((result, index) => (
                                <tr key={result.id} className='cursor-pointer hover:bg-slate-100' onClick={() => goToViewCandidate(result.id)}>
                                    <td className='p-2 flex items-center justify-center'>
                                        <img src="../src/assets/ProfileImage.png" alt="ProfileImage.png" className='h-8' />
                                    </td>
                                    <td className='p-2 text-center'>
                                        {result.candidateName}
                                    </td>
                                    <td className='p-2 text-center'>
                                        {result.position}
                                    </td>
                                    <td className='p-2 text-center'>
                                        {
                                            typeof result.skills === 'string'
                                                ? result.skills.split(/(?=[A-Z])/).join(", ")
                                                : Array.isArray(result.skills)
                                                    ? (result.skills as string[]).join(", ")
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
                                                                <span className='mr-8 text-lg hover:text-green-400'><a href="" onClick={(e) => { e.stopPropagation(); goToEditCandidate(result.id) }}>Edit</a></span>
                                                            </div>
                                                            <div className="p-2 justify-end text-end">
                                                                <FontAwesomeIcon icon={faCircleXmark} onClick={(e) => { e.stopPropagation(); togglePopup(-1) }} className="text-red-500 h-8 mr-2 cursor-pointer" />
                                                            </div>
                                                        </div>
                                                        <div key={result.id} className="flex justify-between mb-2">
                                                            <div className="p-2 mr-2 flex items-center">
                                                                <img src="../src/assets/vacancies/Delete.png" alt="Delete.png" className="h-8 mr-3" />
                                                                <span
                                                                    className="text-lg hover:text-green-400 cursor-pointer"
                                                                    onClick={(e) => { e.stopPropagation(); handleDeleteClick(result.id, result.candidateName); }}
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
                        </>
                    )}
                </>
            ) : null}
        </>
    );
};

export default SearchResults;

// // src/components/SearchResults.tsx

// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
// import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
// import { Candidate as SearchCandidate } from '../API/searchApi';
// import { useNavigate } from 'react-router-dom';

// interface SearchResultsProps {
//     results: SearchCandidate[];
//     searching: boolean;
//     clickedIndex: number | null;
//     togglePopup: (index: number) => void;
//     goToEditCandidate: (id: string) => void;
//     // confirmDelete: (id: string) => void;
//     handleDeleteClick: (id: string, candidateName: string) => void;
//     noData: boolean;
// }

// const SearchResults: React.FC<SearchResultsProps> = ({
//     results,
//     searching,
//     clickedIndex,
//     togglePopup,
//     goToEditCandidate,
//     // confirmDelete,
//     handleDeleteClick,
//     noData
// }) => {
//     const navigate = useNavigate();
//     const goToViewCandidate = (id: string) => {
//         console.log("ID in goToViewCandidate = ", id);
//         navigate(`/view-Candidate/${id}`);
//     };

//     return (
//         <>
//             {searching ? (
//                 <>
//                     {noData ? (
//                         null
//                     ) : (
//                         <>
//                             {results.map((result, index) => (
//                                 <tr key={result.id} className='cursor-pointer hover:bg-slate-100' onClick={() => goToViewCandidate(result.id)}>
//                                     <td className='p-2 flex items-center justify-center'>
//                                         <img src="../src/assets/ProfileImage.png" alt="ProfileImage.png" className='h-8' />
//                                     </td>
//                                     <td className='p-2 text-center'>
//                                         {result.candidateName}
//                                     </td>
//                                     <td className='p-2 text-center'>
//                                         {result.position}
//                                     </td>
//                                     <td className='p-2 text-center'>
//                                         {
//                                             typeof result.skills === 'string'
//                                                 ? result.skills.split(/(?=[A-Z])/).join(", ")
//                                                 : Array.isArray(result.skills)
//                                                     ? (result.skills as string[]).join(", ")
//                                                     : 'N/A'
//                                         }
//                                     </td>
//                                     <td className='p-2 relative'>
//                                         <FontAwesomeIcon icon={faEllipsisVertical} onClick={(e) => {
//                                             e.stopPropagation();
//                                             togglePopup(index);
//                                         }} className='p-2 hover:bg-slate-200 rounded-full cursor-pointer' />

//                                         {clickedIndex === index && (
//                                             <div className="absolute right-0 mt-2 mr-2 z-10">
//                                                 <div className="p-4 bg-white rounded-xl shadow-xl">
//                                                     <div className="flex flex-col">
//                                                         <div className="flex justify-between mb-2">
//                                                             <div className="p-2 mr-2 flex items-center">
//                                                                 <img src="../src/assets/vacancies/Edit.png" alt="Edit.png" className='h-8 mr-4' />
//                                                                 <span className='mr-8 text-lg hover:text-green-400'><a href="" onClick={(e) => { e.stopPropagation(); goToEditCandidate(result.id) }}>Edit</a></span>
//                                                             </div>
//                                                             <div className="p-2 justify-end text-end">
//                                                                 <FontAwesomeIcon icon={faCircleXmark} onClick={(e) => { e.stopPropagation(); togglePopup(-1) }} className="text-red-500 h-8 mr-2 cursor-pointer" />
//                                                             </div>
//                                                         </div>
//                                                         <div key={result.id} className="flex justify-between mb-2">
//                                                             <div className="p-2 mr-2 flex items-center">
//                                                                 <img src="../src/assets/vacancies/Delete.png" alt="Delete.png" className="h-8 mr-3" />
//                                                                 <span
//                                                                     className="text-lg hover:text-green-400 cursor-pointer"
//                                                                     onClick={(e) => { e.stopPropagation(); handleDeleteClick(result.id, result.candidateName); }}
//                                                                 >
//                                                                     Delete
//                                                                 </span>
//                                                             </div>
//                                                         </div>
//                                                         <div className="flex justify-between">
//                                                             <div className="p-2 mr-2"></div>
//                                                             <div className="p-2 px-32 mr-2"></div>
//                                                             <div className="p-2"></div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </td>
//                                 </tr>
//                                 // <tr key={result.id} className='cursor-pointer hover:bg-slate-100' onClick={() => goToViewCandidate(result.id)}>
//                                 //     <th className="p-2">
//                                 //         {/* <input type="checkbox" className='cursor-pointer' /> */}
//                                 //     </th>
//                                 //     <td className='p-2 flex items-center justify-center'>
//                                 //         <img src="../src/assets/ProfileImage.png" alt="ProfileImage.png" className='h-8' />
//                                 //     </td>
//                                 //     <td className='p-2 text-center'>{result.candidateName}</td>
//                                 //     <td className='p-2 text-center'>{result.position}</td>
//                                 //     {/* <td className='p-2 text-center'>{result.skills}</td> */}
//                                 //     {/* <td className='p-2 text-center'>
//                                 //         {result.skills.split(', ').map((skill, index) => (
//                                 //             <span key={index} className="mr-1">
//                                 //                 {skill}
//                                 //             </span>
//                                 //         ))}
//                                 //     </td> */}
//                                 //     <td className='p-2 text-center'>
//                                 //         {
//                                 //             typeof result.skills === 'string'
//                                 //                 ? result.skills.split(/(?=[A-Z])/).join(", ")
//                                 //                 : Array.isArray(result.skills)
//                                 //                     ? (result.skills as string[]).join(", ")
//                                 //                     : 'N/A'
//                                 //         }
//                                 //     </td>
//                                 //     <td className='p-2 relative'>
//                                 //         <FontAwesomeIcon icon={faEllipsisVertical} onClick={(e) => { e.stopPropagation(); togglePopup(index) }} className='cursor-pointer' />
//                                 //         {clickedIndex === index && (
//                                 //             <div className="absolute right-0 mt-2 mr-2 z-10">
//                                 //                 <div className="p-4 bg-white rounded-xl shadow-xl">
//                                 //                     <div className="flex flex-col">
//                                 //                         <div className="flex justify-between mb-2">
//                                 //                             <div className="p-2 mr-2 flex items-center">
//                                 //                                 <img src="../src/assets/vacancies/Edit.png" alt="Edit.png" className='h-8 mr-4' />
//                                 //                                 <span className='mr-8 text-lg hover:text-green-400'>
//                                 //                                     <a href="#" onClick={(e) => { e.stopPropagation(); goToEditCandidate(result.id) }}>Edit</a>
//                                 //                                 </span>
//                                 //                             </div>
//                                 //                             <div className="p-2 justify-end text-end">
//                                 //                                 <FontAwesomeIcon icon={faCircleXmark} onClick={(e) => { e.stopPropagation(); togglePopup(-1) }} className="text-red-500 h-8 mr-2 cursor-pointer" />
//                                 //                             </div>
//                                 //                         </div>
//                                 //                         <div className="flex justify-between mb-2">
//                                 //                             <div className="p-2 mr-2 flex items-center">
//                                 //                                 <img src="../src/assets/vacancies/Delete.png" alt="Delete.png" className='h-8 mr-3' />
//                                 //                                 <span className='text-lg hover:text-green-400 cursor-pointer' onClick={(e) => { e.stopPropagation(); confirmDelete(result.id) }}>Delete</span>
//                                 //                             </div>
//                                 //                         </div>
//                                 //                         <div className="flex justify-between">
//                                 //                             <div className="p-2 mr-2"></div>
//                                 //                             <div className="p-2 px-32 mr-2"></div>
//                                 //                             <div className="p-2"></div>
//                                 //                         </div>
//                                 //                     </div>
//                                 //                 </div>
//                                 //             </div>
//                                 //         )}
//                                 //     </td>
//                                 // </tr>
//                             ))}
//                         </>
//                     )}
//                 </>
//             ) : null}
//         </>
//     );
// };

// export default SearchResults;

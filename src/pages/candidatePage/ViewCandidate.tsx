import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import { CandidateType, deleteAttachment, deleteCandidate, downloadAttachment, fetchCandidateById, getImageUrl, updateAttachment, updateCandidate, updateImage, uploadImage } from '../../API/candidatesApi';
import { CandidateType, deleteAttachment, deleteCandidate, downloadAttachment, fetchCandidateById, updateAttachment, updateCandidate, updateImage, uploadImage } from '../../API/candidatesApi';
import { ImageComponent } from '../candidatePage/ImageComponent';
import CommentsList from './CommentsList';
// import { getUserProfileById, updateUserProfile, updateAttachment, deleteAttachment, deleteUserProfile, updateImage, getImageUrl, uploadImage } from '../services/api';
// import { Candidate } from '../types';

interface ViewCandidateProps {
    token: string;
    // candidateId: string;
    // setToken: (token: string | null) => void;  // Add this line to define the prop type
}

const ViewCandidate: React.FC<ViewCandidateProps> = ({ token }) => {
    const { id } = useParams<{ id: string }>();
    // const { id } = useParams();
    const [candidate, setCandidate] = useState<CandidateType | null>(null);
    const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);


    const navigate = useNavigate();

    useEffect(() => {
        const fetchCandidate = async () => {
            console.log("id in ViewCandidate = ", id)
            const response = await fetchCandidateById(token, id!);
            // const response = await getCandidateById(id!);
            setCandidate(response || null);
        };

        fetchCandidate();
    }, [id]);

    const handleUpdateProfile = async () => {
        if (candidate) {
            try {
                // Update profile
                const profileResponse = await updateCandidate(token, id!, candidate);
                setCandidate(profileResponse || null);
                // setCandidate(profileResponse.data);

                // Update attachment if file is selected
                if (attachmentFile) {
                    await updateAttachment(token, id!, attachmentFile);
                    alert('Attachment updated successfully');
                }

                // Update image if file is selected
                // if (imageFile) {
                //     console.log("Under imageFile");
                //     console.log("imageFile: ", imageFile);
                //     console.log("imageFile.name: ", imageFile.name);
                //     if ()
                //     // Assuming there's a specific image to update, modify as needed
                //     const fileName = candidate.images[0].fileName; // Example: updating the first image
                //     console.log("fileName: ", fileName)
                //     console.log("imageFile: ", imageFile);
                //     // await updateImage(id!, fileName, imageFile);
                //     // alert('Image updated successfully');
                //     const imageResponse = await updateImage(id!, fileName, imageFile);
                //     // setMessage(imageResponse.data.message);
                //     console.log("imageResponse: ", imageResponse);
                // }
                // Update image if file is selected
                if (imageFile) {
                    console.log("Under imageFile");
                    console.log("imageFile: ", imageFile);
                    console.log("imageFile.name: ", imageFile.name);

                    // Ensure candidate.images exists and has at least one element
                    if (candidate.images && candidate.images.length > 0) {
                        const fileName = candidate.images[0].fileName; // Example: updating the first image
                        console.log("fileName: ", fileName);

                        // const imageResponse = await updateImage(id!, fileName, imageFile);
                        const imageResponse = await updateImage(token, id!, fileName, imageFile);
                        console.log("imageResponse: ", imageResponse);
                    } else {
                        console.error('No images found in candidate');
                        // const imageResponse = await updateImage(id!, imageFile.name, imageFile);
                        // console.log("imageResponse: ", imageResponse);
                        // await uploadImage(id!, imageFile);
                        await uploadImage(token, id!, imageFile);
                    }
                }

                // Clear file inputs
                setAttachmentFile(null);
                setImageFile(null);

                alert('Profile and associated files updated successfully');
                navigate("/");
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Failed to update profile or associated files');
            }
        }
    };

    const handleDeleteAttachment = async (fileName: string) => {
        try {
            console.log("fileName: ", fileName);
            // await deleteAttachment(id!, fileName);
            await deleteAttachment(token, id!, fileName);
            // alert('Attachment deleted successfully');
            setCandidate({
                ...candidate!,
                attachments: candidate!.attachments.filter((attachment) => attachment.fileName !== fileName),
            });
        } catch (error) {
            console.error('Error deleting attachment:', error);
            alert('Failed to delete attachment');
        }
    };

    const handleDeleteProfile = async () => {
        try {
            // await deleteCandidate(id!);
            await deleteCandidate(token, id!);
            alert('Profile deleted successfully');
            // Redirect to profile list or another appropriate action
        } catch (error) {
            console.error('Error deleting profile:', error);
            alert('Failed to delete profile');
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleUpdateProfile();
    };

    // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files && e.target.files[0]) {
    //         // setImageFile(e.target.files[0]);
    //         const file = e.target.files[0];
    //         console.log("In CandidateDetail.tsx \n Under const file = e.target.files[0];")
    //         console.log("file: ", file);
    //         setImageFile(file);
    //     }
    // };
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
        }
    };

    //* downloadAttachment
    const handleDownloadClick = (profileId: string, fileName: string) => {
        console.log('Enter handleDownloadClick');
        // downloadAttachment(profileId, fileName);
        downloadAttachment(token, profileId, fileName);
    };

    if (!candidate) return <div className="flex items-center justify-center h-screen">Loading...</div>;



    return (
        <>
            <div className="container mx-auto p-4 flex justify-center gap-x-1">
                <div className="w-full max-w-2xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4 container mx-auto p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col items-center mb-4 relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="w-36 h-36 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full cursor-pointer"
                            >
                                {imageFile ? (
                                    <img
                                        src={URL.createObjectURL(imageFile)}
                                        alt="Profile"
                                        className="w-full h-full object-cover rounded-full cursor-pointer"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            window.open(URL.createObjectURL(imageFile), '_blank');
                                        }}
                                    />
                                ) : (
                                    // Assuming `candidate.images` is available in the scope of this component
                                    candidate.images.length !== 0 ? (
                                        candidate.images.map((image) => (
                                            <ImageComponent
                                                key={image.fileName}
                                                token={token}
                                                id={id!}
                                                image={image}
                                            />
                                        ))
                                    ) : (
                                        <span className="text-gray-500 text-2xl">
                                            <img className="w-8 h-8" src="assets/user.png" alt="Default" />
                                        </span>
                                    )
                                )}
                            </label>
                            <label
                                htmlFor="file-upload"
                                className="absolute bottom-0 right-60 flex items-center justify-center text-white cursor-pointer"
                            >
                                <img
                                    className="w-8 h-8"
                                    src={"../assets/image-upload.png"}
                                    alt="upload"
                                />
                            </label>
                        </div>
                        {/* <div className="flex flex-col items-center mb-4 relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="w-36 h-36 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full cursor-pointer"
                        >
                            {imageFile ? (
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full cursor-pointer"
                                    onClick={() => window.open(URL.createObjectURL(imageFile), '_blank')}
                                />
                            ) : candidate.images.length !== 0 ? (
                                candidate.images.map((image) => (
                                    <ImageComponent
                                        key={image.fileName}
                                        token={token}
                                        id={id!}
                                        image={image}
                                    />
                                    // <div key={image.fileName} className="flex items-center space-x-2">
                                    //     <img
                                    //         // src={getImageUrl(id!, image.fileName)}
                                    //         src={getImageUrl(token, id!, image.fileName)}
                                    //         alt={image.fileName}
                                    //         className="w-full h-full object-cover rounded-full cursor-pointer"
                                    //         // onClick={() => window.open(getImageUrl(id!, image.fileName), '_blank')}
                                    //         onClick={async () => window.open(await getImageUrl(token, id!, image.fileName), '_blank')}
                                    //     />
                                    // </div>
                                ))
                            ) : (
                                <span className="text-gray-500 text-2xl">
                                    <img className="w-8 h-8" src="assets/user.png" alt="picture.png" />
                                </span>
                            )}
                        </label>
                        <label
                            htmlFor="file-upload"
                            className="absolute bottom-0 right-60 flex items-center justify-center text-white cursor-pointer"
                        >
                            <img
                                className="w-8 h-8"
                                src={"assets/image-upload.png"}
                                alt="upload"
                            />
                        </label>
                    </div> */}
                        <h1 className='text-base font-bold flex justify-center'>{candidate.courtesyTitle} {candidate.candidateName}</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">Courtesy title</label>
                                <select
                                    className="border p-2 w-full"
                                    value={candidate.courtesyTitle}
                                    onChange={(e) => setCandidate({ ...candidate, courtesyTitle: e.target.value })}
                                    required
                                >
                                    <option value="">Select Title</option>
                                    <option value="Mr.">Mr.</option>
                                    <option value="Mrs.">Mrs.</option>
                                    <option value="Ms.">Ms.</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    className="border p-2 w-full"
                                    value={candidate.candidateName}
                                    onChange={(e) => setCandidate({ ...candidate, candidateName: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Birth</label>
                                <input
                                    type="date"
                                    className="border p-2 w-full"
                                    value={candidate.dateOfBirth}
                                    onChange={(e) => setCandidate({ ...candidate, dateOfBirth: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Position</label>
                                <input
                                    type="text"
                                    className="border p-2 w-full"
                                    value={candidate.position}
                                    onChange={(e) => setCandidate({ ...candidate, position: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Salary</label>
                                <input
                                    type="number"
                                    className="border p-2 w-full"
                                    value={candidate.salary}
                                    onChange={(e) => setCandidate({ ...candidate, salary: parseFloat(e.target.value) })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Employment Type</label>
                                <input
                                    type="text"
                                    className="border p-2 w-full"
                                    value={candidate.employmentType}
                                    onChange={(e) => setCandidate({ ...candidate, employmentType: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Industry</label>
                                <input
                                    type="text"
                                    className="border p-2 w-full"
                                    value={candidate.industry}
                                    onChange={(e) => setCandidate({ ...candidate, industry: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700">Education Levels</label>
                            {candidate.educationLevels.map((level, index) => (
                                <div key={index} className="flex mb-2">
                                    <input
                                        type="text"
                                        className="border p-2 w-full"
                                        value={level}
                                        onChange={(e) =>
                                            setCandidate({
                                                ...candidate,
                                                educationLevels: candidate.educationLevels.map((lvl, i) => (i === index ? e.target.value : lvl)),
                                            })
                                        }
                                        required
                                    />
                                    {candidate.educationLevels.length > 1 && (
                                        <button
                                            type="button"
                                            className="ml-2 text-red-500"
                                            onClick={() => setCandidate({
                                                ...candidate,
                                                educationLevels: candidate.educationLevels.filter((_, i) => i !== index),
                                            })}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" className="text-blue-500" onClick={() => setCandidate({
                                ...candidate,
                                educationLevels: [...candidate.educationLevels, ''],
                            })}>
                                + Add More Education Level
                            </button>
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700">Skills</label>
                            {candidate.skills.map((skill, index) => (
                                <div key={index} className="flex mb-2">
                                    <input
                                        type="text"
                                        className="border p-2 w-full"
                                        value={skill}
                                        onChange={(e) => setCandidate({
                                            ...candidate,
                                            skills: candidate.skills.map((sk, i) => (i === index ? e.target.value : sk)),
                                        })}
                                        required
                                    />
                                    {candidate.skills.length > 1 && (
                                        <button
                                            type="button"
                                            className="ml-2 text-red-500"
                                            onClick={() => setCandidate({
                                                ...candidate,
                                                skills: candidate.skills.filter((_, i) => i !== index),
                                            })}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" className="text-blue-500" onClick={() => setCandidate({
                                ...candidate,
                                skills: [...candidate.skills, ''],
                            })}>
                                + Add More Skills
                            </button>
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700">Phone Number</label>
                            <input
                                type="text"
                                className="border p-2 w-full"
                                value={candidate.phoneNumber}
                                onChange={(e) => setCandidate({ ...candidate, phoneNumber: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                className="border p-2 w-full"
                                value={candidate.email}
                                onChange={(e) => setCandidate({ ...candidate, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700">Contact Types</label>
                            {candidate.contactTypes.map((contact, index) => (
                                <div key={index} className="flex mb-2">
                                    <input
                                        type="text"
                                        className="border p-2 w-full"
                                        value={contact.type}
                                        onChange={(e) => setCandidate({
                                            ...candidate,
                                            contactTypes: candidate.contactTypes.map((ct, i) => (i === index ? { ...ct, type: e.target.value } : ct)),
                                        })}
                                        required
                                    />
                                    <input
                                        type="url"
                                        className="border p-2 w-full ml-2"
                                        value={contact.url}
                                        onChange={(e) => setCandidate({
                                            ...candidate,
                                            contactTypes: candidate.contactTypes.map((ct, i) => (i === index ? { ...ct, url: e.target.value } : ct)),
                                        })}
                                        required
                                    />
                                    {candidate.contactTypes.length > 1 && (
                                        <button
                                            type="button"
                                            className="ml-2 text-red-500"
                                            onClick={() => setCandidate({
                                                ...candidate,
                                                contactTypes: candidate.contactTypes.filter((_, i) => i !== index),
                                            })}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" className="text-blue-500" onClick={() => setCandidate({
                                ...candidate,
                                contactTypes: [...candidate.contactTypes, { type: '', url: '' }],
                            })}>
                                + Add More Contact Type
                            </button>
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700">Attachments</label>
                            <input
                                type="file"
                                multiple
                                className="border p-2 w-full"
                                onChange={(e) => e.target.files && setAttachmentFile(e.target.files[0])}
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-4 bg-blue-500 text-white p-2 rounded"
                        >
                            Submit
                        </button>
                    </form>
                    <div className="mt-4">
                        <h2 className="text-xl font-bold mb-4">Attachments</h2>
                        <ul>
                            {candidate.attachments.map((attachment) => (
                                <li key={attachment.fileName} className="border p-2 mb-2 flex justify-between">
                                    <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                        {attachment.fileName}
                                    </a>
                                    <div className="flex space-x-2">
                                        <button
                                            className="p-2 bg-green-500 text-white rounded"
                                            // onClick={() => handleDownload(attachment.id, attachment.fileName)}
                                            onClick={() => handleDownloadClick(candidate.id!, attachment.fileName)}
                                        >
                                            Download
                                        </button>
                                        <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteAttachment(attachment.fileName)}>
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button className="bg-red-500 text-white px-4 py-2 rounded mt-4" onClick={handleDeleteProfile}>
                        Delete Profile
                    </button>
                </div>
                {/* <CommentsList token={token} candidateId={candidateId} authorId={authorId} /> */}
                {/* <CommentsList token={''} /> */}
                <CommentsList candidateId={id!} token={token} />

            </div>
        </>
    );
};


export default ViewCandidate;

//! Below code is Good but the data is note complete like in the Backend
// import { useParams, Link } from 'wouter';
// import React, { useState, useEffect } from 'react';
// // import { fetchEmployeeById, updateEmployee } from '../API/employeesApi';
// import { navigate } from 'wouter/use-browser-location';
// import { fetchCandidateById, updateCandidate } from '../../API/candidatesApi';
// // import { fetchEmployeeById, updateEmployee } from '../../API/candidatesApi';

// interface CandidateType {
//     id: number;
//     candidateName: string;
//     position: string;
//     skills: string;
// }

// const ViewCandidate: React.FC = () => {
//     const [candidateData, setCandidateData] = useState<CandidateType>({
//         id: 0,
//         candidateName: '',
//         position: '',
//         skills: ''
//     });
//     const { id } = useParams<{ id: string }>();
//     // const [, navigate] = useRoute('/:id');

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const data = await fetchCandidateById(parseInt(id, 10));
//                 setCandidateData(data);
//             } catch (error) {
//                 console.error('p0: number, candidate: CandidateTypeCandidateTypeCandidateTypee:', error);
//             }
//         };
//         fetchData();
//     }, [id]);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setCandidateData({
//             ...candidateData,
//             [name]: value
//         });
//     };

//     const handleUpdateCandidate = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             await updateCandidate(parseInt(id, 10), candidateData);
//             navigate('/');
//         } catch (error) {
//             console.error('Error updating candidate:', error);
//         }
//     };

//     return (
//         <div>
//             <h1>Update Candidate</h1>
//             <form onSubmit={handleUpdateCandidate}>
//                 <div>
//                     <label htmlFor="name">Name: </label>
//                     <input
//                         type="text"
//                         id="name"
//                         name="name"
//                         value={candidateData.candidateName}
//                         onChange={handleInputChange}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="position">Position: </label>
//                     <input
//                         type="text"
//                         id="position"
//                         name="position"
//                         value={candidateData.position}
//                         onChange={handleInputChange}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="skills">Skills: </label>
//                     <input
//                         type="text"
//                         id="skills"
//                         name="skills"
//                         value={candidateData.skills}
//                         onChange={handleInputChange}
//                         required
//                     />
//                 </div>
//                 {/* <button type="submit">Update Employee</button> */}
//             </form>
//             <Link href="/">Go back</Link>
//         </div>
//     );
// };

// export default ViewCandidate;


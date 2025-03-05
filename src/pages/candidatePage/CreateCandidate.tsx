import React, { useEffect, useState } from 'react';
import axios from 'axios';

// import { createCandidate, uploadFile, uploadImage } from '../services/api';
// import { Candidate } from '../types';
import { useNavigate } from 'react-router-dom';
import { CandidateType, createCandidate, uploadFile, uploadImage } from '../../API/candidatesApi';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createComment } from '../../API/commentsApi';

// interface Comment {
//     id: string;
//     author: string;
//     content: string;
//     replies?: Comment[];
// }

interface User {
    userId: string;
    username: string;
    email: string;
}

interface CreateCandidateProps {
    token: string;
}

// Utility function to map each username to a specific gradient style
const getGradientStyleByUsername = (username: string) => {
    // List of gradient styles to choose from, including new ones like "Blurred", "Non-regular Blending", "Tri-color", and "Multi-Color"
    const gradientStyles = [
        'linear-gradient(45deg, #f3ec78, #af4261)',  // Style 1
        'radial-gradient(circle, #ff9a9e 0%, #fad0c4 100%)',  // Style 2
        'conic-gradient(from 180deg at 50% 50%, #8ec5fc, #e0c3fc)',  // Style 3
        // 'repeating-linear-gradient(45deg, #0cd102 0%, #0dba04 10%, #0cd102 10%, #0cd102 20%)',  // Style 4
        "radial-gradient(circle at 50% 70%, #4B275B 5%, #ED8848 25%, #EDCA6C 50%, #8CAFC9 75%)",
        // 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',  // Style 5
        'radial-gradient(circle at top, #08fffb 20%, #c8e6c9 40%, #ffecb3 60%, #16ff05 90%)',  // Green-yellow gradient with white at the top
        'radial-gradient(circle, #89f7fe, #66a6ff)',  // Style 6
        'conic-gradient(from 0deg, #ff9966, #ff5e62)',  // Style 7
        'linear-gradient(180deg, #3a1c71, #d76d77, #ffaf7b)',  // Tri-color gradient
        'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)',  // Blurred gradient
        'repeating-linear-gradient(45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',  // Multi-Color gradient
        'linear-gradient(90deg, rgba(255,0,150,1) 0%, rgba(0,204,255,1) 100%)',  // Non-regular blending gradient
    ];

    // Generate an index based on the username's length and first character's char code
    const index = (username.length + username.charCodeAt(0)) % gradientStyles.length;

    console.log(`username: ${username}, index: ${index}`)

    // Return a unique gradient style for each username
    return gradientStyles[index];
};

const CreateCandidate: React.FC<CreateCandidateProps> = ({ token }) => {
    const [courtesyTitle, setCourtesyTitle] = useState('');
    const [candidateName, setcandidateName] = useState('');
    // const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [position, setPosition] = useState('');
    const [salary, setSalary] = useState('');
    const [employmentType, setEmploymentType] = useState('');
    const [industry, setIndustry] = useState('');
    const [educationLevels, setEducationLevels] = useState(['']);
    const [skills, setSkills] = useState(['']);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [contactTypes, setContactTypes] = useState([{ type: '', url: '' }]);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleAddEducationLevel = () => setEducationLevels([...educationLevels, '']);
    const handleCancelEducationLevel = (index: number) => {
        setEducationLevels(educationLevels.filter((_, i) => i !== index));
    };

    const handleAddSkill = () => setSkills([...skills, '']);
    const handleCancelSkills = (index: number) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    const handleAddContactType = () => setContactTypes([...contactTypes, { type: '', url: '' }]);
    const handleContactTypes = (index: number) => {
        setContactTypes(contactTypes.filter((_, i) => i !== index));
    };
    const handleAddAttachment = (file: File) => setAttachments([...attachments, file]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            console.log("Under const file = e.target.files[0];")
            console.log("file: ", file);
            setImageFile(file);
            setImageUrl(URL.createObjectURL(file));
        }
    };

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();

    //     const newCandidate: CandidateType = {
    //         id: '',
    //         courtesyTitle,
    //         candidateName,
    //         dateOfBirth,
    //         position,
    //         salary: parseFloat(salary), // Ensure salary is a number
    //         employmentType,
    //         industry,
    //         educationLevels,
    //         skills,
    //         phoneNumber,
    //         email,
    //         contactTypes,
    //         attachments: [] // Initialize attachments as an empty array
    //         ,

    //         images: [],
    //         // updatedAt: '',
    //         // lastEdited: ''
    //     };

    //     try {
    //         const response = await createCandidate(newCandidate);

    //         if (imageFile) {
    //             console.log("imageFile: ", imageFile);
    //             console.log("imageFile.name: ", imageFile.name);
    //             await uploadImage((response?.id || ""), imageFile);
    //             // await uploadImage(response.data.id, imageFile);
    //         }

    //         for (const attachment of attachments) {
    //             await uploadFile((response?.id || ""), attachment);
    //             // await uploadFile(response.data.id, attachment);
    //         }

    //         navigate("/");
    //         // console.log('Profile created successfully:', response.data);
    //         console.log('Profile created successfully:', response);
    //     } catch (error) {
    //         console.error('Error creating profile:', error);
    //     }
    // };
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            setUser({ userId: '', username: '', email: '' }); // Ensure user is never null
            // setUser({ userId: 0, username: '', email: '' }); // Ensure user is never null
        }
    }, []);
    const [newContent, setNewContent] = useState('');


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newCandidate: CandidateType = {
            id: '',
            courtesyTitle,
            candidateName,
            dateOfBirth,
            position,
            salary: parseFloat(salary), // Ensure salary is a number
            employmentType,
            industry,
            educationLevels,
            skills,
            phoneNumber,
            email,
            contactTypes,
            attachments: [], // Initialize attachments as an empty array
            images: [],
        };

        try {
            console.log("Above createCandidate")
            const response = await createCandidate(token, newCandidate);
            console.log("Above imageFile")
            if (imageFile) {
                await uploadImage(token, response?.id || "", imageFile); // Pass the token as the first argument
            }

            console.log("Above  for (const attachment of attachments) {");
            for (const attachment of attachments) {
                await uploadFile(token, response?.id || "", attachment); // Pass the token as the first argument
            }
            // if (imageFile) {
            //     await uploadImage((response?.id || ""), token, imageFile);
            // }
            // console.log("Above  for (const attachment of attachments) {")
            // for (const attachment of attachments) {
            //     await uploadFile((response?.id || ""), token, attachment);
            // }

            if (newContent) {
                // await createComment(response!.id, user!.userId, token || "", newContent);
                console.log("under if (newContent) { token = ", token);
                console.log("under if (newContent) { response?.id = ", response?.id);
                console.log("under if (newContent) { user?.userId = ", user?.userId);
                await createComment(token ?? "", response?.id ?? "", user?.userId ?? "", newContent);

            }

            console.log("Above toast.success(`Candidate")
            toast.success(`Candidate "${candidateName}" created successfully!`, {
                autoClose: 1000, // Display for 1 second
            });

            setTimeout(() => {
                navigate("/"); // Navigate back to home page
            }, 1500); // Wait for 1.5 seconds before redirecting
            console.log("Under navigate('/')");
        } catch (error) {
            // Type the error as AxiosError and check if it's an Axios error
            if (axios.isAxiosError(error)) {
                // Check if response exists and if there is a message in the data
                if (error.response?.data?.message) {
                    toast.error(`Error: ${error.response.data.message}`);
                } else {
                    toast.error('An error occurred but no message was provided.');
                }
            } else {
                toast.error('An unexpected error occurred.');
            }
            console.error('Error creating profile:', error);
        }
    };

    // Get the first letter of the username
    const firstTwoLetters = user?.username?.substring(0, 2);

    // Get the unique abstract gradient background based on the username
    const backgroundGradient = user ? getGradientStyleByUsername(user.username) : '#ccc'; // Fallback color if no user

    return (
        <>
            {/* <div className="container mx-auto p-4 flex justify-center gap-x-1 bg-slate-500"> */}
            <div className="w-full max-w-2xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4 container mx-auto p-4">
                {/* <div className="ml-10 w-full max-w-2xl bg-black shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4 container mx-auto p-4"> */}
                {/* <div className="container mx-auto p-4"> */}
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center mb-4 relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="w-36 h-36 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full cursor-pointer">
                            {imageUrl ? (
                                <img src={imageUrl} alt="Profile" className="w-full h-full object-cover rounded-full" onClick={() => window.open(imageUrl, '_blank')} />
                            ) : (
                                <span className="text-gray-500 text-2xl">
                                    <img className=' w-8 h-8' src="../src/assets/user.png" alt="picture.png" />
                                    {/* <img className=' w-8 h-8' src="../src/assets/picture.png" alt="picture.png" /> */}
                                </span>
                            )}
                        </label>
                        <label htmlFor="file-upload" className="absolute bottom-0 right-60 flex items-center justify-center text-white cursor-pointer">
                            <img className=' w-8 h-8' src="../src/assets/image-upload.png" alt="upload.png" />
                            {/* <img className=' w-8 h-8' src="../src/assets/upload.png" alt="upload.png" /> */}
                        </label>
                        {/* <label htmlFor="file-upload" className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M4 3a2 2 0 00-2 2v2a2 2 0 002 2h1.586l.707-.707A1 1 0 017 8V5a2 2 0 012-2h2a2 2 0 012 2v3a1 1 0 01-.293.707l-.707.707H12a2 2 0 00-2 2v3a1 1 0 01-.293.707l-.707.707H4a2 2 0 00-2-2V5a2 2 0 012-2h1.586l.707.707A1 1 0 017 5V3a2 2 0 00-2-2H4z" />
                                <path d="M12 3h2a2 2 0 012 2v2a2 2 0 01-2 2h-2V3zm-4 7v2a1 1 0 01-.293.707L7 13.414l.707.707a1 1 0 01.293.707v2h2v-2a1 1 0 01.293-.707l.707-.707a1 1 0 01.707-.293h2v-2H8z" />
                            </svg>
                        </label> */}
                    </div>
                    <h1 className=' text-base font-bold flex justify-center'>{courtesyTitle} {candidateName}</h1>
                    {/* <h1 className=' text-base font-bold flex justify-center'>{courtesyTitle} {name}</h1> */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* <div>
                            <label className="block text-gray-700">Courtesy title</label>
                            <input
                                type="text"
                                className="border p-2 w-full"
                                value={courtesyTitle}
                                onChange={(e) => setCourtesyTitle(e.target.value)}
                                required
                            />
                        </div> */}
                        <div>
                            <label className="block text-gray-700">Courtesy title</label>
                            <select
                                className="border p-2 w-full"
                                value={courtesyTitle}
                                onChange={(e) => setCourtesyTitle(e.target.value)}
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
                                value={candidateName}
                                // value={name}
                                onChange={(e) => setcandidateName(e.target.value)}
                                // onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Birth</label>
                            <input
                                type="date"
                                className="border p-2 w-full"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Position</label>
                            <input
                                type="text"
                                className="border p-2 w-full"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Salary</label>
                            <input
                                type="number"
                                className="border p-2 w-full"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Employment Type</label>
                            <input
                                type="text"
                                className="border p-2 w-full"
                                value={employmentType}
                                onChange={(e) => setEmploymentType(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Industry</label>
                            <input
                                type="text"
                                className="border p-2 w-full"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700">Education Levels</label>
                        {educationLevels.map((level, index) => (
                            <div key={index} className="flex mb-2">
                                <input
                                    type="text"
                                    className="border p-2 w-full"
                                    value={level}
                                    onChange={(e) =>
                                        setEducationLevels(educationLevels.map((lvl, i) => (i === index ? e.target.value : lvl)))
                                    }
                                    placeholder='Example: abc degree, abc degree, abc degree'
                                    required
                                />
                                {educationLevels.length > 1 && (
                                    <button
                                        type="button"
                                        className="ml-2 text-red-500"
                                        onClick={() => handleCancelEducationLevel(index)}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" className="text-blue-500" onClick={handleAddEducationLevel}>
                            + Add More Education Level
                        </button>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700">Skills</label>
                        {skills.map((skill, index) => (
                            <div key={index} className="flex mb-2">
                                <input
                                    type="text"
                                    className="border p-2 w-full"
                                    value={skill}
                                    onChange={(e) => setSkills(skills.map((sk, i) => (i === index ? e.target.value : sk)))}
                                    placeholder='Example: abc, abc, abc'
                                    required
                                />
                                {skills.length > 1 && (
                                    <button
                                        type="button"
                                        className="ml-2 text-red-500"
                                        onClick={() => handleCancelSkills(index)}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" className="text-blue-500" onClick={handleAddSkill}>
                            + Add More Skills
                        </button>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700">Phone Number</label>
                        <input
                            type="text"
                            className="border p-2 w-full"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            className="border p-2 w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700">Contact Types</label>
                        {contactTypes.map((contact, index) => (
                            <div key={index} className="flex mb-2">
                                <input
                                    type="text"
                                    className="border p-2 w-full"
                                    value={contact.type}
                                    onChange={(e) =>
                                        setContactTypes(
                                            contactTypes.map((ct, i) => (i === index ? { ...ct, type: e.target.value } : ct))
                                        )
                                    }
                                    placeholder='Example: abc'
                                    required
                                />
                                <input
                                    type="url"
                                    className="border p-2 w-full ml-2"
                                    value={contact.url}
                                    onChange={(e) =>
                                        setContactTypes(
                                            contactTypes.map((ct, i) => (i === index ? { ...ct, url: e.target.value } : ct))
                                        )
                                    }
                                    placeholder='Example: https://abc.com/abc'
                                    required
                                />
                                {contactTypes.length > 1 && (
                                    <button
                                        type="button"
                                        className="ml-2 text-red-500"
                                        onClick={() => handleContactTypes(index)}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" className="text-blue-500" onClick={handleAddContactType}>
                            + Add More Contact Type
                        </button>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700">Attachments</label>
                        <input
                            type="file"
                            multiple
                            className="border p-2 w-full"
                            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                            onChange={(e) => e.target.files && handleAddAttachment(e.target.files[0])}
                        />
                    </div>
                    {/* New Comment Form */}
                    {/* <div className="mb-4">
                        <textarea
                            className="border p-2 w-full"
                            placeholder="Write a new comment..."
                            value={newContent}
                            onChange={e => setNewContent(e.target.value)}
                        />
                    </div> */}
                    <div className="flex items-start">
                        {/* <div className="mt-[18px] h-10 w-10 rounded-full overflow-hidden mr-4"> */}
                        {/* <img src="user-profile-image.jpg" alt="User profile" className="h-full w-full object-cover" /> */}
                        <div
                            className="mt-[15px] mr-2 flex items-center justify-center w-11 h-11 rounded-full text-white font-bold"
                            style={{
                                // background: "radial-gradient(circle at 50% 70%, #4B275B 5%, #ED8848 25%, #EDCA6C 50%, #8CAFC9 75%)",
                                background: backgroundGradient,
                                color: '#fff', // White text for high contrast
                                textShadow: '2px 2px 6px rgba(0, 0, 0, 0.4)', // Deeper shadow for legibility
                                borderRadius: '50%', // Circle shape
                            }}
                        >
                            <div className='text-[19px] text-center'>
                                {(firstTwoLetters === null) ? ("?") : (firstTwoLetters)}
                            </div>
                        </div>
                        {/* </div> */}
                        <div className="flex-1 mt-4">
                            <textarea
                                placeholder="Add your comment..."
                                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none resize-none"
                                rows={1}
                                value={newContent}
                                onChange={e => setNewContent(e.target.value)}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = "auto"; // Reset height to auto to handle shrinking
                                    target.style.height = `${target.scrollHeight}px`; // Adjust height based on scrollHeight
                                }}
                            />
                        </div>
                    </div>

                    {/* <div className="mt-4">
                        <label className="block text-gray-700">Attachments</label>
                        <input
                            type="file"
                            multiple
                            className="border p-2 w-full"
                            onChange={(e) => e.target.files && handleAddAttachment(e.target.files[0])}
                        />
                    </div> */}
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white p-2 rounded"
                    >
                        Submit
                    </button>
                </form>
                {/* ToastContainer should be rendered at the root of your component */}
                <ToastContainer
                    theme="colored"
                />
            </div>

            {/* </div> */}
        </>
    );
};

export default CreateCandidate;

{/* Comment Section */ }
{/* <div className="w-80 bg-white shadow-md rounded px-6 pt-6 pb-8 ml-4"> */ }
// <div className="h-[750px] w-[500px] bg-white shadow-md rounded mt-4 px-6 pt-6 pb-8">
//     <h2 className="text-lg font-bold mb-4">Comments</h2>
//     <div className="flex flex-col">
//         {/* {comments.map((comment, index) => ( */}
//             {/* <div key={index} className="mb-4"> */}
//             <div  className="mb-4">
//                 <p className="font-semibold">comment.username</p>
//                 <p>comment.text</p>
//                 <button
//                     // onClick={() => handleReply(index)}
//                     className="text-blue-500 text-sm"
//                 >
//                     Reply
//                 </button>
//                 {/* Render Replies */}
//                 <div className="ml-4 mt-2">
//                     {/* {comment.replies.map((reply, idx) => ( */}
//                         <div className="border-l pl-4 ml-2 mt-2">
//                             <p className="font-semibold">reply.username</p>
//                             <p>reply.text</p>
//                         </div>
//                     {/* ))} */}
//                     {/* {comment.replies.map((reply, idx) => (
//                         <div key={idx} className="border-l pl-4 ml-2 mt-2">
//                             <p className="font-semibold">{reply.username}</p>
//                             <p>{reply.text}</p>
//                         </div>
//                     ))} */}
//                 </div>
//             </div>
//         {/* ))} */}
//         {/* Comment Input */}
//         <textarea
//             placeholder="Write a comment..."
//             className="border p-2 rounded w-full mt-4"
//             // value={newComment}
//             // onChange={(e) => setNewComment(e.target.value)}
//         />
//         <button
//             // onClick={handleAddComment}
//             className="mt-2 bg-blue-500 text-white p-2 rounded"
//         >
//             Add Comment
//         </button>
//     </div>
// </div>

//! Below code is good but it doesn't include every data that come form backend
// // import axios from "axios";
// import React, { useState, ChangeEvent } from "react";
// // import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { navigate } from "wouter/use-browser-location";
// import { addCandidate } from "../../API/candidatesApi";
// // import { addEmployee } from "../../API/candidatesApi";
// // import axios from 'axios';


// // interface Candidate {
// //   courtesy: string;
// //   firstName: string;
// //   birthDate: string; // Assuming birthDate is a string from the form
// //   position: string;
// //   salary: number;
// //   employmentType: string;
// //   industry: string;
// //   eduLevel: string;
// //   skill: string;
// //   phoneNumber: string;
// //   email: string;
// //   comment: string;
// // }

// interface User {
//   name: string;
//   email: string;
//   year: number;
// }

// export function AddCandidate() {
//   const [imageUrl, setImageUrl] = useState<string>('');
//   // const [birthDate, setBirthDate] = useState<Date | null>(null);
//   const [formData, setFormData] = useState<User>({
//     name: '',
//     email: '',
//     year: 0,
//   });

//   //TODO Test
//   const [employeeData, setEmployeeData] = useState({
//     id: 0,
//     candidateName: '',
//     position: '',
//     skills: ''
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setEmployeeData({
//       ...employeeData,
//       [name]: value
//     });
//   };

//   const handleAddEmployee = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       console.log("handleAddEmployee in AddEmployee.tsx");
//       await addCandidate(employeeData);
//       navigate('/');
//     } catch (error) {
//       console.error('Error adding employee:', error);
//     }
//   };
//   //TODO Test

//   const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         const imageUrl = reader.result as string;
//         setImageUrl(imageUrl);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   try {
//   //     await axios.post('http://localhost:8080/users', formData);
//   //     alert('User created successfully');
//   //     // Optionally, you can clear the form after submission
//   //     setFormData({
//   //       name: '',
//   //       email: '',
//   //       year: 0,
//   //     });
//   //     navigate("/");
//   //   } catch (error) {
//   //     console.error('Error creating user:', error);
//   //     alert('Failed to create user');
//   //   }
//   // };

//   // Function to handle form submission using Axios
//   // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//   //   event.preventDefault();

//   //   const formData = new FormData(event.currentTarget); // Create FormData object

//   //   // Extract form data (type assertions for clarity)
//   //   const courtesy = formData.get('grid-courtesy') as string;
//   //   const firstName = formData.get('grid-first-name') as string;
//   //   const birthDate = formData.get('grid-birthday') as string; // Assuming birthDate is a string representation
//   //   const position = formData.get('grid-position') as string;
//   //   const salary = Number(formData.get('grid-salary')); // Convert to number
//   //   const employmentType = formData.get('grid-employmentType') as string;
//   //   const industry = formData.get('grid-industry') as string;
//   //   const eduLevel = formData.get('grid-eduLevel') as string;
//   //   const skill = formData.get('grid-skill') as string;
//   //   const phoneNumber = formData.get('grid-phNumber') as string;
//   //   const email = formData.get('grid-email') as string;
//   //   const comment = formData.get('comment') as string;

//   //   const candidateData: Candidate = {
//   //     courtesy,
//   //     firstName,
//   //     birthDate,
//   //     position,
//   //     salary,
//   //     employmentType,
//   //     industry,
//   //     eduLevel,
//   //     skill,
//   //     phoneNumber,
//   //     email,
//   //     comment,
//   //   };

//   //   try {
//   //     // Mocked API endpoint using json-server
//   //     const response = await axios.post<Candidate>('http://localhost:4000/candidate', candidateData);

//   //     // Handle the response from the API (e.g., display success message)
//   //     if (response.status === 201) {
//   //       console.log('Candidate added successfully!', response.data);
//   //       // Clear form or redirect to a confirmation page
//   //     } else {
//   //       console.error('Error adding candidate:', response.data);
//   //       // Handle errors appropriately (e.g., display error message)
//   //     }
//   //   } catch (error) {
//   //     console.error('Error adding candidate:', error);
//   //     // Handle errors appropriately (e.g., display error message)
//   //   }
//   // };


//   return (

//     <div>
//       <header>
//         <div className="flex justify-between items-center">
//           <div className="flex items-center">
//             <img
//               src="../src/assets/ATALogo.png"
//               alt="ATALogo"
//               className="h-20 " style={{ marginLeft: 20 }}
//             />
//             <h1 className="text-lg ml-2">Talent Pool Database</h1>
//           </div>
//           <div className="flex items-center space-x-2 px-2">
//             <button className="bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black">
//               Candidate
//             </button>
//             <button className="hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black">
//               Vacancies
//             </button>
//             <a
//               href="/login"
//               className="cursor-pointer hover:bg-gray-600 rounded p-1"
//             >
//               <i className="fas fa-bars text-gray-800 text-2xl"></i>
//             </a>
//           </div>
//         </div>
//       </header>

//       <div className="mx-xl w-1000 px-4 py-24 sm:px-7 sm:py-25 lg:px-8">
//         <div className="flex flex-col items-center">
//           {/* Add margin top to create space */}
//           <div className="relative w-56 h-56 border border-dashed border-gray-400 rounded-full flex justify-center items-center cursor-pointer overflow-hidden mt-4">

//             {imageUrl ? (
//               <img src={imageUrl} alt="Uploaded" className="w-full h-full object-cover rounded-full" />
//             ) : (
//               <span className="text-gray-500">Click to Insert Image</span>
//             )}
//             <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" id="image-input" onChange={handleImageChange} />
//           </div>
//           <form className=" w-full max-w-200 mt-8 py-10 ">
//             <div className="flex justify-between w-4/5 mx-auto">


//               <div className="w-full md:w-1/3 px-3 mb-3 md:mb-0 ">

//                 <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
//                   Courtesy
//                 </label>
//                 <div className="relative">
//                   <select className="block appearance-none text-center w-full bg-white-200 border border-black-200 text-black-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-black-500" id="grid-courtesy">
//                     <option>Mr</option>
//                     <option>Mrs</option>
//                     <option>Ms</option>
//                   </select>
//                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                     <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
//                   </div>
//                 </div>
//               </div>
//               <div className="w-full md:w-1/2 px-1 mb-6 md:mb-0">
//                 <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
//                   First Name
//                 </label>
//                 {/* <input value={formData.name} onChange={handleChange} className="appearance-none block w-full bg-white-200 text-black-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />  */}
//                 <input
//                   placeholder="Susan"
//                   type="text"
//                   id="name"
//                   name="name"
//                   // value={formData.name}
//                   // onChange={handleChange}
//                   value={employeeData.candidateName}
//                   onChange={handleInputChange}
//                   // className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
//                   className="appearance-none block w-full bg-white-200 text-black-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
//                   required
//                 />
//               </div>
//               <div className="w-xl md:w-1/1 px-3">
//                 <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-birthday">
//                   Birth Date
//                 </label>
//                 {/* <input value={formData.year} onChange={handleChange} className="appearance-none block w-full bg-white-200 text-black-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="10-11-2022" /> */}
//                 <input
//                   placeholder="YYYY-MM-DD"
//                   type="number"
//                   id="year"
//                   name="year"
//                   value={formData.year}
//                   onChange={handleChange}
//                   className="appearance-none block w-full bg-white-200 text-black-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
//                   required
//                 />
//                 {/* <DatePicker
//                   selected={birthDate}
//                   onChange={(date: Date | null) => setBirthDate(date)}
//                   className="appearance-none block w-full bg-white-200 text-black-700 border border-black-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-black-500"
//                   id="grid-birthday"
//                   placeholderText="Select Birth Date"
//                 /> */}
//               </div>
//             </div>
//             <div className="flex justify-between w-4/5 mx-auto">

//               <div className="w-full md:w-1/2 px-3 py-3 mb-6 md:mb-0">
//                 <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-position">
//                   Position
//                 </label>
//                 <input type="text"
//                   id="position"
//                   name="position"
//                   value={employeeData.position}
//                   onChange={handleInputChange}
//                   required
//                   className="appearance-none block w-full text-center bg-white-200 text-black-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" placeholder="Postion" />
//               </div>
//               <div className="w-full md:w-1/2 px-3 py-3 mb-6 md:mb-0">
//                 <label className="block  tracking-wide  text-gray-700 text-xs font-bold mb-2" htmlFor="grid-salary">
//                   Salary
//                 </label>
//                 <input className="appearance-none block w-full text-center bg-white-200 text-black-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-salary" type="number" placeholder="Salary" />
//               </div>
//             </div>
//             <div className="flex justify-between w-4/5 mx-auto">
//               <div className="w-full md:w-1/2 px-3 py-3 mb-6 md:mb-0">
//                 <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-employmentType">
//                   Employment Type
//                 </label>
//                 <div className="relative">
//                   <select className="block appearance-none text-center w-full bg-white-200 border border-black-200 text-black-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-black-500" id="grid-employmentType">
//                     <option>Part Time</option>
//                     <option>Full Time</option>

//                   </select>
//                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                     <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
//                   </div>
//                 </div>
//               </div>
//               <div className="w-full md:w-1/1 px-3 py-3 mb-6 md:mb-0">
//                 <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-industry">
//                   Industry
//                 </label>
//                 <div className="relative">
//                   <select className="block appearance-none w-full bg-white-200 border border-black-200 text-black-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-black-500" id="grid-industry">
//                     <option>Information Technology</option>
//                     <option>Financial Services Industry</option>
//                     <option>Automotive Industry</option>
//                     <option>Human Resources Management</option>

//                   </select>
//                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                     <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
//                   </div>
//                 </div>
//               </div>

//             </div>


//             <div className="flex justify-between w-4/5 mx-auto">
//               <div className="w-full md:w-1/2 px-3 py-6 mb-6 md:mb-0">
//                 <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-eduLevel">
//                   Education Level
//                 </label>
//                 <input className="appearance-none block w-full bg-white-200 text-black-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-eduLevel" type="text" placeholder="Education Level" />
//               </div>
//               <div className="w-full md:w-1/2 px-3 py-6  mb-6 md:mb-0">
//                 <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-skill">
//                   Skill
//                 </label>
//                 <input
//                   type="text"
//                   id="skills"
//                   name="skills"
//                   value={employeeData.skills}
//                   onChange={handleInputChange}
//                   className="appearance-none block w-full bg-white-200 text-black-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" placeholder="Skill" />
//               </div>

//             </div>
//             <div className="flex justify-between w-4/5 mx-auto">
//               <div className="w-full md:w-1/2 px-3 py-1 mb-6 md:mb-0">
//                 <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-phNumber" >
//                   Phone Number
//                 </label>
//                 <input id="phone" name="phone" type="tel" required pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder='Phone Number'></input>
//               </div>
//               <div className="w-full md:w-1/2 px-3 py-1  mb-6 md:mb-0">
//                 <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-email">
//                   Email
//                 </label>
//                 {/* <input id="email" name="email" type="email" required className="appearance-none block w-full bg-white-200 text-black-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" placeholder='Email'></input> */}
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
//                   required
//                 />
//               </div>

//             </div>
//             <div className="flex justify-between w-4/5 mx-auto">

//               <div className='w-full md:w-1/1 px-3 py-1 mb-6 md:mb-0'>
//                 <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white " htmlFor="Uploadfiles" >Uploadfiles</label>
//                 <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="multiple_files" type="file" multiple />
//               </div>

//               <div className='w-full md:w-1/2 px-3 py-1 mb-6 md:mb-0'>
//                 <div className=" border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
//                   <label htmlFor="comment" className="sr-only">Your comment</label>
//                   <textarea
//                     id="comment"
//                     className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
//                     placeholder="  Write a comment..."
//                     required
//                   ></textarea>
//                 </div>
//               </div>
//             </div>


//           </form>
//           <form>
//             {/* ... form fields and structure ... */}
//             {/* ... form fields and structure ... */}
//             {/* ... form fields and structure ... */}
//             <button onClick={handleAddEmployee} type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-white-700 rounded mt-8">
//               {/* <button onClick={handleSubmit} type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-white-700 rounded mt-8"> */}
//               Add Candidate
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddCandidate;
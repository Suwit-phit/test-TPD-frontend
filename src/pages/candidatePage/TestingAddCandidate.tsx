// src/MyComponent.tsx
// src/components/UserProfile.tsx
import React, { useRef, useState } from 'react';
import atalogo from "../../assets/ATALogo.png"

const UserProfile: React.FC = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleIconClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && event.target.result) {
                    const dataUrl = event.target.result as string;
                    setImageUrl(dataUrl); // Update the image URL
                }
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <>
            <header>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center'>
                        <img src="../src/assets/ATALogo.png" alt="ATALogo" className='h-20' />
                        <h1 className='text-lg ml-2'>Talent Pool Database</h1>
                    </div>
                    <div className='flex items-center space-x-2 px-2'>
                        <button className='bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'>Candidate</button>
                        <button className='hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'>Vacancies</button>
                        <a href='/login' className="cursor-pointer hover:bg-gray-600 rounded p-1">
                            <i className="fas fa-bars text-gray-800 text-2xl"></i>
                        </a>
                    </div>
                </div>
            </header>
            <main className='p-4'>
                {/* <div className=" bg-slate-950 container mx-auto mt-4"> */}
                <div className="flex justify-center w-full">
                    <div className="flex flex-col items-center relative">
                        <div className="w-80 h-80 bg-blue-500 rounded-full mb-4 relative">
                            {/* Image inside the circle */}
                            <img src={imageUrl || atalogo} alt="ATALogo" className="w-full h-full object-cover rounded-full" />
                            {/* Font Awesome icon at the bottom right */}
                            <i className="fas fa-file-upload absolute bottom-9 right-9 text-3xl cursor-pointer text-gray-600 hover:text-sky-100" onClick={handleIconClick}></i>
                            {/* Hidden file input for uploading image */}
                            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                        </div>
                        {/* <div className="w-12 h-12 bg-green-500 rounded-full"> */}
                        {/* Circle 2 */}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex justify-between mx-52">
                    {/* <div className="w-1/3 bg-slate-100"> */}
                    <div className="w-28">
                    {/* <div className="w-28 bg-slate-100"> */}
                        {/* Content of the first column */}
                        Courtesy title
                        <select
                            id="courtesyTitle"
                            name="courtesyTitle"
                            className="mt-1 p-2 border rounded w-full"
                        >
                            <option value="Mr.">Mr.</option>
                            <option value="Mrs.">Mrs.</option>
                            <option value="Miss">Miss</option>
                            {/* Add more options as needed */}
                        </select>
                    </div>
                    <div className="flex-grow mx-2">
                    {/* <div className="flex-grow bg-slate-200"> */}
                        {/* Content of the second column */}
                        Name
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="mt-1 p-2 border rounded w-full"
                            placeholder="Kyaw Oo"
                        />
                    </div>
                    <div className="w-1/3 ml-10">
                    {/* <div className="w-1/3 bg-slate-300 ml-10"> */}
                        {/* Content of the third column */}
                        Birth Date
                        <input
                            type="text"
                            id="birthDate"
                            name="birthDate"
                            className="mt-1 p-2 border rounded w-full"
                            placeholder="12/2/1989"
                        />
                    </div>
                </div>
                <br />
                {/* </div> */}
                <div className="bg-white p-4 rounded-lg shadow-md flex justify-between">
                    {/* First and Second column (stick together) */}
                    <div className="flex">
                        {/* Content for the first column */}
                        {/* Add your content here */}
                        {/* First Column */}
                        <div className="p-1 w-28">
                            {/* <div className="bg-gray-200 p-1 w-28"> */}
                            {/* Add your content here */}
                            Courtesy title
                            <select
                                id="courtesyTitle"
                                name="courtesyTitle"
                                className="mt-1 p-2 border rounded w-full"
                            >
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Miss">Miss</option>
                                {/* Add more options as needed */}
                            </select>
                        </div>
                        {/* Content for the second column */}
                        {/* Add your content here */}
                        {/* Second Column */}
                        <div className="p-1 ">
                            {/* <div className="bg-gray-300 p-1 "> */}
                            {/* Add your content here */}
                            Second Column
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="mt-1 p-2 border rounded w-full"
                                placeholder="Kyaw Oo"
                            />
                        </div>
                    </div>

                    {/* Third column */}
                    <div className="self-end bg-slate-100">
                        {/* Content for the third column */}
                        {/* Add your content here */}
                        {/* Third Column */}
                        <div className="">
                            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                                Birth Date
                            </label>
                            <input
                                type="text"
                                id="birthDate"
                                name="birthDate"
                                className="mt-1 p-2 border rounded w-full"
                                placeholder="12/2/1989"
                            />
                        </div>
                    </div>
                    {/* fourth column */}
                    <div className="self-end bg-red-600 ">
                        {/* Content for the third column */}
                        {/* Add your content here */}
                        {/* Third Column */}
                        <div className="">
                            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                                Birth Date
                            </label>
                            <input
                                type="text"
                                id="birthDate"
                                name="birthDate"
                                className="mt-1 p-2 border rounded w-full"
                                placeholder="12/2/1989"
                            />
                        </div>
                    </div>
                </div>
                {/* </div> */}

                <br />
                <div className="flex justify-between">
                    {/* First and Second column (stick together) */}
                    <div className="flex">
                        {/* Content for the first column */}
                        {/* Add your content here */}
                        First Column
                        {/* Content for the second column */}
                        {/* Add your content here */}
                        Second Column
                    </div>

                    {/* Third and Fourth column (aligned to the end) */}
                    <div className="flex">
                        {/* Content for the third column */}
                        {/* Add your content here */}
                        Third Column
                        {/* Content for the fourth column */}
                        {/* Add your content here */}
                        Fourth Column
                    </div>
                </div>
                <br />
                <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="courtesyTitle" className="block text-sm font-medium text-gray-700">
                                Courtesy Title
                            </label>
                            <select
                                id="courtesyTitle"
                                name="courtesyTitle"
                                className="mt-1 p-2 border rounded w-full"
                            >
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Miss">Miss</option>
                                {/* Add more options as needed */}
                            </select>
                        </div>
                        {/* <div className="mb-4">
              <label htmlFor="courtesyTitle" className="block text-sm font-medium text-gray-700">
                Courtesy Title
              </label>
              <input
                type="text"
                id="courtesyTitle"
                name="courtesyTitle"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Mr."
              />
            </div> */}
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="mt-1 p-2 border rounded w-full"
                                placeholder="Kyaw Oo"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                                Birth Date
                            </label>
                            <input
                                type="text"
                                id="birthDate"
                                name="birthDate"
                                className="mt-1 p-2 border rounded w-full"
                                placeholder="12/2/1989"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </form>
                </div>
                <br /><hr /><br />

                <br /><hr /><br />
                <div className="bg-white p-4 rounded-lg shadow-md flex justify-between">
                    {/* First column */}
                    <div className=' bg-orange-400'>
                        {/* Content for the first column */}
                        {/* Add your content here */}
                        First Column
                        <div className="bg-gray-200 p-1">
                            {/* Add your content here */}
                            Courtesy title
                            <select
                                id="courtesyTitle"
                                name="courtesyTitle"
                                className="mt-1 p-2 border rounded w-full"
                            >
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Miss">Miss</option>
                                {/* Add more options as needed */}
                            </select>
                        </div>
                        <div className="bg-gray-200 p-1">
                            {/* Add your content here */}
                            Courtesy title
                            <select
                                id="courtesyTitle"
                                name="courtesyTitle"
                                className="mt-1 p-2 border rounded w-full"
                            >
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Miss">Miss</option>
                                {/* Add more options as needed */}
                            </select>
                        </div>
                    </div>

                    {/* Second column */}
                    <div className=' bg-amber-200'>
                        {/* Content for the second column */}
                        {/* Add your content here */}
                        Second Column
                    </div>
                </div>
                <br />
                {/* </div> */}
                {/* second row */}
                <div className="bg-white p-4 rounded-lg shadow-md flex justify-center">
                    {/* First column */}
                    <div className=" bg-amber-600">
                        {/* <div className="w-1/2"> */}
                        {/* Content for first column */}
                        <div className="bg-gray-200 p-1">
                            {/* Add your content here */}
                            Courtesy title
                            <select
                                id="courtesyTitle"
                                name="courtesyTitle"
                                className="mt-1 p-2 border rounded w-full"
                            >
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Miss">Miss</option>
                                {/* Add more options as needed */}
                            </select>
                        </div>
                    </div>

                    {/* Second column */}
                    <div className="">
                        {/* <div className="w-1/2"> */}
                        {/* Content for second column */}
                        <div className="bg-gray-300 p-1 ">
                            {/* Add your content here */}
                            Second Column
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="mt-1 p-2 border rounded w-full"
                                placeholder="Kyaw Oo"
                            />
                        </div>
                    </div>

                    {/* Third column */}
                    <div className="ml-4">
                        {/* <div className="w-1/4 ml-4"> */}
                        {/* Content for third column */}
                        <div className="bg-slate-400 p-4">
                            {/* Add your content here */}
                            Three Column
                        </div>
                    </div>
                </div>

                <br /><hr />
                <div className="bg-white p-4 rounded-lg shadow-md flex justify-center">
                    {/* First column */}
                    <div className="w-1/2">
                        {/* Content for first column */}
                        {/* <div className="bg-gray-200 p-4"> */}
                        <div className="bg-gray-200">
                            {/* Add your content here */}
                            First Column
                            {/* <label htmlFor="courtesyTitle" className="block text-sm font-medium text-gray-700">
                Courtesy Title
              </label> */}
                            <select
                                id="courtesyTitle"
                                name="courtesyTitle"
                                className="mt-1 p-2 border rounded w-full"
                            >
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Miss">Miss</option>
                                {/* Add more options as needed */}
                            </select>
                            {/* <div className="mb-4">
                
              </div> */}
                        </div>
                    </div>
                    {/* Second column */}
                    <div className="w-1/2">
                        {/* Content for second column */}
                        <div className="bg-gray-300 p-4">
                            {/* Add your content here */}
                            Second Column
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="mt-1 p-2 border rounded w-full"
                                placeholder="Kyaw Oo"
                            />
                        </div>
                    </div>
                    <div className="w-1/2">
                        {/* Content for second column */}
                        <div className=" bg-slate-400 p-4">
                            {/* Add your content here */}
                            Three Column
                        </div>
                    </div>
                </div>
                <br />
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <img src="profile-image.jpg" alt="User Profile" className="w-16 h-16 rounded-full" />
                    <h2 className="text-xl font-semibold">John Doe</h2>
                    <p className="text-gray-600">Web Developer</p>
                    <p className="text-gray-500">Passionate about creating beautiful web experiences.</p>
                    {/* Other profile details */}
                </div>
            </main >



            <div className="container mx-auto mt-4">
                <div className="flex justify-center w-full">
                    <div className="flex flex-col items-center relative">
                        <div className="w-80 h-80 bg-blue-500 rounded-full mb-4 relative">
                            {/* Image inside the circle */}
                            {/* <img src="../src/assets/ATALogo.png" alt="ATALogo" className="w-full h-full object-cover rounded-full" /> */}
                            {/* Font Awesome icon at the bottom right */}
                            {/* <i className=" text-4xl fas fa-file-upload absolute bottom-9 right-9"></i> */}
                        </div>
                        <div className="w-12 h-12 bg-green-500 rounded-full">
                            {/* Circle 2 */}
                        </div>
                    </div>
                </div>
            </div>

            <br /><hr />
            <div className="container mx-auto mt-4">
                <div className="bg-red-400 flex justify-center w-full">
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            {/* Circle 1 */}
                            <div className="w-80 h-80 bg-blue-500 rounded-full mb-2 overflow-hidden relative">
                                <img
                                    className="w-full h-full object-cover"
                                    src="../src/assets/ATALogo.png"
                                    alt="First Row Image"
                                />
                                <i className="fas fa-file-upload absolute bottom-0 right-0"></i>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-green-500">
                            {/* Circle 2 */}
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className=" bg-slate-500 container mx-auto mt-4"> */}
            <div className=" bg-red-400 flex justify-center w-full">
                <div className="flex flex-col items-center">
                    <div className="w-80 h-80 bg-blue-500 rounded-full mb-2 overflow-hidden">
                        {/* Circle 1 */}
                        <img
                            className="w-full h-full object-cover"
                            src="../src/assets/ATALogo.png"
                            alt="First Row Image"
                        />
                        <i className="fas fa-file-upload"></i>
                    </div>
                    <div className="w-12 h-12 bg-green-500">
                        {/* Circle 2 */}
                    </div>
                </div>
            </div>
            {/* </div> */}
            <div className=" bg-red-600 flex justify-between w-full">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full">
                    {/* Circle 1 */}
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full">
                    {/* Circle 2 */}
                </div>
            </div>
            {/* <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-500">
        <img
          className="w-full h-full object-cover rounded-full"
          src="../src/assets/ATALogo.png"
          alt="First Row Image"
        />
      </div> */}
            <div className="w-16 h-16 rounded-full bg-blue-500"></div>
            <div className="flex flex-col h-screen">
                <div className="bg-gray-200 flex-grow">

                    {/* First row */}
                    <div className="h-1/2 flex flex-col items-center justify-center">
                        <h1 className="text-4xl mb-4">First Row Content</h1>

                        <div className="w-80 h-80 flex items-center justify-center rounded-full overflow-hidden">
                            <img
                                className="w-full h-full object-cover rounded-full"
                                // src={ATALogo}
                                // alt="ATALogo"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        {/* <div className="w-80 h-80 flex items-center justify-center rounded-full overflow-hidden">
              <img
                className="w-full h-full object-cover rounded-full"
                src="../src/assets/ATALogo.png"
                alt="First Row Image"
              />
            </div> */}
                        {/* <div className="w-80 h-80 rounded-full overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src="../src/assets/ATALogo.png"
                alt="First Row Image"
              />
            </div> */}
                    </div>
                </div>
                <div className="bg-gray-400 flex-grow">
                    {/* Second row */}
                    <div className="h-1/2 flex items-center justify-center">
                        <h1 className="text-4xl">Second Row Content</h1>
                    </div>
                </div>
            </div>
            <br />

            <div className="flex flex-col h-screen">
                <div className="bg-gray-200 flex-grow">
                    {/* First row */}
                    <div className="h-1/2 flex items-center justify-center">
                        <h1 className="text-4xl">First Row Content</h1>
                    </div>
                    {/* <div className=" bg-red-500 relative w-64 h-64 rounded-full overflow-hidden"> */}
                    {/* <div className=" w-80 h-80 mt-20 bg-red-500">
            <img
              src="../src/assets/ATALogo.png"
              alt="Cosmic Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div> */}
                </div>
                <div className="bg-gray-400 flex-grow">
                    {/* Second row */}
                    <div className="h-1/2 flex items-center justify-center">
                        <h1 className="text-4xl">Second Row Content</h1>
                    </div>
                </div>
            </div>
            <div className=" bg-red-500 relative w-24 h-24 rounded-full overflow-hidden">
                {/* Cosmic background */}
                <img
                    src="../src/assets/ATALogo.png"
                    alt="Cosmic Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Person's side profile */}
                <img
                    src="path/to/profile-image.jpg"
                    alt="Mr. Kyaw Oo"
                    className="w-full h-full object-cover"
                />

                {/* Name */}
                <p className="absolute bottom-0 left-0 right-0 text-center text-white font-semibold bg-black bg-opacity-50">
                    Mr. Kyaw Oo
                </p>

                {/* Icon */}
                <div className="absolute bottom-2 right-2">
                    <img
                        src="path/to/edit-icon.svg"
                        alt="Edit Icon"
                        className="w-6 h-6"
                    />
                </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <img src="profile-image.jpg" alt="User Profile" className="w-16 h-16 rounded-full" />
                <h2 className="text-xl font-semibold">John Doe</h2>
                <p className="text-gray-600">Web Developer</p>
                <p className="text-gray-500">Passionate about creating beautiful web experiences.</p>
                {/* Other profile details */}
            </div>
        </>
    );
};

export default UserProfile;



// import React from "react";

// const AddCandidate: React.FC = () => {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
//       <p>Already have an account? <a href="/login" className="text-blue-500">Login</a></p>
//     </div>
//   );
// };

// export default AddCandidate;

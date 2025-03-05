import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import ForgotPassword from "./pages/ForgotPassword";
import CreateCandidate from "./pages/candidatePage/CreateCandidate";
import TestingAddCandidate from "./pages/candidatePage/TestingAddCandidate";
import VacancyPage from "./pages/vacancy/VacancyPage";
import AddVacancies from "./pages/vacancy/AddVacancies";
// import RecommendedCandidates from "./pages/vacancy/MatchingCandidates";
import ViewCandidate from "./pages/candidatePage/ViewCandidate";
import UpdateCandidate from "./pages/candidatePage/UpdateCandidate";
import AttachmentOutsideList from "./pages/AttachmentOutsideList";
import VacancySearchPage from "./pages/vacancy/VacancySearchPage";
import ViewVacancy from "./pages/vacancy/ViewVacancy";
import MatchingCandidates from "./pages/vacancy/MatchingCandidates";
import CreateVacancy from "./pages/vacancy/CreateVacancy";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const App: React.FC = () => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    // const [user, setUser] = useState<{ username: string; email: string } | null>(null);

    // useEffect(() => {
    //     const userData = localStorage.getItem('user');
    //     if (userData) {
    //         setUser(JSON.parse(userData));
    //         console.log(user);
    //     }
    // }, []);

    // useEffect(() => {
    //     const userData = localStorage.getItem('user');
    //     if (userData) {
    //         console.log('User data found:', JSON.parse(userData));
    //     }
    // }, []);

    return (
        // <Router>
        <Routes>
            {/* Auth */}
            <Route
                path="/"
                element={token ? <HomePage token={token} setToken={setToken} /> : <Login setToken={setToken} />}
            />
            <Route path="/signUp" element={<SignUp />} />

            {token ? (
                <>
                    {/* <Route path="/edit/:userId" element={<EditPage token={token} />} /> */}
                    <Route path='/view-Candidate/:id' element={<ViewCandidate token={token}/>} />
                    <Route path="/create-Candidate" element={<CreateCandidate token={token}/>} />
                    <Route path="/create-vacancy" element={<CreateVacancy token={token} setToken={setToken}/>} />
                    <Route path="/vacancy-page" element={<VacancyPage token={token} setToken={setToken}/>} />
                    <Route path="/AddVacancies" element={<AddVacancies token={token} setToken={setToken}/>} />
                    <Route path="/vacancy-page/vacancy-search" element={<VacancySearchPage token={token} setToken={setToken}/>} />
                    <Route path="/vacancy-page/matching-candidates" element={<MatchingCandidates token={token} setToken={setToken}/>} />
                    {/* <Route path="/matching-candidates" element={<RecommendedCandidates token={token} setToken={setToken}/>} /> */}
                    <Route path="/view-vacancy/:id" element={<ViewVacancy token={token} setToken={setToken} />} />
                    {/* <Route path="/profile" element={<ProfilePage token={token} />} /> */}
                </>
            ) : (
                <Route path="*" element={<Navigate to="/" />} />  // Redirect to login if no valid token
            )}

            {/* Inside Data */}
            {/* <Route path="/matching-candidates" element={<RecommendedCandidates />} /> */}
            <Route path="/requestForgotPassword" element={<ForgotPassword />} />
            {/* <Route path="/homepage" element={<HomePage />} /> */}
            <Route path="/testingAddCandidate" element={<TestingAddCandidate />} />
            {/* <Route path="/create-Candidate" element={<CreateCandidate />} /> */}
            <Route path='/update-Candidate/:id' element={<UpdateCandidate />} />
            {/* <Route path='/view-Candidate/:id' element={<ViewCandidate />} /> */}
            <Route path="/attachment-list" element={<AttachmentOutsideList />} />

            {/* Vacancy Routes */}
            {/* <Route path="/vacancy-page" element={<VacancyPage />} /> */}
            {/* <Route path="/vacancy-page/vacancy-search" element={<VacancySearchPage />} /> */}
            {/* <Route path="/view-vacancy/:id" element={<ViewVacancy />} /> */}
            {/* <Route path="/create-vacancy" element={<CreateVacancy />} /> */}
            {/* <Route path="/AddVacancies" element={<AddVacancies />} /> */}

            {/* mataching */}
            {/* <Route path="/vacancy-page/matching-candidates" element={<MatchingCandidates />} /> */}
        </Routes>
        // </Router>
    );
};

export default App;


//! Below code is like upper code but without mode edit or view
// // src/App.tsx
// import React, { useEffect, useState } from "react";
// // import { Route, Routes } from "react-router-dom";
// // import Login from "./pages/Login";
// import ForgotPassword from "./pages/ForgotPassword";
// // import ValidateToken from "./pages/ValidateToken";
// // import ResetPassword from "./pages/ResetPassword";
// // import { BrowserRouter as Router, Route } from "react-router-dom";
// // import Login from "./pages/Login";
// // import SignUp from "./pages/SignUp";
// // import ForgotPassword from "./pages/ForgotPassword";
// import HomePage from "./pages/HomePage";
// import CreateCandidate from "./pages/candidatePage/CreateCandidate";
// // import { Route, Router, Switch } from "wouter";
// import TestingAddCandidate from "./pages/candidatePage/TestingAddCandidate";
// import VacancyPage from "./pages/vacancy/VacancyPage";
// import AddVacancies from "./pages/vacancy/AddVacancies";
// import RecommendedCandidates from "./pages/vacancy/RecommendedCandidates";
// // import UpdateCandidate from "./pages/candidatePage/updateCandidate";
// import ViewCandidate from "./pages/candidatePage/ViewCandidate";
// import UpdateCandidate from "./pages/candidatePage/UpdateCandidate";

// // import { ToastContainer } from 'react-toastify';
// // import 'react-toastify/dist/ReactToastify.css';
// // import { Router, Routes } from "react-router-dom";
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import AttachmentOutsideList from "./pages/AttachmentOutsideList";
// import VacancySearchPage from "./pages/vacancy/VacancySearchPage";
// import ViewVacancy from "./pages/vacancy/ViewVacancy";

// const App: React.FC = () => {
//     // const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
//     const [user, setUser] = useState<{ username: string; email: string } | null>(null);

//     const [editMode, setEditMode] = useState(false);  // Manage editMode in parent

//     useEffect(() => {
//         const userData = localStorage.getItem('user');
//         if (userData) {
//             setUser(JSON.parse(userData));
//             console.log(user);
//             // console.log(token);
//         }
//     }, []);

//     return (
//         <Router>
//             <Routes>
//                 <Route path="/" element={<HomePage />} />
//                 <Route path="/matching-candidates" element={<RecommendedCandidates />} />
//                 {/* <Route path="/login" component={Login} />
//                 <Route path="/signup" component={SignUp} /> */}
//                 <Route path="/requestForgotPassword" element={<ForgotPassword />} />
//                 <Route path="/homepage" element={<HomePage />} />
//                 {/* <div className="min-h-screen bg-gray-100 flex items-center justify-center"> */}
//                 <Route path="/testingAddCandidate" element={<TestingAddCandidate />} />
//                 <Route path="/create-Candidate" element={<CreateCandidate />} />
//                 <Route path='/update-Candidate/:id' element={<UpdateCandidate />} />
//                 {/* <Route path='/view-Candidate/:id' component={ViewCandidate} /> */}
//                 <Route path='/view-Candidate/:id' element={<ViewCandidate />} />

//                 {/* </div> */}
//                 <Route path="/attachment-list" element={<AttachmentOutsideList />} />

//                 {/* Vacancy Route */}
//                 {/* <Route path="/vacancy-page" element={<VacancyPage />} /> */}
//                 <Route path="/vacancy-page" element={<VacancyPage setEditMode={setEditMode} />} />
//                 <Route path="/vacancy-page/vacancy-search" element={<VacancySearchPage />} />
//                 {/* <Route path="/view-vacancy/:id" element={<ViewVacancy />} /> */}
//                 <Route path="/view-vacancy/:id" element={<ViewVacancy editMode={editMode} />} />
//                 <Route path="/AddVacancies" element={<AddVacancies />} />

//                 {/* <Route path="/matching-candidates" component={RecommendedCandidates} /> */}
//                 {/* ToastContainer should be included once in your app */}
//             </Routes>
//             {/* <ToastContainer
//                 position="top-right"
//                 autoClose={5000}
//                 hideProgressBar={false}
//                 newestOnTop={false}
//                 closeOnClick
//                 rtl={false}
//                 pauseOnFocusLoss
//                 draggable
//                 pauseOnHover
//                 theme="colored"
//             /> */}
//         </Router>
//     );
// };

// export default App;

//! Below code is just like upper code but the id is not pass
// // src/App.tsx
// import React, { useEffect, useState } from "react";
// // import { Route, Routes } from "react-router-dom";
// // import Login from "./pages/Login";
// import ForgotPassword from "./pages/ForgotPassword";
// // import ValidateToken from "./pages/ValidateToken";
// // import ResetPassword from "./pages/ResetPassword";
// // import { BrowserRouter as Router, Route } from "react-router-dom";
// // import Login from "./pages/Login";
// // import SignUp from "./pages/SignUp";
// // import ForgotPassword from "./pages/ForgotPassword";
// import HomePage from "./pages/HomePage";
// import AddCandidate from "./pages/candidatePage/AddCandidate";
// import { Route, Router, Switch } from "wouter";
// import TestingAddCandidate from "./pages/candidatePage/TestingAddCandidate";
// import VacancyPage from "./pages/vacancy/VacancyPage";
// import AddVacancies from "./pages/vacancy/AddVacancies";
// import RecommendedCandidates from "./pages/vacancy/RecommendedCandidates";
// // import UpdateCandidate from "./pages/candidatePage/updateCandidate";
// import ViewCandidate from "./pages/candidatePage/ViewCandidate";
// import UpdateCandidate from "./pages/candidatePage/UpdateCandidate";

// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const App: React.FC = () => {
//     // const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
//     const [user, setUser] = useState<{ username: string; email: string } | null>(null);

//     useEffect(() => {
//         const userData = localStorage.getItem('user');
//         if (userData) {
//             setUser(JSON.parse(userData));
//             console.log(user);
//             // console.log(token);
//         }
//     }, []);

//     return (
//         // <Routes>
//         //     <Route
//         //         path="/"
//         //         element={<Login setToken={setToken} setUser={setUser} />}
//         //     // element={<Login setToken={setToken} setUser={setUser} />}
//         //     />
//         //     {/* <Route path="/requestForgotPassword" component={ForgotPassword} /> */}
//         //     <Route path="/signUp" element={<SignUp />} />
//         //     <Route path="/requestForgotPassword" element={<ForgotPassword />} />
//         //     <Route path="/validate" element={<ValidateToken />} />
//         //     <Route path="/reset" element={<ResetPassword />} />

//         //     <Route path="/home" element={<HomePage />} />
//         // </Routes>
//         <Router>
//             <Switch>
//                 <Route path="/" component={HomePage} />
//                 <Route path="/matching-candidates" component={RecommendedCandidates} />
//                 {/* <Route path="/login" component={Login} />
//                 <Route path="/signup" component={SignUp} /> */}
//                 <Route path="/requestForgotPassword" component={ForgotPassword} />
//                 <Route path="/homepage" component={HomePage} />
//                 {/* <div className="min-h-screen bg-gray-100 flex items-center justify-center"> */}
//                 <Route path="/testingAddCandidate" component={TestingAddCandidate} />
//                 <Route path="/addCandidate" component={AddCandidate} />
//                 <Route path='/update-Candidate/:id' component={UpdateCandidate} />
//                 <Route path='/view-Candidate/:id' component={ViewCandidate} />
//                 {/* </div> */}
//                 <Route path="/VacancyPage" component={VacancyPage} />
//                 <Route path="/AddVacancies" component={AddVacancies} />
//                 {/* <Route path="/matching-candidates" component={RecommendedCandidates} /> */}
//                 {/* ToastContainer should be included once in your app */}
//                 <ToastContainer
//                     position="top-right"
//                     autoClose={5000}
//                     hideProgressBar={false}
//                     newestOnTop={false}
//                     closeOnClick
//                     rtl={false}
//                     pauseOnFocusLoss
//                     draggable
//                     pauseOnHover
//                     theme="colored"
//                 />
//             </Switch>
//         </Router>
//     );
// };

// export default App;

//! Below code is good
// // src/App.tsx
// import React from "react";
// // import { BrowserRouter as Router, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import SignUp from "./pages/SignUp";
// import ForgotPassword from "./pages/ForgotPassword";
// import HomePage from "./pages/HomePage";
// import AddCandidate from "./pages/pages2/AddCandidate";
// import { Route, Router, Switch } from "wouter";
// import TestingAddCandidate from "./pages/pages2/TestingAddCandidate";
// import VacancyPage from "./pages/vacancy/VacancyPage";
// import AddVacancies from "./pages/vacancy/AddVacancies";
// import RecommendedCandidates from "./pages/vacancy/RecommendedCandidates";

// const App: React.FC = () => {
//     return (
//         <Router>
//             <Switch>
//                 <Route path="/" component={HomePage} />
//                 <Route path="/matching-candidates" component={RecommendedCandidates} />
//                 <Route path="/login" component={Login} />
//                 <Route path="/signup" component={SignUp} />
//                 <Route path="/forgotPassword" component={ForgotPassword} />
//                 <Route path="/homepage" component={HomePage} />
//                 {/* <div className="min-h-screen bg-gray-100 flex items-center justify-center"> */}
//                 <Route path="/testingAddCandidate" component={TestingAddCandidate} />
//                 <Route path="/addCandidate" component={AddCandidate} />
//                 {/* </div> */}
//                 <Route path="/VacancyPage" component={VacancyPage} />
//                 <Route path="/AddVacancies" component={AddVacancies} />
//                 {/* <Route path="/matching-candidates" component={RecommendedCandidates} /> */}
//             </Switch>
//         </Router>
//     );
// };

// export default App;

{/* <div className="absolute inset-y-0 right-80 flex items-center pr-3 pointer-events-none"></div> */ }
{/* <div className="p-6 max-w-xs bg-white rounded-xl shadow-md"> */ }
{/* <table className="w-full border-collapse border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2">Profile</th>
                            <th className="p-2">Candidate</th>
                            <th className="p-2">Added by</th>
                            <th className="p-2">Date Added</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map((candidate) => (
                            <tr key={candidate.id}>
                                <td className="p-2">
                                    <img
                                        src="/path/to/avatar.png"
                                        alt={`Avatar for ${candidate.name}`}
                                        className="w-8 h-8 rounded-full"
                                    />
                                </td>
                                <td className="p-2">{candidate.name}</td>
                                <td className="p-2">{candidate.addedBy}</td>
                                <td className="p-2">{candidate.dateAdded}</td>
                            </tr>
                        ))}
                    </tbody>
                </table> */}


// import React, { useState } from 'react';

// const CandidateForm = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [link, setLink] = useState<string>('');

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setFile(event.target.files?.[0] || null);
//   };

//   const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setLink(event.target.value);
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
//       <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
//         New Candidate
//       </button>
//       <input
//         type="file"
//         accept=".pdf,.doc,.docx"
//         className="block w-full text-sm text-slate-500
//           file:mr-4 file:py-2 file:px-4
//           file:rounded-full file:border-0
//           file:text-sm file:font-semibold
//           file:bg-violet-50 file:text-violet-700
//           hover:file:bg-violet-100
//         "
//         onChange={handleFileChange}
//       />
//       <input
//         type="text"
//         className="block w-full text-sm text-slate-500
//           border border-gray-300 rounded-lg
//           cursor-pointer dark:text-gray-400
//           focus:outline-none dark:focus:ring-blue-800
//           dark:border-gray-600 dark:placeholder-gray-400
//           "
//         placeholder="Import resume via link"
//         value={link}
//         onChange={handleLinkChange}
//       />
//     </div>
//   );
// };

// export default CandidateForm;

{/* <header className="bg-blue-500 text-white p-4"> */ }
{/* <header className=" text-black p-1">
                <div className="flex items-center">
                    <img src="../src/assets/ATALogo.png" alt="Logo" className="h-20" />
                    <h1 className="text-xl">Talent Pool Database</h1>
                </div>
                <div className="flex justify-end space-x-4">
                    <button className="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                        Candidate
                    </button>
                    <button className="bg-white hover:bg-gray-600 text-black font-bold py-2 px-4 rounded border border-black">
                        Vacancies
                    </button>
                    <div className="cursor-pointer hover:bg-gray-600 rounded p-2">
                        <i className="fas fa-bars text-gray-800 text-2xl"></i>
                    </div>

                </div>
            </header> */}

{/* <header className="text-black p-1">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <img src="../src/assets/ATALogo.png" alt="Logo" className="h-20" />
                        <h1 className="text-xl ml-2">Talent Pool Database</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded border border-black ">
                            Candidate
                        </button>
                        <button className="bg-white hover:bg-gray-600 text-black font-bold py-2 px-4 rounded border border-black">
                            Vacancies
                        </button>
                        <div className="cursor-pointer hover:bg-gray-600 rounded p-2">
                            <i className="fas fa-bars text-gray-800 text-2xl"></i>
                        </div>
                    </div>
                </div>
            </header> */}

// import React from "react";
// import './App.css';
// import PasswordInput from "./PasswordInput";

// const App: React.FC = () => {
//   function handleClick() {
//     window.location.href = '/ForgotPassword';
//   }

//   return (
//     // <div className="min-h-screen bg-gray-100">
//     <div className="min-h-screen">
//       <header className="bg-white py-6">
//         <div className="flex justify-center">
//           <img src="../src/assets/ATALogo.png" alt="ATA logo" className="h-20" />
//         </div>
//         <div>
//           <h1 className="text-1xl font-bold">Talent Pool Database</h1>
//         </div>
//       </header>
//       <main className="container mx-auto px-4 py-0 max-w-md">
//         <div className="bg-white p-6 rounded shadow-md">
//           <form action="">
//             <div className="mb-4">
//               <input type="email" placeholder="E-mail" className="w-full border border-black p-1 rounded" />
//             </div>
//             <div>
//               <PasswordInput />
//             </div>
//             <p onClick={handleClick} className="text-right text-sm text-blue-500 underline mt-2" >Forgot your password?</p>
//             <div className="mt-4">
//               <button type="submit" className="bg-blue-500 text-white py-1 px-4 rounded" >Login</button>
//             </div>
//           </form>
//           <div className="flex items-center my-4 mx-6">
//             <div className="border-t border-gray-900 flex-grow mr-3"></div>
//             <span className="text-gray-900">OR</span>
//             <div className="border-t border-gray-900 flex-grow ml-3"></div>
//           </div>
//           <p>Don’t have an account?
//             <span className="text-blue-500 underline ml-2">SIGN UP</span>
//           </p>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default App;



// import React from "react";
// // import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import './App.css';
// import ForgotPassword from "./ForgotPassword"; // Import ForgotPassword component
// import { Link, Route, Router, Switch } from "wouter";

// const App: React.FC = () => {
//   return (
//     <Router>
//       <div className="min-h-screen">
//         <header className="bg-white py-6">
//           <div className="flex justify-center">
//             <img src="../src/assets/ATALogo.png" alt="ATA logo" className="h-20" />
//           </div>
//           <div>
//             <h1 className="text-1xl font-bold">Talent Pool Database</h1>
//           </div>
//         </header>
//         <main className="container mx-auto px-4 py-0 max-w-md">
//           <div className="bg-white p-6 rounded shadow-md">
//             <Switch>
//               <Route path="/ForgotPassword" component={ForgotPassword} /> {/* Route to ForgotPassword component */}
//               {/* Other routes */}
//             </Switch>
//           </div>
//         </main>
//       </div>
//       <div className="text-right text-sm text-blue-500 underline mt-2">
//         <Link to="/ForgotPassword">Forgot your password?</Link>
//       </div>
//     </Router>
//   );
// };

// export default App;


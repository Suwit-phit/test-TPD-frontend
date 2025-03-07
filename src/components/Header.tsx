import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Modal } from 'antd';
import { useClickAway } from 'react-use';
import { logout, User } from '../services/AuthService';

interface HeaderProps {
    token: string;
    setToken: (token: string | null) => void;
    candidateButtonClass: string;
    vacanciesButtonClass: string;
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

const Header = ({ token, setToken, candidateButtonClass, vacanciesButtonClass }: HeaderProps) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const dropdownRef = useRef(null);

    useClickAway(dropdownRef, () => setShowDropdown(false));

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    const goToPage = (path: string) => {
        navigate(path);
        setShowDropdown(false);
    };

    const handleLogout = () => {
        setIsLogoutModalOpen(true);
    };

    // const confirmLogout = () => {
    //     // Perform logout logic here
    //     setIsLogoutModalOpen(false);
    //     navigate('/logout');
    // };
    const confirmLogout = async () => {
        try {
            // await logout(token);
            // setIsLogoutModalOpen(false);
            // setToken(null); // Clear the token after logout
            // navigate('/logout');
            await logout(token);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);  // This ensures the token state is cleared
            navigate('/');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const cancelLogout = () => {
        setIsLogoutModalOpen(false);
    };

    // Get the first letter of the username
    const firstTwoLetters = user?.username?.substring(0, 2);

    // Get the unique abstract gradient background based on the username
    const backgroundGradient = user ? getGradientStyleByUsername(user.username) : '#ccc'; // Fallback color if no user

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            setUser({ userId: '', username: '', email: '' }); // Ensure user is never null
            // setUser({ userId: 0, username: '', email: '' }); // Ensure user is never null
        }
    }, []);

    return (
        <header>
            <div className='flex justify-between items-center'>
                <div className='flex items-center'>
                    <img onClick={() => goToPage('/')} src="assets/ATALogo.png" alt="ATALogo" className='h-20 cursor-pointer' />
                    <h1 onClick={() => goToPage('/')} className='text-lg ml-2 cursor-pointer hover:text-slate-300'>Talent Pool Database</h1>
                </div>
                <div className='flex items-center space-x-2 px-2'>
                    <button onClick={() => goToPage('/')} className={`${candidateButtonClass}`}>Candidate</button>
                    <button onClick={() => goToPage('/vacancy-page')} className={`${vacanciesButtonClass}`}>Vacancies</button>
                    <div className="relative">
                        <button onClick={toggleDropdown} className="cursor-pointer hover:bg-gray-200 rounded p-1">
                            {/* <i className="fas fa-bars text-gray-800 text-2xl"></i> */}
                            <div
                                className="flex items-center justify-center w-11 h-11 rounded-full text-white font-bold"
                                style={{
                                    // background: "radial-gradient(circle at 50% 70%, #4B275B 5%, #ED8848 25%, #EDCA6C 50%, #8CAFC9 75%)",
                                    background: backgroundGradient,
                                    color: '#fff', // White text for high contrast
                                    textShadow: '2px 2px 6px rgba(0, 0, 0, 0.4)', // Deeper shadow for legibility
                                    borderRadius: '50%', // Circle shape
                                }}
                            >
                                <div className='text-[23px]'>
                                    { (firstTwoLetters === null) ? ("?") : (firstTwoLetters) }
                                </div>
                                {/* <div className=' text-[25px]'>{firstTwoLetters}</div> */}
                                {/* <div className=' text-[28px]'>{firstLetter}</div> */}
                            </div>
                        </button>
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50" ref={dropdownRef}>
                                <div onClick={() => goToPage('/account-settings')} className="flex items-center px-6 py-3 text-base text-gray-700 hover:bg-gray-100 cursor-pointer">
                                    <i className="fas fa-cog mr-4"></i> Account settings
                                </div>
                                {/* <div onClick={() => goToPage('/notifications')} className="flex items-center px-6 py-3 text-base text-gray-700 hover:bg-gray-100 cursor-pointer">
                                    <i className="fas fa-bell mr-4"></i> Notifications
                                </div>
                                <div onClick={() => goToPage('/dark-mode')} className="flex items-center px-6 py-3 text-base text-gray-700 hover:bg-gray-100 cursor-pointer">
                                    <i className="fas fa-moon mr-4"></i> Dark Mode
                                </div> */}
                                <div onClick={handleLogout} className="flex items-center px-6 py-3 text-base text-gray-700 hover:bg-gray-100 cursor-pointer">
                                    <i className="fas fa-sign-out-alt mr-4"></i> Log out
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Ant Design Modal for Logout Confirmation */}
            <Modal
                title="Confirm Logout"
                open={isLogoutModalOpen}
                onOk={confirmLogout}
                onCancel={cancelLogout}
                okText="Yes, Logout"
                cancelText="Cancel"
                centered
                okType="danger"
            >
                <p>Are you sure you want to logout?</p>
            </Modal>
        </header>
    );
};

export default Header;




//! Below code with logout dialog
// import React, { useState, useRef } from 'react';
// import { useNavigate } from "react-router-dom";
// import { useClickAway } from 'react-use';

// interface HeaderProps {
//     candidateButtonClass: string;
//     vacanciesButtonClass: string;
// }

// const Header = ({ candidateButtonClass, vacanciesButtonClass }: HeaderProps) => {
//     const navigate = useNavigate();
//     const [showDropdown, setShowDropdown] = useState(false);
//     const dropdownRef = useRef(null);

//     useClickAway(dropdownRef, () => setShowDropdown(false));

//     const toggleDropdown = () => setShowDropdown(!showDropdown);

//     const goToPage = (path: string) => {
//         navigate(path);
//         setShowDropdown(false);
//     };

//     return (
//         <header>
//             <div className='flex justify-between items-center'>
//                 <div className='flex items-center'>
//                     <img onClick={() => goToPage('/')} src="../src/assets/ATALogo.png" alt="ATALogo" className='h-20 cursor-pointer' />
//                     <h1 onClick={() => goToPage('/')} className='text-lg ml-2 cursor-pointer hover:text-slate-300'>Talent Pool Database</h1>
//                 </div>
//                 <div className='flex items-center space-x-2 px-2'>
//                     <button onClick={() => goToPage('/')} className={`${candidateButtonClass}`}>Candidate</button>
//                     <button onClick={() => goToPage('/vacancy-page')} className={`${vacanciesButtonClass}`}>Vacancies</button>
//                     <div className="relative">
//                         <button onClick={toggleDropdown} className="cursor-pointer hover:bg-gray-600 rounded p-1">
//                             <i className="fas fa-bars text-gray-800 text-2xl"></i>
//                         </button>
//                         {showDropdown && (
//                             <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50" ref={dropdownRef}>
//                                 <div onClick={() => goToPage('/account-settings')} className="flex items-center px-4 py-2 text-base text-gray-700 hover:bg-gray-100 cursor-pointer">
//                                     <i className="fas fa-cog mr-2"></i> Account settings
//                                 </div>
//                                 <div onClick={() => goToPage('/notifications')} className="flex items-center px-4 py-2 text-base text-gray-700 hover:bg-gray-100 cursor-pointer">
//                                     <i className="fas fa-bell mr-2"></i> Notifications
//                                 </div>
//                                 <div onClick={() => goToPage('/dark-mode')} className="flex items-center px-4 py-2 text-base text-gray-700 hover:bg-gray-100 cursor-pointer">
//                                     <i className="fas fa-moon mr-2"></i> Dark Mode
//                                 </div>
//                                 <div onClick={() => goToPage('/logout')} className="flex items-center px-4 py-2 text-base text-gray-700 hover:bg-gray-100 cursor-pointer">
//                                     <i className="fas fa-sign-out-alt mr-2"></i> Log out
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </header>
//     );
// };

// export default Header;



// // import { navigate } from 'wouter/use-browser-location';
//! End
// import { useNavigate } from "react-router-dom";

// interface HeaderProps {
//     candidateButtonClass: string;
//     vacanciesButtonClass: string;
// }

// const Header = ({ candidateButtonClass, vacanciesButtonClass }: HeaderProps) => {

//     const navigate = useNavigate();

//     const GoToCandidatePage = () => {
//         navigate('/')
//     };

//     const GoToVacancyPage = () => {
//         console.log("GoToVacancyPage")
//         navigate('/vacancy-page')
//         // navigate('/VacancyPage')
//     };

//     return (
//         <header>
//             <div className='flex justify-between items-center'>
//                 <div className='flex items-center'>
//                     <img onClick={() => navigate('/')} src="../src/assets/ATALogo.png" alt="ATALogo" className='h-20 cursor-pointer' />
//                     <h1 onClick={() => navigate('/')} className='text-lg ml-2 cursor-pointer hover:text-slate-300'>Talent Pool Database</h1>
//                 </div>
//                 <div className='flex items-center space-x-2 px-2'>
//                     <button onClick={GoToCandidatePage} className={`${candidateButtonClass}`}>Candidate</button>
//                     <button onClick={GoToVacancyPage} className={`${vacanciesButtonClass}`}>Vacancies</button>
//                     {/* <button className=' bg-black hover:bg-gray-600 text-white font-bold py-2 px-2 rounded border border-black'>Candidate</button>
//                     <button onClick={GoToVacancyPage} className=' hover:bg-gray-600 text-black font-bold py-2 px-2 rounded border border-black'>Vacancies</button> */}
//                     <a href='/login' className="cursor-pointer hover:bg-gray-600 rounded p-1">
//                         <i className="fas fa-bars text-gray-800 text-2xl"></i>
//                     </a>
//                 </div>
//             </div>
//         </header>
//     );
// };

// export default Header;

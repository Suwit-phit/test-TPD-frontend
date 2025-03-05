// import React, { useState } from 'react';

// const CommentsSection = ({ comments }) => {
//     const [showReplies, setShowReplies] = useState({});

//     const toggleReplies = (commentId) => {
//         setShowReplies((prevState) => ({
//             ...prevState,
//             [commentId]: !prevState[commentId],
//         }));
//     };

//     return (
//         <div className="h-[750px] w-[500px] bg-white shadow-md rounded mt-4 px-6 pt-6 pb-8 relative overflow-hidden">
//             {/* Header */}
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-bold">Comments</h2>
//                 <span className="text-gray-500">{comments.length} comments</span>
//             </div>

//             {/* Comments List */}
//             <div className="h-[620px] overflow-y-auto pr-4 pb-4">
//                 {comments.map((comment) => (
//                     <div key={comment.id} className="mb-4 flex items-start">
//                         {/* User Initials */}
//                         <div
//                             className="h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold mr-3"
//                             style={{ backgroundColor: getRandomColor() }}
//                         >
//                             {comment.username.slice(0, 2).toUpperCase()}
//                         </div>
//                         <div className="flex-1">
//                             <p className="font-semibold">{comment.username}</p>
//                             <p className="text-gray-700">{comment.text}</p>
//                             {/* Toggle Replies */}
//                             <div
//                                 className="text-blue-500 cursor-pointer"
//                                 onClick={() => toggleReplies(comment.id)}
//                             >
//                                 Reply {comment.replies?.length ? `(${comment.replies.length})` : ''}
//                             </div>
//                             {showReplies[comment.id] && (
//                                 <div className="ml-8 mt-2">
//                                     {comment.replies.map((reply) => (
//                                         <div key={reply.id} className="mb-2 flex items-start">
//                                             <div
//                                                 className="h-6 w-6 rounded-full flex items-center justify-center text-white font-semibold mr-2"
//                                                 style={{ backgroundColor: getRandomColor() }}
//                                             >
//                                                 {reply.username.slice(0, 2).toUpperCase()}
//                                             </div>
//                                             <div className="flex-1">
//                                                 <p className="font-semibold">{reply.username}</p>
//                                                 <p className="text-gray-700">{reply.text}</p>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Add Comment (Floating at the bottom) */}
//             <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-md px-6 py-4">
//                 <div className="flex items-start">
//                     <div className="h-10 w-10 rounded-full overflow-hidden mr-4">
//                         <img src="user-profile-image.jpg" alt="User profile" className="h-full w-full object-cover" />
//                     </div>
//                     <div className="flex-1">
//                         <input
//                             type="text"
//                             placeholder="Add your comment..."
//                             className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
//                         />
//                     </div>
//                     <button className="ml-4 bg-blue-500 text-white px-4 py-2 rounded">
//                         Post
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // Helper function to get random color for the user initials background
// function getRandomColor() {
//     const colors = ['#FFD700', '#FF6347', '#4682B4', '#6A5ACD', '#32CD32'];
//     return colors[Math.floor(Math.random() * colors.length)];
// }

// export default CommentsSection;

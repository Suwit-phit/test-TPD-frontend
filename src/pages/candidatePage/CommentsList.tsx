import React, { useEffect, useState } from 'react'
import { createComment, deleteComment, fetchCandidateComments, replyToComment, updateComment } from '../../API/commentsApi';
import { User } from '../../services/AuthService';

interface Comment {
    id: string;
    author: string;
    authorUsername: string;
    content: string;
    replies?: Comment[];
}


interface CommentsListProps {
    token: string;
    candidateId: string;
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

const CommentsList: React.FC<CommentsListProps> = ({ candidateId, token }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});
    const [replyContent, setReplyContent] = useState<Record<string, string>>({});
    const [editContent, setEditContent] = useState<Record<string, string>>({});
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingReplyId, setEditingReplyId] = useState<string | null>(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await fetchCandidateComments(candidateId, token);
                console.log("data under const data = await fetchCandidateComments(candidateId, token);")
                console.log("data = ", data);
                setComments(data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };
        fetchComments();
    }, [candidateId, token]);

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

    const firstTwoLetters = user?.username?.substring(0, 2);
    const backgroundGradient = user ? getGradientStyleByUsername(user.username) : '#ccc'; // Fallback color if no user

    const handlePostComment = async () => {
        if (!newComment.trim()) return;

        try {
            const newCommentData = await createComment(token, candidateId, user?.userId ?? "", newComment);
            setComments((prev) => [...prev, newCommentData]);
            setNewComment("");
        } catch (error) {
            console.error("Failed to post comment:", error);
        }
    };

    const toggleReplies = (commentId: string) => {
        setShowReplies((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    const handleReplyChange = (commentId: string, content: string) => {
        setReplyContent((prev) => ({
            ...prev,
            [commentId]: content,
        }));
    };

    const handleReplySubmit = async (commentId: string) => {
        const content = replyContent[commentId];
        if (!content.trim()) return;

        try {
            // const newReply = await postReply(token, commentId, content);
            const newReply = await replyToComment(commentId, user?.userId || "", content, token);
            setComments((prev) =>
                prev.map((comment) =>
                    comment.id === commentId
                        ? {
                            ...comment,
                            replies: comment.replies ? [...comment.replies, newReply] : [newReply],
                        }
                        : comment
                )
            );
            setReplyContent((prev) => ({
                ...prev,
                [commentId]: "",
            }));
        } catch (error) {
            console.error("Failed to post reply:", error);
        }
    };

    const handleEditComment = (commentId: string, currentContent: string) => {
        setEditingCommentId(commentId);
        setEditContent((prev) => ({ ...prev, [commentId]: currentContent }));
    };

    const handleEditChange = (commentId: string, content: string) => {
        setEditContent((prev) => ({ ...prev, [commentId]: content }));
    };

    const handleEditSubmit = async (commentId: string) => {
        try {
            const updatedContent = editContent[commentId];
            await updateComment(commentId, updatedContent, token);
            setComments((prev) =>
                prev.map((comment) =>
                    comment.id === commentId ? { ...comment, content: updatedContent } : comment
                )
            );
            setEditingCommentId(null);
        } catch (error) {
            console.error("Failed to update comment:", error);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await deleteComment(token, commentId);
            setComments((prev) => prev.filter((comment) => comment.id !== commentId));
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    };

    const handleEditReply = (replyId: string, currentContent: string) => {
        setEditingReplyId(replyId);
        setEditContent((prev) => ({ ...prev, [replyId]: currentContent }));
    };

    const handleEditReplySubmit = async (replyId: string, parentCommentId: string) => {
        try {
            const updatedContent = editContent[replyId];
            await updateComment(replyId, updatedContent, token);
            setComments((prev) =>
                prev.map((comment) =>
                    comment.id === parentCommentId
                        ? {
                            ...comment,
                            replies: comment.replies?.map((reply) =>
                                reply.id === replyId ? { ...reply, content: updatedContent } : reply
                            ),
                        }
                        : comment
                )
            );
            setEditingReplyId(null);
        } catch (error) {
            console.error("Failed to update reply:", error);
        }
    };

    const handleDeleteReply = async (replyId: string, parentCommentId: string) => {
        try {
            await deleteComment(token, replyId);
            setComments((prev) =>
                prev.map((comment) =>
                    comment.id === parentCommentId
                        ? {
                            ...comment,
                            replies: comment.replies?.filter((reply) => reply.id !== replyId),
                        }
                        : comment
                )
            );
        } catch (error) {
            console.error("Failed to delete reply:", error);
        }
    };

    return (
        // <div className="relative bg-white shadow-md rounded mt-4">
        //     <div className="h-[750px] overflow-y-auto px-6 pt-6 pb-24">
        //         <h2 className="text-lg font-bold mb-4">Comments</h2>
        <div className="h-[750px] w-[500px] bg-white shadow-md rounded mt-4 px-6 pt-6 pb-8 relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Comments</h2>
                {/* <span className="text-gray-500">{comments.length} comments</span> */}
                <span className="text-gray-500">
                    {comments.reduce((total, comment) => total + 1 + (comment.replies?.length || 0), 0)} comments
                </span>

                {/* <span className="text-gray-500">12 comments</span> */}
            </div>

            {/* Comments List */}
            <div className="h-[620px] overflow-y-auto pr-4 pb-4">
                {comments.length === 0 ? (
                    <p className="text-gray-500 text-center">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="mb-4">
                            <div className="flex items-start">
                                <div
                                    className="h-8 w-8 text-[15px] rounded-full flex items-center justify-center text-white font-bold mr-3"
                                    style={{ background: getGradientStyleByUsername(comment.authorUsername) }}
                                >
                                    {/* {comment.authorUsername.slice(0, 2).toUpperCase()} */}
                                    {comment.authorUsername.slice(0, 2)}
                                </div>
                                <div>
                                    {/* <p className="font-bold">{comment.authorUsername}</p> */}
                                    {/* <p>{comment.content}</p> */}
                                    <p className="font-bold">{comment.authorUsername}</p>
                                    {editingCommentId === comment.id ? (
                                        <div>
                                            <textarea
                                                value={editContent[comment.id]}
                                                onChange={(e) => handleEditChange(comment.id, e.target.value)}
                                                className="w-full border rounded px-3 py-2 mt-2"
                                            />
                                            <button
                                                onClick={() => handleEditSubmit(comment.id)}
                                                className="bg-green-500 text-white px-3 py-1 rounded mt-2 mr-2"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingCommentId(null)}
                                                className="bg-gray-300 px-3 py-1 rounded mt-2"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <p>{comment.content}</p>
                                    )}
                                    <button
                                        onClick={() => handleEditComment(comment.id, comment.content)}
                                        className="text-sm text-blue-500 mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className="text-sm text-red-500"
                                    >
                                        Delete
                                    </button>
                                    {/* <div
                                        className="text-blue-500 cursor-pointer mt-2"
                                        onClick={() => toggleReplies(comment.id)}
                                    >
                                        Reply {comment.replies?.length ? `(${comment.replies.length})` : ""}
                                    </div> */}
                                    <div
                                        className="text-blue-500 cursor-pointer mt-2"
                                        onClick={() => toggleReplies(comment.id)}
                                    >
                                        {/* {showReplies[comment.id] ? "Hide Replies" : `View Replies (${comment.replies?.length || 0})`} */}
                                        {showReplies[comment.id] ? "Hide Replies" : `View Replies ${comment.replies?.length || ''}`}
                                    </div>

                                </div>
                            </div>
                            {showReplies[comment.id] && (
                                <div className="ml-8 mt-2">
                                    {comment.replies?.length === 0 && (
                                        <p className="text-gray-500">No replies yet. Be the first to reply!</p>
                                    )}
                                    {comment.replies?.map((reply) => (
                                        <div key={reply.id} className="flex items-start mb-2">
                                            <div
                                                className="h-6 w-6 text-[10px] rounded-full flex items-center justify-center text-white font-bold mr-2"
                                                style={{ background: getGradientStyleByUsername(reply.authorUsername) }}
                                            >
                                                {/* {reply.authorUsername.slice(0, 2).toUpperCase()} */}
                                                {reply.authorUsername.slice(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-bold">{reply.authorUsername}</p>
                                                {/* <p>{reply.content}</p> */}
                                                {editingReplyId === reply.id ? (
                                                    <div>
                                                        <textarea
                                                            value={editContent[reply.id]}
                                                            onChange={(e) => handleEditChange(reply.id, e.target.value)}
                                                            className="w-full border rounded px-3 py-2 mt-2"
                                                        />
                                                        <button
                                                            onClick={() => handleEditReplySubmit(reply.id, comment.id)}
                                                            className="bg-green-500 text-white px-3 py-1 rounded mt-2 mr-2"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingReplyId(null)}
                                                            className="bg-gray-300 px-3 py-1 rounded mt-2"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <p>{reply.content}</p>
                                                )}
                                                <button
                                                    onClick={() => handleEditReply(reply.id, reply.content)}
                                                    className="text-sm text-blue-500 mr-2"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteReply(reply.id, comment.id)}
                                                    className="text-sm text-red-500"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {/* <textarea
                                        value={replyContent[comment.id] || ""}
                                        onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                                        placeholder="Write a reply..."
                                        className="w-full border rounded px-4 py-2 mt-2"
                                    />
                                    <button
                                        onClick={() => handleReplySubmit(comment.id)}
                                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Post Reply
                                    </button> */}
                                    <div className="flex items-start">
                                        <div
                                            className="mr-2 flex items-center justify-center w-10 h-10 rounded-full text-white font-bold"
                                            style={{
                                                // background: "radial-gradient(circle at 50% 70%, #4B275B 5%, #ED8848 25%, #EDCA6C 50%, #8CAFC9 75%)",
                                                background: backgroundGradient,
                                                color: '#fff', // White text for high contrast
                                                textShadow: '2px 2px 6px rgba(0, 0, 0, 0.4)', // Deeper shadow for legibility
                                                borderRadius: '50%', // Circle shape
                                            }}
                                        >
                                            <div className='text-[17px] text-center'>
                                                {(firstTwoLetters === null) ? ("?") : (firstTwoLetters)}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <textarea
                                                value={replyContent[comment.id] || ""}
                                                onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                                                placeholder="Add your comment..."
                                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none resize-none"
                                                rows={1}
                                                onInput={(e) => {
                                                    const target = e.target as HTMLTextAreaElement;
                                                    target.style.height = "auto";
                                                    target.style.height = `${target.scrollHeight}px`;
                                                }}
                                            />
                                        </div>
                                        <button onClick={() => handleReplySubmit(comment.id)} className="text-[16px] ml-4 bg-blue-500 text-white px-2 py-2 rounded">
                                            Post Reply
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
            {/* <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-md px-6 py-4"> */}
            <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-md px-6 py-4">
                <div className="flex items-start">
                    <div
                        className="mr-2 flex items-center justify-center w-11 h-11 rounded-full text-white font-bold"
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
                    <div className="flex-1">
                        <textarea
                            placeholder="Add your comment..."
                            // className="w-full border rounded px-4 py-2"
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none resize-none"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={1}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = "auto";
                                target.style.height = `${target.scrollHeight}px`;
                            }}
                        />
                    </div>
                    <button
                        onClick={handlePostComment}
                        className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentsList;


//! End
// const CommentsList: React.FC<CommentsListProps> = ({ candidateId, token }) => {
//     const [comments, setComments] = useState<Comment[]>([]);
//     // Define the type of `showReplies` state as an object with string keys and boolean values
//     const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});


//     // Adjust the toggleReplies function to use the correct types
//     const toggleReplies = (commentId: string) => {
//         setShowReplies((prevState) => ({
//             ...prevState,
//             [commentId]: !prevState[commentId],
//         }));
//     };

//     useEffect(() => {
//         const getComments = async () => {
//             try {
//                 // const data = await fetchAllComments(token);
//                 const data = await fetchCandidateComments(candidateId, token);
//                 setComments(data);
//                 console.log("data = ", data);
//             } catch (error) {
//                 console.error('Failed to fetch comments:', error);
//             }
//         };
//         getComments();
//     }, [candidateId, token]);
//     // }, [token]);

//     const [user, setUser] = useState<User | null>(null);

//     // Get the first letter of the username
//     const firstTwoLetters = user?.username?.substring(0, 2);
//     // const firstTwoLetters = comments.map((comment) => {
//     //     return (comment.authorUsername.substring(0, 2));
//     // });

//     // Get the unique abstract gradient background based on the username
//     const backgroundGradient = user ? getGradientStyleByUsername(user.username) : '#ccc'; // Fallback color if no user

//     useEffect(() => {
//         const userData = localStorage.getItem('user');
//         if (userData) {
//             setUser(JSON.parse(userData));
//         } else {
//             setUser({ userId: '', username: '', email: '' }); // Ensure user is never null
//             // setUser({ userId: 0, username: '', email: '' }); // Ensure user is never null
//         }
//     }, []);


//     return (
//         <div className="h-[750px] w-[500px] bg-white shadow-md rounded mt-4 px-6 pt-6 pb-8 relative overflow-hidden">
//             {/* Header */}
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-bold">Comments</h2>
//                 <span className="text-gray-500">{comments.length} comments</span>
//                 {/* <span className="text-gray-500">12 comments</span> */}
//             </div>

//             {/* Comments List */}
//             <div className="h-[620px] overflow-y-auto pr-4 pb-4">
//                 {comments.map((comment) => (
//                     <div key={comment.id} className="mb-4 flex items-start">
//                         {/* User Initials */}
//                         <div
//                             className="h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold mr-3"
//                             // style={{ backgroundColor: getRandomColor() }}
//                             style={{
//                                 // background: "radial-gradient(circle at 50% 70%, #4B275B 5%, #ED8848 25%, #EDCA6C 50%, #8CAFC9 75%)",
//                                 // background: backgroundGradient,
//                                 background: getGradientStyleByUsername(comment.authorUsername),
//                                 color: '#fff', // White text for high contrast
//                                 textShadow: '2px 2px 6px rgba(0, 0, 0, 0.4)', // Deeper shadow for legibility
//                                 borderRadius: '50%', // Circle shape
//                             }}
//                         >
//                             {/* {comment.authorUsername.slice(0, 2).toUpperCase()} */}
//                             {comment.authorUsername.slice(0, 2)}
//                             {/* {(firstTwoLetters === null) ? ("?") : (firstTwoLetters)} */}
//                         </div>
//                         <div className="flex-1">
//                             <p className="font-semibold">{comment.authorUsername}</p>
//                             <p className="text-gray-700">{comment.content}</p>
//                             {/* Toggle Replies */}
//                             <div
//                                 className="text-blue-500 cursor-pointer"
//                                 onClick={() => toggleReplies(comment.id)}
//                             >
//                                 Reply {comment.replies?.length ? `(${comment.replies.length})` : ''}
//                                 {/* Reply 12 */}
//                             </div>
//                             {showReplies[comment.id] && (
//                                 <div className="ml-8 mt-2">
//                                     {comment.replies?.map((reply) => (
//                                         <div className="mb-2 flex items-start">
//                                             <div
//                                                 className="h-6 w-6 rounded-full flex items-center justify-center text-white font-semibold mr-2"
//                                                 // style={{
//                                                 //     backgroundColor: getRandomColor()
//                                                 // }}
//                                                 style={{
//                                                     // background: "radial-gradient(circle at 50% 70%, #4B275B 5%, #ED8848 25%, #EDCA6C 50%, #8CAFC9 75%)",
//                                                     // background: backgroundGradient,
//                                                     background: getGradientStyleByUsername(comment.authorUsername),
//                                                     color: '#fff', // White text for high contrast
//                                                     textShadow: '2px 2px 6px rgba(0, 0, 0, 0.4)', // Deeper shadow for legibility
//                                                     borderRadius: '50%', // Circle shape
//                                                 }}
//                                             >
//                                                 {reply.authorUsername.slice(0, 2).toUpperCase()}
//                                             </div>
//                                             <div className="flex-1">
//                                                 <p className="font-semibold">{reply.authorUsername}</p>
//                                                 <p className="text-gray-700">{reply.content}</p>
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
//                     <div
//                         className="mr-2 flex items-center justify-center w-11 h-11 rounded-full text-white font-bold"
//                         style={{
//                             // background: "radial-gradient(circle at 50% 70%, #4B275B 5%, #ED8848 25%, #EDCA6C 50%, #8CAFC9 75%)",
//                             background: backgroundGradient,
//                             color: '#fff', // White text for high contrast
//                             textShadow: '2px 2px 6px rgba(0, 0, 0, 0.4)', // Deeper shadow for legibility
//                             borderRadius: '50%', // Circle shape
//                         }}
//                     >
//                         <div className='text-[19px] text-center'>
//                             {(firstTwoLetters === null) ? ("?") : (firstTwoLetters)}
//                         </div>
//                     </div>
//                     <div className="flex-1">
//                         <textarea
//                             placeholder="Add your comment..."
//                             className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none resize-none"
//                             rows={1}
//                             onInput={(e) => {
//                                 const target = e.target as HTMLTextAreaElement;
//                                 target.style.height = "auto";
//                                 target.style.height = `${target.scrollHeight}px`;
//                             }}
//                         />
//                     </div>
//                     <button className="ml-4 bg-blue-500 text-white px-4 py-2 rounded">
//                         Post
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default CommentsList

//! Below code is good but with comments
// import React, { useEffect, useState } from 'react'
// import { fetchCandidateComments } from '../../API/commentsApi';
// import { User } from '../../services/AuthService';

// interface Comment {
//     id: string;
//     author: string;
//     authorUsername: string;
//     content: string;
//     replies?: Comment[];
// }


// interface CommentsListProps {
//     token: string;
//     candidateId: string;
// }

// // Utility function to map each username to a specific gradient style
// const getGradientStyleByUsername = (username: string) => {
//     // List of gradient styles to choose from, including new ones like "Blurred", "Non-regular Blending", "Tri-color", and "Multi-Color"
//     const gradientStyles = [
//         'linear-gradient(45deg, #f3ec78, #af4261)',  // Style 1
//         'radial-gradient(circle, #ff9a9e 0%, #fad0c4 100%)',  // Style 2
//         'conic-gradient(from 180deg at 50% 50%, #8ec5fc, #e0c3fc)',  // Style 3
//         // 'repeating-linear-gradient(45deg, #0cd102 0%, #0dba04 10%, #0cd102 10%, #0cd102 20%)',  // Style 4
//         "radial-gradient(circle at 50% 70%, #4B275B 5%, #ED8848 25%, #EDCA6C 50%, #8CAFC9 75%)",
//         // 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',  // Style 5
//         'radial-gradient(circle at top, #08fffb 20%, #c8e6c9 40%, #ffecb3 60%, #16ff05 90%)',  // Green-yellow gradient with white at the top
//         'radial-gradient(circle, #89f7fe, #66a6ff)',  // Style 6
//         'conic-gradient(from 0deg, #ff9966, #ff5e62)',  // Style 7
//         'linear-gradient(180deg, #3a1c71, #d76d77, #ffaf7b)',  // Tri-color gradient
//         'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)',  // Blurred gradient
//         'repeating-linear-gradient(45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',  // Multi-Color gradient
//         'linear-gradient(90deg, rgba(255,0,150,1) 0%, rgba(0,204,255,1) 100%)',  // Non-regular blending gradient
//     ];

//     // Generate an index based on the username's length and first character's char code
//     const index = (username.length + username.charCodeAt(0)) % gradientStyles.length;

//     console.log(`username: ${username}, index: ${index}`)

//     // Return a unique gradient style for each username
//     return gradientStyles[index];
// };

// const CommentsList: React.FC<CommentsListProps> = ({ candidateId, token }) => {
//     const [comments, setComments] = useState<Comment[]>([]);
//     // Define the type of `showReplies` state as an object with string keys and boolean values
//     const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});


//     // Adjust the toggleReplies function to use the correct types
//     const toggleReplies = (commentId: string) => {
//         setShowReplies((prevState) => ({
//             ...prevState,
//             [commentId]: !prevState[commentId],
//         }));
//     };

//     // const comment =
//     // // [
//     // {
//     //     id: "asdf",
//     //     username: "asdf",
//     //     text: "asdf"
//     // }
//     // // ]
//     // const reply =
//     // // [
//     // {
//     //     id: "asdf",
//     //     username: "asdf",
//     //     text: "asdf"
//     // }
//     // // ]

//     useEffect(() => {
//         const getComments = async () => {
//             try {
//                 // const data = await fetchAllComments(token);
//                 const data = await fetchCandidateComments(candidateId, token);
//                 setComments(data);
//                 console.log("data = ", data);
//             } catch (error) {
//                 console.error('Failed to fetch comments:', error);
//             }
//         };
//         getComments();
//     },[candidateId, token]);
//     // }, [token]);

//     const [user, setUser] = useState<User | null>(null);

//     // Get the first letter of the username
//     const firstTwoLetters = user?.username?.substring(0, 2);
//     // const firstTwoLetters = comments.map((comment) => {
//     //     return (comment.authorUsername.substring(0, 2));
//     // });

//     // Get the unique abstract gradient background based on the username
//     const backgroundGradient = user ? getGradientStyleByUsername(user.username) : '#ccc'; // Fallback color if no user

//     useEffect(() => {
//         const userData = localStorage.getItem('user');
//         if (userData) {
//             setUser(JSON.parse(userData));
//         } else {
//             setUser({ userId: '', username: '', email: '' }); // Ensure user is never null
//             // setUser({ userId: 0, username: '', email: '' }); // Ensure user is never null
//         }
//     }, []);


//     return (
//         <div className="h-[750px] w-[500px] bg-white shadow-md rounded mt-4 px-6 pt-6 pb-8 relative overflow-hidden">
//             {/* Header */}
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-bold">Comments</h2>
//                 <span className="text-gray-500">{comments.length} comments</span>
//                 {/* <span className="text-gray-500">12 comments</span> */}
//             </div>

//             {/* Comments List */}
//             <div className="h-[620px] overflow-y-auto pr-4 pb-4">
//                 {comments.map((comment) => (
//                     <div key={comment.id} className="mb-4 flex items-start">
//                         {/* User Initials */}
//                         <div
//                             className="h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold mr-3"
//                             // style={{ backgroundColor: getRandomColor() }}
//                             style={{
//                                 // background: "radial-gradient(circle at 50% 70%, #4B275B 5%, #ED8848 25%, #EDCA6C 50%, #8CAFC9 75%)",
//                                 // background: backgroundGradient,
//                                 background: getGradientStyleByUsername(comment.authorUsername),
//                                 color: '#fff', // White text for high contrast
//                                 textShadow: '2px 2px 6px rgba(0, 0, 0, 0.4)', // Deeper shadow for legibility
//                                 borderRadius: '50%', // Circle shape
//                             }}
//                         >
//                             {/* {comment.authorUsername.slice(0, 2).toUpperCase()} */}
//                             {comment.authorUsername.slice(0, 2)}
//                             {/* {(firstTwoLetters === null) ? ("?") : (firstTwoLetters)} */}
//                         </div>
//                         {/* <div
//                             className="flex items-center justify-center h-8 w-8 rounded-full text-white font-bold"
//                             style={{
//                                 // background: "radial-gradient(circle at 50% 70%, #4B275B 5%, #ED8848 25%, #EDCA6C 50%, #8CAFC9 75%)",
//                                 background: backgroundGradient,
//                                 color: '#fff', // White text for high contrast
//                                 textShadow: '2px 2px 6px rgba(0, 0, 0, 0.4)', // Deeper shadow for legibility
//                                 borderRadius: '50%', // Circle shape
//                             }}
//                         >
//                             <div className='text-[23px]'>
//                                 {(firstTwoLetters === null) ? ("?") : (firstTwoLetters)}
//                             </div>
//                         </div> */}
//                         <div className="flex-1">
//                             <p className="font-semibold">{comment.authorUsername}</p>
//                             <p className="text-gray-700">{comment.content}</p>
//                             {/* Toggle Replies */}
//                             <div
//                                 className="text-blue-500 cursor-pointer"
//                                 onClick={() => toggleReplies(comment.id)}
//                             >
//                                 Reply {comment.replies?.length ? `(${comment.replies.length})` : ''}
//                                 {/* Reply 12 */}
//                             </div>
//                             {showReplies[comment.id] && (
//                                 <div className="ml-8 mt-2">
//                                     {comment.replies?.map((reply) => (
//                                         <div className="mb-2 flex items-start">
//                                             <div
//                                                 className="h-6 w-6 rounded-full flex items-center justify-center text-white font-semibold mr-2"
//                                                 // style={{
//                                                 //     backgroundColor: getRandomColor()
//                                                 // }}
//                                                 style={{
//                                                     // background: "radial-gradient(circle at 50% 70%, #4B275B 5%, #ED8848 25%, #EDCA6C 50%, #8CAFC9 75%)",
//                                                     // background: backgroundGradient,
//                                                     background: getGradientStyleByUsername(comment.authorUsername),
//                                                     color: '#fff', // White text for high contrast
//                                                     textShadow: '2px 2px 6px rgba(0, 0, 0, 0.4)', // Deeper shadow for legibility
//                                                     borderRadius: '50%', // Circle shape
//                                                 }}
//                                             >
//                                                 {reply.authorUsername.slice(0, 2).toUpperCase()}
//                                             </div>
//                                             <div className="flex-1">
//                                                 <p className="font-semibold">{reply.authorUsername}</p>
//                                                 <p className="text-gray-700">{reply.content}</p>
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
//                     {/* <div className="h-10 w-10 rounded-full overflow-hidden mr-4">
//                         <img src="user-profile-image.jpg" alt="User profile" className="h-full w-full object-cover" />
//                     </div> */}
//                     <div
//                         className="mr-2 flex items-center justify-center w-11 h-11 rounded-full text-white font-bold"
//                         style={{
//                             // background: "radial-gradient(circle at 50% 70%, #4B275B 5%, #ED8848 25%, #EDCA6C 50%, #8CAFC9 75%)",
//                             background: backgroundGradient,
//                             color: '#fff', // White text for high contrast
//                             textShadow: '2px 2px 6px rgba(0, 0, 0, 0.4)', // Deeper shadow for legibility
//                             borderRadius: '50%', // Circle shape
//                         }}
//                     >
//                         <div className='text-[19px] text-center'>
//                             {(firstTwoLetters === null) ? ("?") : (firstTwoLetters)}
//                         </div>
//                     </div>
//                     <div className="flex-1">
//                         <textarea
//                             placeholder="Add your comment..."
//                             className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none resize-none"
//                             rows={1}
//                             onInput={(e) => {
//                                 const target = e.target as HTMLTextAreaElement;
//                                 target.style.height = "auto";
//                                 target.style.height = `${target.scrollHeight}px`;
//                             }}
//                         />
//                     </div>
//                     <button className="ml-4 bg-blue-500 text-white px-4 py-2 rounded">
//                         Post
//                     </button>
//                 </div>
//             </div>

//             {/* <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-md px-6 py-4">
//                         <div className="flex items-start">
//                             <div className="h-10 w-10 rounded-full overflow-hidden mr-4">
//                                 <img src="user-profile-image.jpg" alt="User profile" className="h-full w-full object-cover" />
//                             </div>
//                             <div className="flex-1">
//                                 <input
//                                     type="text"
//                                     placeholder="Add your comment..."
//                                     className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
//                                 />
//                             </div>
//                             <button className="ml-4 bg-blue-500 text-white px-4 py-2 rounded">
//                                 Post
//                             </button>
//                         </div>
//                     </div> */}
//         </div>
//     )
// }

// // Helper function to get random color for the user initials background
// // function getRandomColor() {
// //     const colors = ['#FFD700', '#FF6347', '#4682B4', '#6A5ACD', '#32CD32'];
// //     return colors[Math.floor(Math.random() * colors.length)];
// // }

// export default CommentsList
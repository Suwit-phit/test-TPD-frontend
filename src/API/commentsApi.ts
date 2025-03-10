import axios from "axios";

// src/api/commentsApi.ts
// export const BASE_URL = 'http://localhost:8080/api/comments';
// export const BASE_URL = 'https://test-tpd-sb.onrender.com/api/comments';
const SB_BASE_URL = import.meta.env.VITE_TPD_SB_APP_API_URL;
export const BASE_URL = `${SB_BASE_URL}/api/comments`;

export async function fetchAllComments(token: string) {
    const response = await fetch(`${BASE_URL}/all`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
}

export const fetchCandidateComments = async (candidateId: string, token: string) => {
    const response = await axios.get(`${BASE_URL}/candidate/${candidateId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// export async function createComment(candidateId: string, authorId: string, content: string, token: string) {
//     const response = await fetch(`${BASE_URL}/candidate/${candidateId}`, {
//         method: 'POST',
//         headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(content),
//     });
//     return response.json();
// }
// export async function createComment(token: string, candidateId: string, authorId: string, content: string) {
//     console.log("under export async function createComment = ", token);
//     console.log("under export async function createComment = ", candidateId);
//     console.log("under export async function createComment = ", authorId);
//     const response = await fetch(`${BASE_URL}/candidate/${candidateId}`, {
//         method: 'POST',
//         headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ authorId, content }),  // Use an object here
//     });
//     if (!response.ok) {
//         throw new Error("Failed to create comment");
//     }
//     return response.json();
// }
export async function createComment(
    token: string,
    candidateId: string,
    authorId: string,
    content: string
) {
    console.log("under export async function createComment = ", token);
    console.log("under export async function createComment = ", candidateId);
    console.log("under export async function createComment = ", authorId);

    const response = await fetch(
        `${BASE_URL}/candidate/${candidateId}?authorId=${authorId}`, // authorId added as query parameter
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(content), // Only sending content in the body now
        }
    );

    if (!response.ok) {
        throw new Error("Failed to create comment");
    }

    return response.json();
}

export const replyToComment = async (
    commentId: string,
    authorId: string,
    content: string,
    token: string
) => {
    const response = await axios.post(
        `${BASE_URL}/${commentId}/reply`,
        content,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            params: { authorId },
        }
    );
    return response.data;
};



export async function updateComment(commentId: string, content: string, token: string) {
    const response = await fetch(`${BASE_URL}/${commentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(content),
    });
    return response.json();
}

export async function deleteComment(token: string, commentId: string) {
    await fetch(`${BASE_URL}/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
}

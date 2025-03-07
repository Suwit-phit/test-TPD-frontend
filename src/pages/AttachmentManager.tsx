//* This is the Testing AttachmentsPage component that allows users to upload and view attachments

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify'; // Import toast for notifications

interface Attachment {
    fileName: string;
    url: string;
    createdAt?: string;
}

const AttachmentsPage = () => {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    useEffect(() => {
        // fetchAttachments();
        getAttachments(token!, "fileName", true);
    }, []);

    const fetchAttachments = async () => {
        if (!token) {
            console.error("No token found. Please log in.");
            return;
        }

        //! I miss spelling attachments with attactments
        try {
            const response = await axios.get<Attachment[]>(
                "http://localhost:8080/api/attactments-outside",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setAttachments(response.data);
        } catch (error) {
            console.error("Error fetching attachments", error);
        }
    };

    // Fetch all attachments with optional sorting and ordering options
   const getAttachments = async (token: string, sortBy?: string, ascending?: boolean) => {
        if (!token) {
            console.error("No token found. Please log in.");
            toast.error("No token found. Please log in.");
            return;
        }

        try {
            let response;

            console.log("Token in getAttachments:", token);

            if (sortBy) {
                console.log("Sorting by:", sortBy, "Order:", ascending);
                response = await axios.get("http://localhost:8080/api/attactments-outside", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { sortBy, ascending },
                });
            } else {
                console.log("Fetching attachments without sorting...");
                response = await axios.get("http://localhost:8080/api/attactments-outside", {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            console.log("Response Data:", response.data);
            toast.success("Attachments fetched successfully");
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error("Error fetching attachments:", error.response.data);
                toast.error(error.response.data);
            } else {
                console.error("Unexpected error:", error);
                toast.error("Failed to get all attachments");
            }
            throw error;
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file || !token) {
            console.error("File or token missing!");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.post(
                "http://localhost:8080/api/attactments-outside/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchAttachments();
        } catch (error) {
            console.error("Error uploading file", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Attachments</h2>
            <input type="file" onChange={handleFileChange} className="mb-2" />
            <button
                onClick={handleUpload}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                {loading ? "Uploading..." : "Upload"}
            </button>
            <ul className="mt-4">
                {attachments.map((attachment, index) => (
                    <li key={index} className="border-b py-2">
                        <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600"
                        >
                            {attachment.fileName}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AttachmentsPage;




// import { useState, useEffect } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { uploadFile, fetchAttachments, downloadFile, deleteFile } from "../API/testAttachmentOutside";
// import { toast } from "react-toastify";

// interface Attachment {
//     id: string;
//     fileName: string;
//     fileType: string;
// }

// const AttachmentManager = () => {
//     const queryClient = useQueryClient();
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [authToken, setAuthToken] = useState<string>("");

//     // Load token from local storage on mount
//     useEffect(() => {
//         const token = localStorage.getItem("authToken");
//         if (token) {
//             setAuthToken(token);
//         } else {
//             toast.error("No authentication token found! Please log in.");
//         }
//     }, []);

//     const { data: attachments, isLoading } = useQuery({
//         queryKey: ["attachments"],
//         queryFn: fetchAttachments,
//     });

//     const uploadMutation = useMutation({
//         mutationFn: uploadFile,
//         onSuccess: () => {
//             toast.success("File uploaded successfully!");
//             queryClient.invalidateQueries({ queryKey: ["attachments"] });
//         },
//         onError: () => toast.error("Failed to upload file"),
//     });

//     const deleteMutation = useMutation({
//         mutationFn: ({ id, fileName }: { id: string; fileName: string }) => deleteFile(id, fileName),
//         onSuccess: () => {
//             toast.success("File deleted successfully!");
//             queryClient.invalidateQueries({ queryKey: ["attachments"] });
//         },
//         onError: () => toast.error("Failed to delete file"),
//     });

//     const handleFileUpload = () => {
//         if (!selectedFile) {
//             toast.error("Please select a file first!");
//             return;
//         }
//         uploadMutation.mutate(selectedFile);
//         setSelectedFile(null);
//     };

//     return (
//         <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
//             <h2 className="text-xl font-bold mb-4">Attachments Manager</h2>
//             <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
//             <button
//                 onClick={handleFileUpload}
//                 className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
//                 disabled={uploadMutation.isPending}
//             >
//                 {uploadMutation.isPending ? "Uploading..." : "Upload"}
//             </button>

//             {isLoading ? <p>Loading...</p> : (
//                 <ul className="mt-4">
//                     {attachments?.map((file: Attachment) => (
//                         <li key={file.id} className="flex justify-between items-center border-b py-2">
//                             <span>{file.fileName}</span>
//                             <div className="flex gap-2">
//                                 <button
//                                     onClick={() => downloadFile(file.id, file.fileName)}
//                                     className="bg-green-500 text-white px-2 py-1 rounded"
//                                 >
//                                     Download
//                                 </button>
//                                 <button
//                                     onClick={() => deleteMutation.mutate({ id: file.id, fileName: file.fileName })}
//                                     className="bg-red-500 text-white px-2 py-1 rounded"
//                                 >
//                                     Delete
//                                 </button>
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default AttachmentManager;

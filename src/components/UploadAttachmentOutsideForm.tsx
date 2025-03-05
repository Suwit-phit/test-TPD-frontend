import React, { useState } from 'react';
// import { uploadAttachment } from '../services/AttachmentService'; // Importing the service function
import { toast } from 'react-toastify'; // For popups
import { useNavigate } from 'react-router-dom'; // To navigate to AttachmentList page
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import { uploadAttachment } from '../API/AttachmentOutsideApi';

interface UploadAttachmentOutsideFormProps {
    token: string;
    // setToken: (token: string | null) => void;  // Add this line to define the prop type
}

const UploadAttachmentOutsideForm: React.FC<UploadAttachmentOutsideFormProps> = ({ token }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate(); // Hook to navigate

    // Allowed file types for attachments (PDF, DOC, DOCX, TXT)
    const allowedFileTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
    ];

    // Handle file selection and validation
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!allowedFileTypes.includes(file.type)) {
                toast.error('Only attachments such as PDF, DOC, DOCX, or TXT are allowed.');
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file); // Set the valid selected file
        }
    };

    // Handle the file upload process
    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('Please select a valid attachment.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            setIsUploading(true);
            // Use the uploadAttachment function from AttachmentService.ts
            console.log("token above await uploadAttachment(token, selectedFile);")
            console.log("token = ", token);
            await uploadAttachment(token, selectedFile);
            // toast.success('Upload successfully');

            // Navigate to AttachmentList page after a short delay
            setTimeout(() => {
                navigate('/attachment-list');
            }, 1500); // Delay to let the toast show before navigating
        } catch (error) {
            toast.error('Failed to upload the attachment');
        } finally {
            setIsUploading(false); // Reset the uploading state
        }
    };

    return (
        <div>
            <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
                className="mb-4"
            />
            {selectedFile && (
                <p className="text-sm text-gray-500">Selected file: {selectedFile.name}</p>
            )}
            <div className="flex justify-end">
                <button
                    className={`btn btn-primary ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleUpload}
                    disabled={isUploading}
                >
                    {isUploading ? 'Uploading...' : 'Confirm Upload'}
                </button>
            </div>
        </div>
    );
};

export default UploadAttachmentOutsideForm;

//! Below no ui for the loading dialogue pop up
import React, { useEffect, useState } from 'react';
// import { getAttachments, downloadAttachment, deleteAttachment } from '../services/AttachmentService';
import { ClipLoader } from 'react-spinners'; // Import ClipLoader spinner
import { deleteAttachment, downloadAttachment, getAttachments } from '../API/AttachmentOutsideApi';
import { Modal } from 'antd';

interface AttachmentOutsideListProps {
    token: string;
    // candidateId: string;
    // setToken: (token: string | null) => void;  // Add this line to define the prop type
}

interface Attachment {
    id: string;
    fileName: string;
    fileType: string;
    createdAt: string | null;
}

const AttachmentOutsideList: React.FC<AttachmentOutsideListProps> = ({ token }) => {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [sortOption, setSortOption] = useState<string>('original');
    const [loading, setLoading] = useState<boolean>(false); // State to manage loading

    //! Show confirm delete
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAttachment, setSelectedAttachment] = useState<{ id: string, fileName: string } | null>(null);
    const showDeleteConfirm = (id: string, fileName: string) => {
        setSelectedAttachment({ id, fileName });
        setIsModalVisible(true);
    };

    const handleOk = () => {
        if (selectedAttachment) {
            deleteAttachment(token, selectedAttachment.id, selectedAttachment.fileName)
                .then(() => {
                    fetchAttachments();
                    setIsModalVisible(false);
                    setSelectedAttachment(null);
                })
                .catch((error) => {
                    console.error('Failed to delete attachment:', error);
                    setIsModalVisible(false);
                });
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedAttachment(null);
    };

    useEffect(() => {
        fetchAttachments();
    }, [sortOption]);

    const fetchAttachments = async () => {
        setLoading(true); // Show loading dialog
        try {
            let data;
            if (sortOption === 'original') {
                console.log("token under fetchAttachments:", token)
                data = await getAttachments(token);
                console.log("data under fetchAttachments:", data);
            } else if (sortOption === 'ascending') {
                console.log("token under sortOption === 'ascending':", token)
                data = await getAttachments(token, 'fileName', true);
            } else if (sortOption === 'descending') {
                console.log("token under sortOption === 'descending':", token)
                data = await getAttachments(token, 'fileName', false);
            }
            setAttachments(data);
        } catch (error) {
            console.error('Failed to fetch attachments:', error);
        } finally {
            setLoading(false); // Hide loading dialog when data is fetched
        }
    };

    const handleDownload = (id: string, fileName: string) => {
        downloadAttachment(token, id, fileName).catch((error) => {
            console.error('Failed to download attachment:', error);
        });
    };

    // const handleDelete = (id: string, fileName: string) => {
    //     deleteAttachment(id, fileName)
    //         .then(() => fetchAttachments())
    //         .catch((error) => {
    //             console.error('Failed to delete attachment:', error);
    //         });
    // };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(event.target.value);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Attachments</h1>

            {/* Sorting Dropdown */}
            <div className="mb-4">
                <label htmlFor="sort" className="block mb-2 text-sm font-medium text-gray-700">Sort by:</label>
                <select
                    id="sort"
                    value={sortOption}
                    onChange={handleSortChange}
                    className="p-2 border border-gray-300 rounded"
                >
                    <option value="original">Original</option>
                    <option value="ascending">Ascending</option>
                    <option value="descending">Descending</option>
                </select>
            </div>

            {/* List of attachments */}
            <ul className="space-y-4">
                {attachments.map((attachment) => (
                    <li key={`${attachment.id}-${attachment.fileName}`} className="flex items-center justify-between bg-gray-100 p-4 rounded">
                        <div>
                            <p className="font-semibold">{attachment.fileName}</p>
                            <p className="text-sm text-gray-600">{attachment.fileType}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                className="p-2 bg-green-500 text-white rounded"
                                onClick={() => handleDownload(attachment.id, attachment.fileName)}
                            >
                                Download
                            </button>
                            <button
                                className="p-2 bg-red-500 text-white rounded"
                                // onClick={() => handleDelete(attachment.id, attachment.fileName)}
                                onClick={() => showDeleteConfirm(attachment.id, attachment.fileName)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Loading Dialog Modal */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <ClipLoader color="#4A90E2" loading={loading} size={50} />
                        <p className="mt-4 text-lg font-semibold">Loading attachments...</p>
                    </div>
                </div>
            )}

            <Modal
                title="Confirm Deletion"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Yes, Delete"
                cancelText="No, Cancel"
                okType="danger"
            >
                {selectedAttachment && (
                    <p>Are you sure you want to delete "{selectedAttachment.fileName}"?</p>
                )}
            </Modal>

            {/* <Modal
                title="Confirm Deletion"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Yes, Delete"
                cancelText="No, Cancel"
                okButtonProps={{ type: 'default' }}
                cancelButtonProps={{ type: 'default' }}
            >
                {selectedAttachment && (
                    <p>Are you sure you want to delete "{selectedAttachment.fileName}"?</p>
                )}
            </Modal>

            <Modal
                title="Confirm Deletion"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Yes, Delete"
                cancelText="No, Cancel"
                okButtonProps={{ style: { backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', color: 'white' } }}
                cancelButtonProps={{ style: { color: '#595959' } }}
            >
                {selectedAttachment && (
                    <p>Are you sure you want to delete "{selectedAttachment.fileName}"?</p>
                )}
            </Modal> */}


        </div>
    );
};

export default AttachmentOutsideList;
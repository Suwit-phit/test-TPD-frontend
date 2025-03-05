import React from 'react';
// import { generateCsv } from '../services/csvService'; // Adjust path if necessary
import toast, { Toaster } from 'react-hot-toast';
import { generateCsv } from '../API/generateCsv';

interface GenerateCsvButtonProps {
    token: string;
    // setToken: (token: string | null) => void;  // Add this line to define the prop type
}

const GenerateCsvButton: React.FC <GenerateCsvButtonProps> = ({ token }) => {
    const handleGenerateCsv = async (type: 'candidates' | 'vacancies') => {
        const success = await generateCsv(type, token);
        if (success) {
            toast.success(`CSV for ${type} generated successfully!`);
        } else {
            toast.error(`Failed to generate CSV for ${type}. Please try again.`);
        }
    };

    return (
        // <div>
        <div className="flex space-x-4 -ml-1">
            <div className="cursor-pointer flex items-center" onClick={() => handleGenerateCsv('candidates')}>
                <img src="../src/assets/GenerateCSV.png" alt="GenerateCSV" className="h-8" />
                <h4 className="ml-1 hover:text-slate-300">Generate Candidates CSV</h4>
            </div>

            <div className="cursor-pointer flex items-center mt-4" onClick={() => handleGenerateCsv('vacancies')}>
                <img src="../src/assets/GenerateCSV.png" alt="GenerateCSV" className="h-8" />
                <h4 className="ml-1 hover:text-slate-300">Generate Vacancies CSV</h4>
            </div>

            <Toaster position="top-right" reverseOrder={false} />
        </div>
        // <div className="flex space-x-4 bg-slate-800">
        //     <div className="cursor-pointer flex items-center" onClick={() => handleGenerateCsv('candidates')}>
        //         <img src="../src/assets/GenerateCSV.png" alt="GenerateCSV" className="h-8" />
        //         <h4 className="ml-2">Generate Candidates CSV</h4>
        //     </div>

        //     <div className="cursor-pointer flex items-center mt-4" onClick={() => handleGenerateCsv('vacancies')}>
        //         <img src="../src/assets/GenerateCSV.png" alt="GenerateCSV" className="h-8" />
        //         <h4 className="ml-2">Generate Vacancies CSV</h4>
        //     </div>

        //     <Toaster position="top-right" reverseOrder={false} />
        // </div>
    );
};

export default GenerateCsvButton;

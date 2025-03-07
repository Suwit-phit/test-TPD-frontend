import React from 'react';
// import { generateCandidateExcel, generateVacancyExcel } from './api';
import toast from 'react-hot-toast';
import { generateCandidateExcel, generateVacancyExcel } from '../API/generateExcel';

const GenerateExcelButton: React.FC = () => {
    const handleGenerateCandidateExcel = async () => {
        try {
            const data = await generateCandidateExcel();
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'candidates.xlsx');
            document.body.appendChild(link);
            link.click();
            toast.success('Candidate Excel generated successfully!');
        } catch (err) {
            toast.error((err as Error).message);
        }
    };

    const handleGenerateVacancyExcel = async () => {
        try {
            const data = await generateVacancyExcel();
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'vacancies.xlsx');
            document.body.appendChild(link);
            link.click();
            toast.success('Vacancy Excel generated successfully!');
        } catch (err) {
            toast.error((err as Error).message);
        }
    };

    return (
        // <div className="flex space-x-4">
        <div className="flex space-x-4 ">
            {/* Button to generate Excel for Candidates */}
            <div className="cursor-pointer flex items-center" onClick={handleGenerateCandidateExcel}>
                <img src="assets/GenerateExcel.png" alt="Generate Excel" className="h-8" />
                <h4 className="ml-2 hover:text-slate-300">Generate Candidate Excel</h4>
            </div>

            {/* Button to generate Excel for Vacancies */}
            <div className="cursor-pointer flex items-center" onClick={handleGenerateVacancyExcel}>
                <img src="assets/GenerateExcel.png" alt="Generate Excel" className="h-8" />
                <h4 className="ml-2 hover:text-slate-300">Generate Vacancy Excel</h4>
            </div>
        </div>
    );
};

export default GenerateExcelButton;

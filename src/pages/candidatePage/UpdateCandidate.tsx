import { useParams, Link } from 'wouter';
import React, { useState, useEffect } from 'react';
// import { fetchEmployeeById, updateEmployee } from '../API/employeesApi';
import { navigate } from 'wouter/use-browser-location';
import { fetchCandidateById, updateCandidate } from '../../API/candidatesApi';
// import { fetchEmployeeById, updateEmployee } from '../../API/candidatesApi';

interface CandidateType {
    id: number;
    candidateName: string;
    position: string;
    skills: string;
}

const UpdateCandidate: React.FC = () => {
    const [candidateData, setCandidateData] = useState<CandidateType>({
        id: 0,
        candidateName: '',
        position: '',
        skills: ''
    });
    const { id } = useParams<{ id: string }>();
    // const [, navigate] = useRoute('/:id');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchCandidateById(parseInt(id, 10));
                setCandidateData(data);
            } catch (error) {
                console.error('p0: number, employee: EmployeeTypeEmployeeTypeEmployeeTypee:', error);
            }
        };
        fetchData();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCandidateData({
            ...candidateData,
            [name]: value
        });
    };

    const handleUpdateCandidate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateCandidate(parseInt(id, 10), candidateData);
            navigate('/');
        } catch (error) {
            console.error('Error updating candidate:', error);
        }
    };

    return (
        <div>
            <h1>Update Candidate</h1>
            <form onSubmit={handleUpdateCandidate}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={candidateData.candidateName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="position">Position:</label>
                    <input
                        type="text"
                        id="position"
                        name="position"
                        value={candidateData.position}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="skills">Skills:</label>
                    <input
                        type="text"
                        id="skills"
                        name="skills"
                        value={candidateData.skills}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">Update Candidate</button>
            </form>
            <Link href="/">Go back</Link>
        </div>
    );
};

export default UpdateCandidate;


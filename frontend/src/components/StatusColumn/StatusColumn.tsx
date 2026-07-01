import React from 'react';
import ApplicationCard from '../ApplicationCard/ApplicationCard'
import {Job} from '../../types/job'
import { Dispatch, SetStateAction } from 'react';
import './StatusColumn.css'
import '../../styles/variables.css'

type StatusColumnProps = {
    title: string;
    status: string;
    jobs: Job[];
    setJobs: Dispatch<SetStateAction<Job[]>>;
    onSelectJob: (id: number) => void;
};

function StatusColumn({ title, status, jobs, setJobs, onSelectJob }: StatusColumnProps) {
    const filteredJobs = jobs.filter(job => job.status === status);
    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        const idStr = e.dataTransfer.getData('text/plain');
        const id = Number(idStr);
        if (!id) return;

        const job = jobs.find(j => j.id === id);
        if (!job) return;
        if (job.status === status) return;

        const previousJobs = [...jobs];
        const updatedJob = { ...job, status };
        // Optimistically update UI
        (setJobs as Dispatch<SetStateAction<Job[]>>)((prev) => prev.map(j => j.id === id ? updatedJob : j));

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: job.title,
                    company: job.company,
                    shortDescription: job.shortDescription,
                    description: job.description,
                    applyingDate: job.applyingDate,
                    interviewDate: job.interviewDate,
                    screeningCompleted: job.screeningCompleted,
                    link: job.link,
                    cvUrl: job.cvUrl,
                    cvOriginalName: job.cvOriginalName,
                    letterUrl: job.letterUrl,
                    letterOriginalName: job.letterOriginalName,
                    confidenceScore: job.confidenceScore,
                    status: updatedJob.status,
                    personnalNotes: job.personnalNotes,
                })
            });

            if (!res.ok) {
                // rollback
                (setJobs as Dispatch<SetStateAction<Job[]>>)(previousJobs as any);
                console.error('Failed to update status on server');
            }
        } catch (err) {
            (setJobs as Dispatch<SetStateAction<Job[]>>)(previousJobs as any);
            console.error(err);
        }
    };

    return (
    <div className={`status-column status-column--${status}`} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        <div className={`status-column__header status-column__header--${status}`}>
            <h2 className="status-column__title">{`${title}`}</h2>
        </div>
                {filteredJobs.map(job => (
                    <ApplicationCard
                        key={job.id} 
                        job={job}

                        onClick={() => onSelectJob(job.id)}
                    /> 
                ))  
                }
        
    </div>
    )
}

export default StatusColumn;
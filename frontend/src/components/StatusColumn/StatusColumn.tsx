import ApplicationCard from '../ApplicationCard/ApplicationCard'
import {Job} from '../../types/job'
import './StatusColumn.css'

type StatusColumnProps = {
    title: string;
    status: string;
    jobs: Job[];
    onSelectJob: (id: number) => void;
};

function StatusColumn({ title, status, jobs, onSelectJob }: StatusColumnProps) {
    const filteredJobs = jobs.filter(job => job.status === status);
    return (
    <div className={`status-column status-column--${status}`}>
        <div className={`status-column__header status-column__header--${status}`}>
            <h2>{`${title}`}</h2>
                {filteredJobs.map(job => (
                    <ApplicationCard
                        key={job.id} 
                        title={job.title}
                        company={job.company}
                        description={job.description}
                        applyingDate={job.applyingDate}
                        interviewDate={job.interviewDate}
                        link={job.link}
                        cvUrl={job.cvUrl}
                        letterUrl={job.letterUrl}
                        confidenceScore={job.confidenceScore}

                        onClick={() => onSelectJob(job.id)}
                    /> 
                ))  
                }
        </div>
    </div>
    )
}

export default StatusColumn;
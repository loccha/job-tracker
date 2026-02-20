import ApplicationCard from '../ApplicationCard/ApplicationCard'
import {Job} from '../../types/job'
import './StatusColumn.css'

type StatusColumnProps = {
    title: string;
    status: string;
    jobs: Job[];
};

function StatusColumn({ title, status, jobs }: StatusColumnProps) {
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
                    /> 
                ))  
                }
        </div>
    </div>
    )
}

export default StatusColumn;
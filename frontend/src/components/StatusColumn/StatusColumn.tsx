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
                        title={job.title}
                        company={job.company}
                        description={job.description}
                        appliedDate={job.applying_date}
                        interviewDate={job.interview_date}
                        link={job.link}
                        cvUrl={job.cv_url}
                        letterUrl={job.letter_url}
                        estimated_score={job.estimated_score}
                    />
                ))  
                }
        </div>
    </div>
    )
}

export default StatusColumn;
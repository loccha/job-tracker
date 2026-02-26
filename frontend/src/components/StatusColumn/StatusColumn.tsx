import ApplicationCard from '../ApplicationCard/ApplicationCard'
import {Job} from '../../types/job'
import './StatusColumn.css'
import '../../styles/variables.css'

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
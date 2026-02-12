import ApplicationCard from '../ApplicationCard/ApplicationCard'
import './StatusColumn.css'

function StatusColumn({ title, status, jobs }) {
    const filteredJobs = jobs.filter(job => job.status === status);
    console.log(filteredJobs)
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
                        link={job.link}
                    />
                ))  
                }
        </div>
    </div>
    )
}

export default StatusColumn;
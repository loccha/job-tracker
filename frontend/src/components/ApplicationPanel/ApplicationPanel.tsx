import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import './ApplicationPanel.css'
import '../../styles/variables.css'
import { Job } from '../../types/job';

type ApplicationPanelProps = {
    job: Job;
}

function ApplicationPanel ({
    job
}:ApplicationPanelProps) {
    return (
        <div className="application-panel">
            <div className="application-panel__header">
                <div className="application-panel__identity">
                    <a href={`${job.link}`}>
                        <FontAwesomeIcon className="application-panel__icon application-panel__icon--link" icon={faLink} />
                    </a>
                    <div className="application-panel__meta">
                        <h2 className="application-panel__title">{job.title}</h2>
                        <p className="application-panel__company">{job.company}</p>
                    </div>
                </div>
                <div className="application-panel__line">
                    <span className="application-panel__badge">
                        <p className="application-panel__status">{job.status}</p>
                        <p className="application-panel__confidence">Confidence <b>{job.confidenceScore}%</b></p>
                    </span>
                </div>
            </div>

            <div className="application-panel__body">
                <div className="application-panel__main-column">
                    <div className="application-panel__card application-panel__card--job-description">
                        <p className="application-panel__title application-panel__title--job-description">Job Description</p> <br />
                        <p className="application-panel__job-description ">{job.description}</p>
                    </div>
                     
                    <div className="application-panel__card application-panel__documents">
                        <p className="application-panel__title application-panel__title--documents">Documents</p>
                    </div> 
                </div>

                <div className="application-panel__card application-panel__side-column">
                    <div className="application-panel__top-section">
                        <div className="application-panel__interview">
                            <p className="application-panel__title application-panel__title--interview">Interview</p>
                        </div>
                        <div className="application-panel__screening" />
                    </div>
                    <div className="application-panel__line" />

                    <div className="application-panel__notes">
                        <p className="application-panel__title application-panel__title--notes">Notes</p>
                        <div className="application-panel__notes-card">

                        </div>
                    </div>
                </div>
                
            </div>
            
            <div className="application-panel__footer">
                <p className="application-panel__date">Applied on {job.applyingDate}</p>
            </div>


        </div>
    );
    
    
}

export default ApplicationPanel;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faFileLines, faIdCard, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { Job } from '../../types/job';

import './ApplicationCard.css'
import '../../styles/variables.css'


/**
 * Props for the ApplicationCard component
 * Represents a single job application with associated metadata
 */
type ApplicationCardProps = {
    job: Job;
    
    onClick: () => void;
};

/**
 * ApplicationCard Component
 * 
 * Displays a job application entry with dynamic styling based on confidence score.
 * Features include:
 * - Color-coded visual feedback based on success likelihood
 * - Quick access links to job posting and uploaded documents
 * - Interview indicator when scheduled
 */
function ApplicationCard({
    job,
    onClick
}: ApplicationCardProps) {    
    let scoreClass = "";

    if(job.confidenceScore>87){                     
        scoreClass= "high-chances-score";               // High confidence (88-100)
    } else if (job.confidenceScore>76) {
        scoreClass= "good-chances-score";               // Good confidence (77-87)
    } else {
        scoreClass= "average-chances-score";            // Average confidence (0-76)
    }

    return (
    <article 
        className={`application-card application-card--${scoreClass}`}
        onClick={onClick}
    >

        {/* Document attachments section - links to external resources */}
        <div className={"application-card__attachments"}>

            {/* Link to uploaded CV/resume */}
            <a href={`${job.cvUrl}`} target="_blank">
                <FontAwesomeIcon className="application-card__icon application-card__icon--cv" icon={faIdCard} />
            </a>
            
            {/* Link to original job posting */}
            <a href={`${job.link}`} target="_blank">
                <FontAwesomeIcon className="application-card__icon application-card__icon--link" icon={faLink} />
            </a>

            {/* Optional link to cover letter (if provided) */}
            {job.letterUrl ? (
                <a href={`${job.letterUrl}`} target="_blank">
                    <FontAwesomeIcon className="application-card__icon application-card__icon--letter" icon={faFileLines} />
                </a>
            ) : null}
        </div>

        {/* Main content section - job details */}
        <div className={"application-card__content"}>
            <h3 className={"application-card__title"}>{job.title}</h3>
            <p className={"application-card__company"}>{job.company}</p>
            <p className={"application-card__description"}>{job.shortDescription}</p>
        </div>

        {/* Footer section - application date and interview indicator */}
        <div className={"application-card__footer"}>
            <p className={"application-card__date"}>Applied on {job.applyingDate}</p>

            {/* Show calendar icon if interview is scheduled */}
            {job.interviewDate && (
                <FontAwesomeIcon className="application-card__icon application-card__icon--calendar" icon={faCalendarDay} />
            )}
        </div>
    </article>
    );
}

export default ApplicationCard;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faPaperclip, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import './ApplicationCard.css'


type ApplicationCardProps = {
    title: string;
    company: string;
    description: string;
    appliedDate: string;
    interviewDate: string;
    link: string;
    cvUrl: string;
    letterUrl?: string;
    estimated_score: number;
};

function ApplicationCard({
    title,
    company,
    description,
    appliedDate,
    interviewDate,
    link,
    cvUrl,
    letterUrl,
    estimated_score
}: ApplicationCardProps) {

    const formattedDate = new Date(appliedDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });

    let scoreClass = "";

    if(estimated_score>85){
        scoreClass= "high-chances-score" 
    } else if (estimated_score>70) {
        scoreClass= "good-chances-score"
    } else {
        scoreClass= "average-chances-score"
    }

    return (
    <article className={`application-card application-card--${scoreClass}`}>
        <div className={"application-card__attachments"}>

            <a href={`${link}`}><FontAwesomeIcon className="application-card__icon application-card__icon--link" icon={faLink} /></a>
            <a href={`${cvUrl}`}><FontAwesomeIcon className="application-card__icon application-card__icon--cv" icon={faPaperclip} /></a>
            {letterUrl ? (
                <a href={`${letterUrl}`}><FontAwesomeIcon className="application-card__icon application-card__icon--letter" icon={faPaperclip} /></a>
            ) : null}
        </div>
        <div className={"application-card__content"}>
            <h3 className={"application-card__title"}>{title}</h3>
            <p className={"application-card__company"}>{company}</p>
            <p className={"application-card__description"}>{description}</p>
        </div>
        <div className={"application-card__footer"}>
            {interviewDate ? (
                <FontAwesomeIcon className="application-card__icon application-card__icon--calendar" icon={faCalendarDay} />
            ) : null}
            <p className={"application-card__date"}>Applied on {formattedDate}</p>
        </div>
        
    </article>
    )
}

export default ApplicationCard;
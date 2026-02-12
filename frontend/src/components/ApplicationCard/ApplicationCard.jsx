import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faPaperclip, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import './ApplicationCard.css'

function ApplicationCard({
    title,
    company,
    description,
    appliedDate,
    link,
    cv_url,
    letter_url
}) {

    const formattedDate = new Date(appliedDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });

    return (
    <article className={"application-card"}>
        <div className={"application-card__attachments"}>
            <a href={`${link}`}><FontAwesomeIcon className="application-card__icon application-card__icon--link" icon={faLink} /></a>
            <a href={`${cv_url}`}><FontAwesomeIcon className="application-card__icon application-card__icon--cv" icon={faPaperclip} /></a>
            <a href={`${letter_url}`}><FontAwesomeIcon className="application-card__icon application-card__icon--letter" icon={faPaperclip} /></a>
        </div>
        <div className={"application-card__content"}>
            <h3 className={"application-card__title"}>{title}</h3>
            <p className={"application-card__company"}>{company}</p>
            <p className={"application-card__description"}>{description}</p>
        </div>
        <div className={"application-card__footer"}>
            <FontAwesomeIcon className="application-card__icon application-card__icon--calendar" icon={faCalendarDay} />
            <p className={"application-card__date"}>Applied on {formattedDate}</p>
        </div>
        
    </article>
    )
}

export default ApplicationCard;
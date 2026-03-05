import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faTrashCan, faPenToSquare, faCheck } from '@fortawesome/free-solid-svg-icons';

import { Job } from '../../types/job';

import Calendar from "../Calendar/Calendar";
import './ApplicationPanelRead.css'

type ApplicationPanelReadProps = {
    job: Job;

    setPopupVisible: () => void;
    setIsEditing: () => void;
}

const ApplicationPanelRead = ({job, setPopupVisible, setIsEditing}: ApplicationPanelReadProps) => {
    console.log(job)
    console.log("titre: ", job.title)
    console.log("lien: ", job.link)


    return (
        <div className="application-panel-read">
            <div className="application-panel__header">
                    <div className="application-panel__identity">
                        <a href={`${job.link}`}>
                            <FontAwesomeIcon className="application-panel__icon application-panel__icon--link" icon={faLink} />
                        </a>
                        <div className="application-panel__meta">
                            <h2 className="application-panel__title">{job.title}</h2>
                            <p className="application-panel__company">{job.company}</p>
                        </div>
                        <div className="application-panel__menu">
                            <FontAwesomeIcon 
                                className="application-panel__icon application-panel__menu application-panel__icon--edit" 
                                icon={faPenToSquare} 
                                onClick = {setIsEditing}
                            />
                            <FontAwesomeIcon 
                                className="application-panel__icon application-panel__menu application-panel__icon--delete" 
                                icon={faTrashCan}
                                onClick = {setPopupVisible} 
                            />
                        </div>
                    </div>
                    <div className="application-panel__line">
                        <span className="application-panel__badge">
                            <p className="application-panel__status application-panel__status--reading">{(job.status).toUpperCase()}</p>
                            <p className="application-panel__confidence">Confidence <b>{job.confidenceScore}%</b></p>
                        </span>
                    </div>
                </div>

                <div className="application-panel__body">
                    <div className="application-panel__main-column">
                        <div className="application-panel__card application-panel__card--job-description">
                            <p className="application-panel__title application-panel__title--job-description">Job Description</p>
                            <p className="application-panel__job-description ">{job.description}</p>
                        </div>
                        
                        <div className="application-panel__card application-panel__documents-section">
                            <p className="application-panel__title application-panel__title--documents">Documents</p>
                            <div className="application-panel__documents">
                                <a 
                                    className="application-panel__document application-panel__document--letter" 
                                    href={job.letterUrl}
                                    target="_blank"
                                >{job.letterOriginalName}
                                </a>
                                <a 
                                    className="application-panel__document application-panel__document--cv" 
                                    href={job.cvUrl}
                                    target="_blank"
                                >{job.cvOriginalName}
                                </a>
                            </div>
                        </div> 
                    </div>

                    <div className="application-panel__card application-panel__side-column">
                        <div className="application-panel__top-section">
                            <div className="application-panel__interview">
                                <p className="application-panel__title application-panel__title--interview">Interview</p>
                                    <Calendar
                                        date={job.interviewDate}
                                    />
                                    {job.screeningCompleted &&
                                        <>
                                            <FontAwesomeIcon className="application-panel__check" icon={faCheck} />
                                            <span className="application-panel__screening"><b>Screening:</b> Completed</span>
                                        </>  
                                    }   
                                
                            </div>
                            <div className="application-panel__screening" />
                        </div>
                        <div className="application-panel__line" />

                        <div className="application-panel__notes">
                            <p className="application-panel__title application-panel__title--notes">Notes</p>
                            <div className="application-panel__notes-card">
                                    <p>{job.personnalNotes}</p>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
                <div className="application-panel__footer">
                    <p className="application-panel__date">Applied on {job.applyingDate}</p>
                </div>
        </div>
    )
}

export default ApplicationPanelRead;
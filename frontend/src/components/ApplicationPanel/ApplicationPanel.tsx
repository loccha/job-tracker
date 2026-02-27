import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faTrashCan, faPenToSquare, faCheck } from '@fortawesome/free-solid-svg-icons';

import { useState } from "react";

import { Job } from '../../types/job';

import Calendar from "../Calendar/Calendar";
import Popup from "../Popup/Popup";

import './ApplicationPanel.css'
import '../../styles/variables.css'


type ApplicationPanelProps = {
    job: Job;
    setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
    onClose: () => void;
}

function ApplicationPanel ({ job, setJobs, onClose }:ApplicationPanelProps) {

    const[popupVisible, setPopupVisible] = useState(false);

    const onHandleDelete = async ({}) => { 
        try {
            const response = await fetch(`http://localhost:3000/api/delete/${job.id}`, {
                method: 'DELETE',
                body: 'none',
            });
        //update jobs
        setJobs(prev => prev.filter(j => j.id !== job.id));

        } catch (err) {
            console.log("Couldn't delete the application properly")
        };

        onClose();
    }

    return (
        <div className="application-panel">
            {popupVisible &&
                <Popup 
                    onClose={() => setPopupVisible(false)}
                    onHandleDelete={onHandleDelete}
                /> 
            }
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
                        <FontAwesomeIcon className="application-panel__icon application-panel__menu application-panel__icon--pen-to-square" icon={faPenToSquare} />
                        <FontAwesomeIcon 
                            className="application-panel__icon application-panel__menu application-panel__icon--trash-can" 
                            icon={faTrashCan}
                            onClick = {()=>setPopupVisible(true)} 
                        />
                    </div>
                </div>
                <div className="application-panel__line">
                    <span className="application-panel__badge">
                        <p className="application-panel__status">{(job.status).toUpperCase()}</p>
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
                                {job.personnalNotes}
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
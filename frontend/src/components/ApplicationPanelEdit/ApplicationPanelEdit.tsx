import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';

import { useState } from "react";

import { Job } from '../../types/job';

import Calendar from "../Calendar/Calendar";
import './ApplicationPanelEdit.css'

type ApplicationPanelEditProps = {
    job: Job;
    setPopupVisible: () => void;
    setIsEditing: () => void;
}

const ApplicationPanelEdit = ({job, setPopupVisible, setIsEditing}: ApplicationPanelEditProps) => {
    const[status, setStatus] = useState(job.status);
    const[confidenceScore, setConfidenceScore] = useState(String(job.confidenceScore));
    const[personnalNotes, setPersonnalNotes] = useState(job.personnalNotes);
    const[description, setDescription] = useState(job.description);
    const[screeningCompleted, setScreeningCompleted] = useState(job.screeningCompleted);
    const[interviewDate, setInterviewDate] = useState("");
    const[applyingDate, setApplyingDate] = useState("");


    function handleSaveChange() {
        
    }

    return (
        <div className="application-panel-edit">
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
                                className="application-panel__icon application-panel__menu application-panel__icon--xmark" 
                                icon={faXmark}
                                onClick={setIsEditing} 
                            />
                            <FontAwesomeIcon 
                                className="application-panel__icon application-panel__menu application-panel__icon--trash-can" 
                                icon={faTrashCan}
                                onClick = {setPopupVisible} 
                            />
                        </div>
                    </div>
                    <div className="application-panel__line">
                        <span className="application-panel__badge">
                            <select
                                id="status-edit"
                                name="status-edit" 
                                className="application-panel__status application-panel__status--edit"
                                value= {status}
                                onChange = {(e) => setStatus(e.target.value)}
                            >   
                    
                                <option value="applied">APPLIED</option>
                                <option value="interview">INTERVIEW</option>
                                <option value="offer">OFFER</option>
                                <option value="declined">DECLINED</option>
                            </select>
                            
                            <p className="application-panel__confidence">Confidence 
                                <input type="number"
                                    className="application-form__input application-form__input--score application-form__score--edit"
                                    id="score-edit" 
                                    value={confidenceScore}
                                    onChange={(e) => setConfidenceScore(e.target.value)}
                                />
                                <b>%</b>
                            </p>
                        </span>
                    </div>
                </div>

                <div className="application-panel__body">
                    <div className="application-panel__main-column">
                        <div className="application-panel__card application-panel__card--job-description">
                            <p className="application-panel__title application-panel__title--job-description">Job Description</p>
                            <textarea 
                                name="description-edit" 
                                id="description-edit"
                                className="application-form__input application-panel__job-description application-panel__job-description--edit"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                spellCheck="false"

                            />
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
                                <p className="application-panel__title application-panel__title--interview">Interview: 
                                    <span>
                                        <input 
                                            type="date"
                                            className="application-form__input application-form__input-date application-form__input-date--edit"
                                            id="interviewDate" 
                                            value={interviewDate}
                                            onChange={(e) => setInterviewDate(e.target.value)}
                                        />
                                    </span>
                                </p>
                                    <Calendar
                                        date={job.interviewDate}
                                    />
                                        
                                        <label className="application-form__checkbox">
                                            <input 
                                                type="checkbox" 
                                                checked={screeningCompleted}
                                                onChange={(e) => setScreeningCompleted(e.target.checked)}
                                            />Screening Completed
                                        </label>
                                        
                                       
                                
                            </div>
                            <div className="application-panel__screening" />
                        </div>
                        <div className="application-panel__line" />

                        <div className="application-panel__notes">
                            <p className="application-panel__title application-panel__title--notes">Notes</p>
                            <textarea
                                name="personnal-notes-edit"
                                id="personnal-notes-edit"
                                className="application-panel__notes-card application-panel__notes-card--edit" 
                                value={personnalNotes}
                                onChange={(e) => setPersonnalNotes(e.target.value)}
                                spellCheck="false"
                            />     
                        </div>
                    </div>
                    
                </div>
                
                <div className="application-panel__footer">
                    <p className="application-panel__date">
                        Applied on:
                        <span>
                            <input type="date"
                                    className="application-form__input application-form__input-date application-form__input-date--edit"
                                    id="applyingDate" 
                                    value={applyingDate}
                                    onChange={(e) => setApplyingDate(e.target.value)}
                                />
                        </span>
                    </p>
                    <button 
                        className="button-primary"
                        onClick={handleSaveChange}
                    > Save
                    </button>
                </div>
        </div>
    )
}

export default ApplicationPanelEdit;
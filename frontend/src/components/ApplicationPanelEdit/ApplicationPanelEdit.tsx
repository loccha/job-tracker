import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';

import { useState } from "react";
import axios from "axios";

import { Job } from '../../types/job';

import Calendar from "../Calendar/Calendar";
import Dropbox from "../Dropbox/Dropbox";

import './ApplicationPanelEdit.css'
import { mapJobFromApi } from '../../mappers/jobMapper';

type ApplicationPanelEditProps = {
    job: Job;
    setJobs: React.Dispatch<React.SetStateAction<Job[]>>;

    setPopupVisible: () => void;
    setIsEditing: () => void;
    onSave: () => void;
}

export type EditJobEntry = Omit<Job, "createdAt">;

const ApplicationPanelEdit = ({job, setJobs, setPopupVisible, setIsEditing, onSave}: ApplicationPanelEditProps) => {
    /*const[id, setId] = useState(job.id)*/
    const id = job.id
    const[title, setTitle] = useState(job.title);
    const[company, setCompany] = useState(job.company);
    const[link, setLink] = useState(job.link);

    const[status, setStatus] = useState(job.status);
    const[confidenceScore, setConfidenceScore] = useState(String(job.confidenceScore));
    const[personnalNotes, setPersonnalNotes] = useState(job.personnalNotes);
    const[shortDescription, setShortDescription] = useState(job.shortDescription);
    const[description, setDescription] = useState(job.description);
    const[screeningCompleted, setScreeningCompleted] = useState(job.screeningCompleted);
    const[interviewDate, setInterviewDate] = useState(job.interviewDate);
    const[applyingDate, setApplyingDate] = useState(job.applyingDate);

    const[cvFile, setCvFile] = useState<File | null>(null);
    const[cvUrl, setCvUrl] = useState<string | undefined>(job.cvUrl);          // Server URL after CV upload
    const[cvOriginalName, setCvOriginalName] = useState(job.cvOriginalName);

    const[letterFile, setLetterFile] = useState<File | null>(null);
    const[letterUrl, setLetterUrl] = useState<string | undefined>(job.letterUrl);   // Server URL after cover letter upload
    const[letterOriginalName, letterCvOriginalName] = useState(job.letterOriginalName);




    const upsertFile = async (fileToUpsert: File, oldUrl: string | undefined) => {
        const formData = new FormData();
        
        formData.append('file', fileToUpsert);
        formData.append('old_url', oldUrl == null ? "": oldUrl); 

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upsert-file`,{
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            // Construct full URL for uploaded file
            return (`${import.meta.env.VITE_API_URL}/uploads/` + data.filename);

        } catch (err) {
            console.log("Couldn't upload the file properly")
        };
    };


    function handleSaveChange() {

        const parsedScore: number = Number(confidenceScore)
        const modifiedJobEntry = {
            id,
            title,
            company,
            shortDescription,
            description,
            applyingDate,
            interviewDate,
            screeningCompleted,
            link,
            cvUrl,
            cvOriginalName,
            letterUrl,
            letterOriginalName,
            confidenceScore: parsedScore,
            status,
            personnalNotes
        };


        const modifyJob = async (modifiedJobEntry: EditJobEntry) => {  
            try {

                let finalCvUrl = cvUrl;
                let finalLetterUrl = letterUrl;

                if(cvFile != null){
                    finalCvUrl = await upsertFile(cvFile, cvUrl) ?? "";
                    setCvUrl(finalCvUrl);
                }
                
                if (letterFile != null) {
                    finalLetterUrl = await upsertFile(letterFile, letterUrl) ?? undefined;
                    setLetterUrl(finalLetterUrl);
                }
                
                const jobToModify = {
                    ...modifiedJobEntry,
                    cvUrl: finalCvUrl,
                    letterUrl: finalLetterUrl,
                    cvOriginalName: cvFile ? cvFile.name : job.cvOriginalName,
                    letterOriginalName: letterFile ? letterFile.name : job.letterOriginalName
                };

                const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/jobs/${job.id}`, jobToModify);
                setJobs(prev => prev.map(job => job.id === jobToModify.id ? mapJobFromApi(res.data) : job));
                
            } catch (err) {
                console.error(err);
            }
        };

        modifyJob(modifiedJobEntry);
        onSave();
        
    };

    return (
        <div className="application-panel-edit">
            <div className="application-panel__header">
                    <div className="application-panel__identity application-panel__identity--edit">
                        <div className="application-panel__meta">
                            <input 
                                type="text"
                                className="input editable application-panel__title application-panel__title--edit"
                                id="title"
                                placeholder="Job Title" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)} 
                            /> <br />
                            <input 
                                type="text" 
                                className="input editable application-panel__company application-panel__company--edit"
                                id="company" 
                                value={company}
                                placeholder="Company"
                                onChange={(e) => setCompany(e.target.value)}
                            />
                            <FontAwesomeIcon 
                                className="application-panel__icon application-panel__icon--link application-panel__icon--link-edit" 
                                icon={faLink}
                            />
                            <input 
                                type="text"
                                className="input editable application-panel__link application-panel__link--edit"
                                id="link" 
                                value={link}
                                onChange={(e) => setLink(e.target.value)} 
                            /> <br />
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
                                className="editable application-panel__status application-panel__status--edit"
                                value= {status}
                                onChange = {(e) => setStatus(e.target.value)}
                            >   
                    
                                <option value="applied">APPLIED</option>
                                <option value="interview">INTERVIEW</option>
                                <option value="offer">OFFER</option>
                                <option value="declined">DECLINED</option>
                            </select>
                            
                            <p className="application-panel__confidence">Confidence 
                                <input 
                                    type="number"
                                    className="input editable application-panel__score--edit"
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
                            <input type="text"
                                className="input editable application-panel__short-description--edit"
                                id="short-description"
                                value={shortDescription}
                                onChange={(e) => setShortDescription(e.target.value)}
                            />
                            <p className="application-panel__title application-panel__title--job-description">Job Description</p>
                            <textarea 
                                name="description-edit" 
                                id="description-edit"
                                className="input editable application-panel__job-description application-panel__job-description--edit"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                spellCheck="false"

                            />
                        </div>
                        
                        <div className="application-panel__card application-panel__documents-section">
                            <p className="application-panel__title application-panel__title--documents">Documents</p>
                            <div className="application-panel__documents application-panel__documents--edit">
                                
                                <Dropbox
                                    onDrop={(file)=>setLetterFile(file)}
                                    label={"Cover Letter"}
                                    fileName={job.letterOriginalName}
                                />

                                <Dropbox
                                    onDrop={(file)=>setCvFile(file)}
                                    label={"Resume"}
                                    fileName={job.cvOriginalName}
                                />

                            </div>
                        </div> 
                    </div>

                    <div className="application-panel__card application-panel__side-column">
                        <div className="application-panel__top-section">
                            <div className="application-panel__interview">
                                <p className="application-panel__title application-panel__title--interview">Interview 
                                    <span>
                                        <input 
                                            type="date"
                                            className="input editable application-panel__input-date--edit"
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
                                                className="editable checkbox" 
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
                                className="input editable application-panel__notes-card application-panel__notes-card--edit" 
                                value={personnalNotes}
                                onChange={(e) => setPersonnalNotes(e.target.value)}
                                spellCheck="false"
                            />     
                        </div>
                    </div>
                    
                </div>
                
                <div className="application-panel__footer">
                    <p className="application-panel__date">
                        Applied on
                        <span>
                            <input type="date"
                                    className="input editable application-panel__input-date--edit"
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
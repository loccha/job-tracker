import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePen } from '@fortawesome/free-solid-svg-icons';

import { useRef, useReducer } from "react";
import axios from "axios";

import { Job } from '../../types/Job'
import { DraftJob } from '../../types/DraftJob'

import { mapJobFromApi } from '../../mappers/jobMapper'

import useClickOutside from '../../hooks/useClickOutside'

import Dropbox from "../Dropbox/Dropbox";

import './ApplicationForm.css'
import '../../styles/variables.css'


/**
 * Props for the ApplicationForm component
 */
type ApplicationFormProps = {
    setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
    onClose: () => void;
};

type FormAction =
    | {type: "SET_FIELD"; field: keyof DraftJob; value: DraftJob[keyof DraftJob]}
    | {type: "RESET"};

/**
 * Form data structure for new job entries
 * Omits auto-generated fields (id, createdAt) present in the full Job type
 */
export type FormJobEntry = Omit<Job, "id" | "createdAt">;


/**
 * ApplicationForm Component
 * 
 * Form for tracking job applications with the following features:
 * - Job details input (title, company, description, dates, link)
 * - Drag-and-drop file upload for CV and cover letter
 * - Interview scheduling and screening status tracking
 * - Self-assessed confidence score for job fit
 * - Click-outside detection to close the form
 * - Automatic file upload to server with URL generation
 */
const ApplicationForm = ({ setJobs, onClose }: ApplicationFormProps) => {
    // Form state management - individual fields for controlled inputs  
    
    const initialState = {
        title: "",
        company: "",
        shortDescription: "",
        description: "",
        applyingDate: new Date().toLocaleDateString("en-CA"),
        interviewDate: "",
        screeningCompleted: false,
        link: "",
        cvUrl: "",
        cvOriginalName: "",
        cvFile: null,
        letterUrl: "",
        letterOriginalName: "",
        letterFile: null,
        confidenceScore: "",
        status: "applied",
        personnalNotes: ""
    };

    function formReducer(state: DraftJob, action: FormAction): DraftJob{
        switch(action.type){
            case "SET_FIELD":
                return {
                    ...state,
                    [action.field]:action.value
                };

            case "RESET":
                return initialState;

            default:
                return state;
        }
    }

    const[form, dispatch] = useReducer(formReducer, initialState);
    
    // Ref for click-outside detection
    const formRef = useRef<HTMLDivElement>(null);

    useClickOutside({
        ref: formRef,
        onOutsideClick: onClose
    });


    /**
     * Handle form submission
     * Validates data, sends POST request to API, and updates parent state
     */
    function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault(); 

        // Parse confidence score to number for database storage
        const parsedScore: number = Number(form.confidenceScore)
        const newJobEntry = {
            title: form.title,
            company: form.company,
            shortDescription: form.shortDescription,
            description: form.description,
            applyingDate: form.applyingDate,
            interviewDate: form.interviewDate,
            screeningCompleted: form.screeningCompleted,
            link: form.link,
            cvUrl: form.cvUrl,
            cvOriginalName: form.cvOriginalName,
            letterUrl: form.letterUrl,
            letterOriginalName: form.letterOriginalName,
            confidenceScore: parsedScore,
            status: form.status,
            personnalNotes: form.personnalNotes
        };


        /**
         * Async function to persist new job entry to database
         * Maps API response to client-side Job type and updates state
         */
        const addJob = async (newJobEntry: FormJobEntry) => {    
            try {

                let finalCvUrl: string | undefined= form.cvUrl;
                let finalLetterUrl: string | undefined = form.letterUrl;

                if(form.cvFile != null){
                    finalCvUrl = await uploadFile(form.cvFile) ?? "";
                    dispatch({ type: "SET_FIELD", field: "cvUrl", value: finalCvUrl });
                }

                if (form.letterFile != null) {
                    finalLetterUrl = await uploadFile(form.letterFile) ?? "";
                    dispatch({ type: "SET_FIELD", field: "letterUrl", value: finalLetterUrl });
                }
                
                const jobToSend = {
                    ...newJobEntry,
                    cvUrl: finalCvUrl,
                    letterUrl: finalLetterUrl,
                    cvOriginalName: form.cvFile?.name,
                    letterOriginalName: form.letterFile?.name
                };

                const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/jobs`, jobToSend);
                setJobs(prev => [...prev, mapJobFromApi(res.data)]);
            } catch (err) {
                console.error(err);
            }
        };

        addJob(newJobEntry);
        onClose();
    };  

    /**
     * Upload file to server and retrieve accessible URL
     * Uses FormData for multipart/form-data encoding
     * 
     * @param fileToUpload - File object from drag-and-drop or input
     * @returns Full URL of the uploaded file, or undefined on failure
     */
    const uploadFile = async (fileToUpload: File) => {
        const formData = new FormData();
        formData.append('file', fileToUpload);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upsert-file`, {
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

    const score = Number(form.confidenceScore) || 0;
    const getScoreColor = (score: number) => {
        if (score >= 85) return { fill: 'var(--color-offer-column)', trail: 'var(--color-offer-column-faded)' };
        if (score >= 60) return { fill: 'var(--color-interview-column)', trail: 'var(--color-interview-column-faded)' };

        return { fill: 'var(--color-declined-column)', trail: 'var(--color-declined-column-faded)' };
    };

    const { fill, trail } = getScoreColor(score);
    
    return (
        <div 
            ref={formRef} className="application-form">
            <form className="application-form__form" onSubmit={handleSubmit}>

                {/* Header section - form title and status selector */}
                <div className="application-form__header">
                    <h2 className="application-form__title"> 
                        <FontAwesomeIcon className="application-form__upload-icon application-form__upload-icon--file-pen" icon={faFilePen} /> 
                        Add New Job
                    </h2>

                    {/* Status dropdown - tracks application progress */}
                    <select name="status" 
                            id="status"
                            value={form.status}
                            onChange={(e) => dispatch({ type: "SET_FIELD", field: "status", value: e.target.value})}
                            className="application-form__status"
                    >
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="declined">Declined</option>
                    </select>
                </div>

                {/* Primary section - essential job information and confidence score */}
                <div className="application-form__primary-section">
                    <div className="application-form__job-details">

                        {/* Job title input */}
                        <div className="application-form__item">
                            <input
                                className="input application-form__input--title" 
                                type="text"
                                maxLength={100}
                                id="title"
                                placeholder="Job Title" 
                                value={form.title}
                                onChange={(e) => dispatch({ type: "SET_FIELD", field: "title", value: e.target.value })}
                                required 
                            /> 
                        </div>
                        
                        {/* Company name input */}
                        <div className="application-form__item">
                            <input  
                                className="input application-form__input--company"
                                type="text"
                                maxLength={100}
                                id="company" 
                                value={form.company}
                                placeholder="Company"
                                onChange={(e) => dispatch({ type: "SET_FIELD", field: "company", value: e.target.value })}
                                required
                            /> 
                        </div>

                        {/* Job link and application date row */}
                        <div className="application-form__link-date-row">
                            <div className="application-form__item application-form__item--link">
                                <label htmlFor="link">Job Link</label> 
                                <input type="text"
                                    id="link" 
                                    value={form.link}
                                    onChange={(e) => dispatch({ type: "SET_FIELD", field: "link", value: e.target.value })} 
                                    className="input"
                                    required
                                /> 
                            </div>
                            
                            {/* Date application was submitted */}
                            <div className="application-form__item application-form__item--application-date">
                                <label htmlFor="applying_date">Application Date</label>
                                <input type="date"
                                    className="input application-form__input-date"
                                    id="applyingDate" 
                                    value={form.applyingDate}
                                    onChange={(e) => dispatch({ type: "SET_FIELD", field: "applyingDate", value: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Score section - self-assessed job fit percentage */}
                    <div className="application-form__score-section">
                        <div className="application-form__item application-form__item--score">
                            <label className="application-form__label-confidence-score" htmlFor="confidence_score">Confidence Score: </label> 
                            <input type="number"
                                className="input application-form__input--score"
                                id="score" 
                                value={form.confidenceScore}
                                onChange={(e) => {
                                    const score = Math.min(100, Math.max(0, Number(e.target.value)));
                                    dispatch({ type: "SET_FIELD", field: "confidenceScore", value: score.toString() })
                                }}
                            />
                        </div>
                        
                        {/* Visual display of confidence score */}
                        <div 
                            className="application-form__confidence-score"
                                style={{ "--score": score, "--fill": fill, "--trail": trail } as React.CSSProperties}
                        >
                            <span className="application-form__score-text">{ score }%</span>
                        </div>
                    </div>
                </div>

                {/* Secondary section - descriptions, documents, and interview tracking */}
                <div className="application-form__secondary-section">
                    <div className="application-form__item">
                        <input 
                            type="text"
                            className="input application-form__input--short-description"
                            id="short-description"
                            placeholder="Short Description"
                            value={form.shortDescription}
                            onChange={(e) => dispatch({ type: "SET_FIELD", field: "shortDescription", value: e.target.value })}
                        />
                    </div>

                    {/* Detailed description textarea */}
                    <div className="application-form__item application-form__item--description">
                        <label htmlFor="description">Detailed Description</label>
                        <textarea
                            className="input application-form__input--description"
                            id="description"
                            value={form.description}
                            onChange={(e) => dispatch({ type: "SET_FIELD", field: "description", value: e.target.value })} 
                        />
                    </div>

                    {/* Documents and interview section */}
                    <div className="application-form__documents-interview">
                        <div className="application-form__documents">
                            <div className="application-form__item application-form__item--documents">
                                <label htmlFor="documents">Documents (.pdf)</label>
                                <div className="application-form__dropboxes">
                                    {/* Resume dropzone */}
                                    <Dropbox
                                        onDrop={(file) => dispatch({ type: "SET_FIELD", field: "cvFile", value: file })}
                                        label={"Resume"}
                                        fileName={undefined}
                                    />
                                    {/* Cover letter dropzone */}
                                    <Dropbox
                                        onDrop={(file) => dispatch({ type: "SET_FIELD", field: "letterFile", value: file })}
                                        label={"Cover Letter"}
                                        fileName={undefined}
                                    />
                                </div>
                            </div>  
                        </div>

                        {/* Interview date section */}
                        <div className="application-form__interview-section">
                            <div className="application-form__item">
                                <label htmlFor="interview_date">Interview</label>
                                <input
                                    className="input application-form__input-date" 
                                    type="date"
                                    id="interviewDate" 
                                    value={form.interviewDate}
                                    onChange={(e) => dispatch({ type: "SET_FIELD", field: "interviewDate", value: e.target.value })}
                                />
                            </div>
                            
                            {/* Screening completion checkbox */}
                            <div className="application-form__item">
                                <label className="application-form__checkbox">
                                    <input
                                        type="checkbox" 
                                        checked={form.screeningCompleted}
                                        onChange={(e) => dispatch({ type: "SET_FIELD", field: "screeningCompleted", value: e.target.checked })}
                                    />Screening Completed
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer - form submission */}
                <div className="application-form__footer">
                    <button className="button-primary application-form__button application-form__button--save-job" type="submit">Save Job</button>
                    <button 
                        className="button-subtle application-form__button application-form__button--cancel"
                        type="button"
                        onClick={onClose}
                    >
                            Cancel
                    </button>
                </div>
                                      
            </form>
        </div>
    );
};

export default ApplicationForm;


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faFilePen } from '@fortawesome/free-solid-svg-icons';

import { useRef, useState } from "react";
import axios from "axios";

import { Job } from '../../types/job'
import { mapJobFromApi } from '../../mappers/jobMapper'

import useClickOutside from '../../hooks/useClickOutside'

import './ApplicationForm.css'
import '../../styles/variables.css'


/**
 * Props for the ApplicationForm component
 */
type ApplicationFormProps = {
    setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
    onClose: () => void;
};

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
    const[title, setTitle] = useState("");
    const[company, setCompany] = useState("");
    const[description, setDescription] = useState("");
    const[applyingDate, setApplyingDate] = useState("");
    const[interviewDate, setInterviewDate] = useState("");
    const[link, setLink] = useState("");
    const[cvUrl, setCvUrl] = useState("");                      // Server URL after CV upload
    const[letterUrl, setLetterUrl] = useState("");              // Server URL after cover letter upload
    const[confidenceScore, setConfidenceScore] = useState("");
    const[status, setStatus] = useState("Applied");             // Application status (Applied, Interview, Declined)

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
        const parsedScore: number = Number(confidenceScore)
        const newJobEntry = {
            title,
            company,
            description,
            applyingDate,
            interviewDate,
            link,
            cvUrl,
            letterUrl,
            confidenceScore: parsedScore,
            status
        };


        /**
         * Async function to persist new job entry to database
         * Maps API response to client-side Job type and updates state
         */
        const addJob = async (newJobEntry: FormJobEntry) => {      
            try {
                const res = await axios.post("http://localhost:3000/api/jobs", newJobEntry);
                setJobs(prev => [...prev, mapJobFromApi(res.data)]);
            } catch (err) {
                console.error(err);
            }
        };

        addJob(newJobEntry);
        onClose();
    };


    /**
     * Handle file drop events for drag-and-drop upload
     * Extracts file from event and triggers upload process
     * 
     * @param event - Drag event containing dropped file
     * @param setUrl - State setter to update with uploaded file URL
     */
    const handleDrop = (event: React.DragEvent<HTMLDivElement>, setUrl: React.Dispatch<React.SetStateAction<string>>) => {
        event.preventDefault();
        if (event.dataTransfer) {
            const droppedFile = event.dataTransfer.files[0];
            uploadFile(droppedFile, setUrl)
        };
    };


    /**
     * Prevent default drag-over behavior to enable drop functionality
     */
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };
    

    /**
     * Upload file to server and retrieve accessible URL
     * Uses FormData for multipart/form-data encoding
     * 
     * @param fileToUpload - File object from drag-and-drop or input
     * @param setUrl - State setter to store the returned file URL
     */
    const uploadFile = async (fileToUpload: File, setUrl: React.Dispatch<React.SetStateAction<string>>) => {
        const formData = new FormData();
        formData.append('file', fileToUpload);

        try {
            const response = await fetch('http://localhost:3000/api/upload-file', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            // Construct full URL for uploaded file
            setUrl("http://localhost:3000/uploads/" + data.filename)

        } catch (err) {
            console.log("couldn't upload the file properly")
        };
    };

    return (
        <div ref={formRef} className="application-form">
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
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="application-form__status"
                    >
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Declined">Declined</option>
                    </select>
                </div>

                {/* Primary section - essential job information and confidence score */}
                <div className="application-form__primary-section">
                    <div className="application-form__job-details">

                        {/* Job title input */}
                        <div className="application-form__item">
                            <input type="text"
                                className="application-form__input application-form__input--title"
                                id="title"
                                placeholder="Job Title" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)} 
                            /> 
                        </div>
                        
                        {/* Company name input */}
                        <div className="application-form__item">
                            <input type="text" 
                                className="application-form__input application-form__input--company"
                                id="company" 
                                value={company}
                                placeholder="Company"
                                onChange={(e) => setCompany(e.target.value)}
                            /> 
                        </div>

                        {/* Job link and application date row */}
                        <div className="application-form__link-date-row">
                            <div className="application-form__item application-form__item--link">
                                <label htmlFor="link">Job Link</label> 
                                <input type="text"
                                    id="link" 
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)} 
                                    className="application-form__input"
                                /> 
                            </div>
                            
                            {/* Date application was submitted */}
                            <div className="application-form__item application-form__item--application-date">
                                <label htmlFor="applying_date">Application Date</label>
                                <input type="date"
                                    id="applyingDate" 
                                    value={applyingDate}
                                    onChange={(e) => setApplyingDate(e.target.value)}
                                    className="application-form__input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Score section - self-assessed job fit percentage */}
                    <div className="application-form__score-section">
                        <div className="application-form__item application-form__item--score">
                            <label className="application-form__label-confidence-score" htmlFor="confidence_score">Confidence Score: </label> 
                            <input type="number"
                                className="application-form__input application-form__input--score"
                                id="score" 
                                value={confidenceScore}
                                onChange={(e) => setConfidenceScore(e.target.value)}
                            />
                        </div>
                        
                        {/* Visual display of confidence score */}
                        <div className="application-form__confidence-score">
                            <span className="application-form__score-text">75%</span>
                        </div>
                    </div>
                </div>

                {/* Secondary section - descriptions, documents, and interview tracking */}
                <div className="application-form__secondary-section">
                    <div className="application-form__item">
                        <input type="text"
                            className="application-form__input application-form__input--short-description"
                            id="short-description"
                            placeholder="Short Description"
                        />
                    </div>

                    {/* Detailed description textarea */}
                    <div className="application-form__item application-form__item--description">
                        <label htmlFor="description">Detailed Description</label>
                        <textarea
                            className="application-form__input application-form__input--description"
                            id="description" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Documents and interview section */}
                    <div className="application-form__documents-interview">
                        <div className="application-form__documents">
                            <div className="application-form__item application-form__item--documents">
                                <label htmlFor="documents">Documents</label>
                                <div className="application-form__dropboxes">

                                    {/* CV/Resume dropzone */}
                                    <div
                                        className={`application-form__dropbox ${cvUrl ? "application-form__dropbox--filled" : ""}`}
                                        onDrop={(event) => handleDrop(event, setCvUrl)} 
                                        onDragOver={handleDragOver}
                                    >
                                       
                                        <FontAwesomeIcon className="application-form__upload-icon application-form__upload-icon--arrow-up" icon={faArrowUpFromBracket} />
                                        <p>Resume</p>
                                        
                                    </div>

                                    {/* Cover letter dropzone */}
                                    <div 
                                        className={`application-form__dropbox ${letterUrl ? "application-form__dropbox--filled" : ""}`}
                                        onDrop={(event) => handleDrop(event, setLetterUrl)} 
                                        onDragOver={handleDragOver}
                                    >
                                        <FontAwesomeIcon className="application-form__upload-icon application-form__upload-icon--arrow-up" icon={faArrowUpFromBracket} />
                                        <p>Cover Letter</p>
                                    </div>

                                </div>
                            </div>  
                        </div>

                        {/* Interview date section */}
                        <div className="application-form__interview-section">
                            <div className="application-form__item">
                                <label htmlFor="interview_date">Interview</label>
                                <input type="date"
                                    id="interviewDate" 
                                    value={interviewDate}
                                    onChange={(e) => setInterviewDate(e.target.value)}
                                    className="application-form__input"
                                />
                            </div>
                            
                            {/* Screening completion checkbox */}
                            <div className="application-form__item">
                                <label className="application-form__checkbox">
                                    <input type="checkbox" />Screening Completed
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer - form submission */}
                <div className="application-form__footer">
                    <button className="application-form__button" type="submit">Save Job</button>
                    <button className="application-form__button">Cancel</button>
                </div>
                                      
            </form>
        </div>
    );
};

export default ApplicationForm;


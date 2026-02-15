import { SyntheticEvent, useState } from "react";
import axios from "axios";
import './ApplicationForm.css'

type ApplicationFormProps = {
    onClose: () => void;
};

const ApplicationForm = ({ onClose }: ApplicationFormProps) => {
    
    const[title, setTitle] = useState("");
    const[company, setCompany] = useState("");
    const[description, setDescription] = useState("");
    const[applyingDate, setApplyingDate] = useState("");
    const[interviewDate, setInterviewDate] = useState("");
    const[link, setLink] = useState("");
    const[cvUrl, setCvUrl] = useState("");
    const[letterUrl, setLetterUrl] = useState("");
    const[score, setScore] = useState("0");
    const[status, setStatus] = useState("Applied")


    function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault(); 
        
        const newPost = {
            title,
            company,
            description,
            applyingDate,
            interviewDate,
            link,
            cvUrl,
            letterUrl,
            score,
            status
        };

        axios.post("http://localhost:3000/api/jobs", newPost)
            .then((response)=>{
                console.log("PostCreatedSuccessfully");
            })
            .catch((err)=> {
                console.log("ErrorCreatingPost");
            });
    };

   

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, setUrl: React.Dispatch<React.SetStateAction<string>>) => {
        event.preventDefault();
        if (event.dataTransfer) {
            const droppedFile = event.dataTransfer.files[0];
            uploadFile(droppedFile, setUrl)
        }
    }

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }
    

    const uploadFile = async (fileToUpload: File, setUrl: React.Dispatch<React.SetStateAction<string>>) => {
        const formData = new FormData();
        formData.append('file', fileToUpload);

        try {
            const response = await fetch('http://localhost:3000/api/upload-file', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setUrl("http://localhost:3000/uploads/" + data.filename)
            console.log("http://localhost:3000/uploads/" + data.filename)

        } catch (err) {
            console.log("couldn't upload file properly")
        }
    }
    
    return (
        <div className="application-form">
            <form className="application-form__form" onSubmit={handleSubmit}>
                <h2 className="application-form__title">Add Position</h2>

                <div className="application-form__content">
                    <div className="application-form__item">
                        <label htmlFor="title">Title: </label> 
                        <input type="text" 
                            id="title" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} 
                            className="application-form__input"
                        /> 
                    </div>
                    <div className="application-form__item">
                        <label htmlFor="company">Company: </label>
                        <input type="text" 
                            id="company" 
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="application-form__input"
                        /> 
                    </div>

                    <div className="application-form__item">
                        <label htmlFor="description">Description: </label>
                        <input type="text"
                            id="description" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="application-form__input"
                        />
                    </div>

                    <div className="application-form__item">
                        <label htmlFor="link">Link: </label> 
                        <input type="text"
                            id="link" 
                            value={link}
                            onChange={(e) => setLink(e.target.value)} 
                            className="application-form__input"
                        /> 
                    </div>

                    <div className="application-form__item">
                    <label htmlFor="applying_date">Appying date: </label>
                        <input type="date"
                            id="applyingDate" 
                            value={applyingDate}
                            onChange={(e) => setApplyingDate(e.target.value)}
                            className="application-form__input"
                        />
                    </div>

                    <div className="application-form__item">
                        <label htmlFor="interview_date">Interview date: </label>
                        <input type="date"
                            id="interviewDate" 
                            value={interviewDate}
                            onChange={(e) => setInterviewDate(e.target.value)}
                            className="application-form__input"
                        />
                    </div>

                    <div className="application-form__item">
                        <label htmlFor="estimated_score">Score: </label> 
                        <input type="text"
                            id="score" 
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            className="application-form__input"
                        />
                    </div>

                    <div className="application-form__item">
                        <label htmlFor="status">Status: </label>
                        <select name="status" 
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="application-form__input"
                        >
                            <option value="Applied">Applied</option>
                            <option value="Interview">Interview</option>
                            <option value="Declined">Declined</option>
                        </select>
                    </div>

                    <div className="application-form__item">
                        <label htmlFor="cv_url">CV: </label>
                        <div  
                            onDrop={(event) => handleDrop(event, setCvUrl)} 
                            onDragOver={handleDragOver}
                            className={`application-form__dropbox ${cvUrl ? "application-form__dropbox--filled" : ""}`}
                        />
                    </div>
                    
                    <div className="application-form__item">
                        <label htmlFor="letter_url">Cover letter: </label>
                        <div onDrop={(event) => handleDrop(event, setLetterUrl)} 
                            onDragOver={handleDragOver}
                            className={`application-form__dropbox ${letterUrl ? "application-form__dropbox--filled" : ""}`}
                        />
                    </div>

                    <div className="application-form__footer">
                        <button className="application-form__button" onClick={onClose}>Add</button>
                    </div>                    
                </div>
            </form>
        </div>
    );
};

export default ApplicationForm;


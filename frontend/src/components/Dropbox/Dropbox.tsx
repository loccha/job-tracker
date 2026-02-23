import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faFilePen } from '@fortawesome/free-solid-svg-icons';

import { useState } from "react";
import './Dropbox.css'

type DropboxProps = {
    onDrop: (file:File) => void;
    label: string;
}

const Dropbox = ({
    onDrop,     // Callback triggered when a file is dropped
    label       // Label displayed inside the dropbox (Resume/Cover Letter)
}: DropboxProps) => {
    const[isDragging, setIsDragging] = useState(false);
    const[isFilled, setIsFilled] = useState(false);
    const[fileName, setFileName] = useState("");

    return(
        <div className="application-form__dropbox-field">
            <div
                className={`
                    application-form__dropbox 
                    ${isDragging ? "application-form__dropbox--dragging" : ""}
                    ${isFilled ? "application-form__dropbox--filled" : ""}
                `}
                onDragEnter={(e) => {
                    e.preventDefault();
                    setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                    const file = event.dataTransfer.files[0];
                    if (file){
                        onDrop(file);
                        setIsFilled(true);
                        setFileName(file.name)
                    } 
                }}
            >                                
            <FontAwesomeIcon 
                className="application-form__upload-icon application-form__upload-icon--arrow-up" 
                icon={faArrowUpFromBracket} 
            />
                {label}                      
            </div>
            {/* Display the dropped file's name below the dropbox */}
            <p className="application-form__filename">{fileName}</p>
        </div>
    );
}

export default Dropbox;
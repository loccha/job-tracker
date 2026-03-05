import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';

import { useState } from "react";
import './Dropbox.css'

type DropboxProps = {
    onDrop: (file:File) => void;
    label: string;
    fileName: string | undefined;
}

const Dropbox = ({
    onDrop,     // Callback triggered when a file is dropped
    label,       // Label displayed inside the dropbox (Resume/Cover Letter)
    fileName: initialFileName
}: DropboxProps) => {
    const[isDragging, setIsDragging] = useState(false);
    const[isFilled, setIsFilled] = useState(false);
    const[fileName, setFileName] = useState(initialFileName);

    return(
        <div className="dropbox-field">
            <div
                className={`
                    dropbox 
                    ${isDragging ? "dropbox--dragging" : ""}
                    ${isFilled ? "dropbox--filled" : ""}
                `}
                onDragEnter={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDrop={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                    const file = event.dataTransfer.files[0];
                    if (file){
                        onDrop(file);
                        if(file.type=="application/pdf"){
                            setIsFilled(true);
                            setFileName(file.name);
                        }                        
                    } 
                }}
            > 
            <p>
                {label}
                <span>
                    <FontAwesomeIcon 
                        className="dropbox__upload-icon dropbox__upload-icon--arrow-up" 
                        icon={faArrowUpFromBracket} 
                    />
                </span>
            </p>                               
            
                                      
            </div>
            {/* Display the dropped file's name below the dropbox */}
            <p className="dropbox__filename">{fileName}</p>
        </div>
    );
}

export default Dropbox;
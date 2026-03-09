import { useState } from "react";

import { Job } from '../../types/job';


import ApplicationPanelRead from "../ApplicationPanelRead/ApplicationPanelRead";
import ApplicationPanelEdit from "../ApplicationPanelEdit/ApplicationPanelEdit";

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
    const[isEditing, setIsEditing] = useState(false);

    const onHandleDelete = async ({}) => { 
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/delete/${job.id}`, {
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
            {isEditing ? (
                <ApplicationPanelEdit
                    job={job}
                    setJobs={setJobs}
                    setPopupVisible={() => setPopupVisible(true)}
                    setIsEditing={() => setIsEditing(false)}
                    onSave={() => setIsEditing(false)}
                />
            ) : (
                <ApplicationPanelRead
                    job={job}
                    setPopupVisible={() => setPopupVisible(true)}
                    setIsEditing={() => setIsEditing(true)}
                />
            )}   
            
            
        </div>
    );
    
    
}

export default ApplicationPanel;
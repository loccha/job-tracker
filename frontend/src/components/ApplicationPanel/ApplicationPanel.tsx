import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import './ApplicationPanel.css'

type ApplicationPanelProps = {
    title:string;
    company:string;
    link:string;
    status:string;
    confidenceScore:number;
}

function ApplicationPanel ({
    title,
    company,
    link,
    status,
    confidenceScore
}:ApplicationPanelProps) {

    return (
        <div className="application-panel">
            <header className="application-panel__header">
                <div className="application-panel__identity">
                    <a href={`${link}`}>
                        <FontAwesomeIcon className="application-panel__icon application-panel__icon--link" icon={faLink} />
                    </a>
                    <div className="application-panel__meta">
                        <h2 className="application-panel__title">{title}</h2>
                        <p className="application-panel__company">{company}</p>
                    </div>
                </div>
                <div className="application-panel__line">
                    <span className="application-panel__badge">
                        <p className="application-panel__status">{status}</p>
                        <p className="application-panel__confidence">Confidence <b>{confidenceScore}%</b></p>
                    </span>
                </div>
            </header>
            
        </div>
    );
    
    
}

export default ApplicationPanel;
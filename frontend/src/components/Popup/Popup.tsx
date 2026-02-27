import './Popup.css'
import '../../styles/variables.css'

type PopupProps = {
    onClose: () => void;
    onHandleDelete: ({}: {}) => Promise<void>;
}

const Popup = ({onClose, onHandleDelete}:PopupProps) => {
    return(
        <div className="popup">
                <h3 className="popup__title">Are you sure?</h3>
                <p className="popup__warning">Are you sure you want to delete this application? This action cannot be undone.</p>
            <div className="popup__options">
                <button 
                    className="button-subtle"
                    onClick={onClose}
                > Cancel 
                </button>

                <button 
                    className="button-primary"
                    onClick={onHandleDelete}
                > Delete 
                </button>
            </div>
        </div>
    )
}

export default Popup;
import './StatusColumn.css'

function StatusColumn({ title, status }) {
    return (
    <div className={`status-column status-column--${status}`}>
        <div className={`status-column__header status-column__header--${status}`}>
            <h2>{`${title}`}</h2>
        </div>
        
    </div>
    )
}

export default StatusColumn;
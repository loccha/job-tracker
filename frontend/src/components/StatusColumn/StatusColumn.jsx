import './StatusColumn.css'

function StatusColumn({ title, status }) {
    return <div className={`status-column status-column--${status}`}><h2>{`${title}`}</h2></div>
}

export default StatusColumn;
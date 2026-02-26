import './Calendar.css'

type CalendarProps = {
    date: string | null
}

const Calendar = ({date}: CalendarProps) => {

    return (
        <div className={`calendar ${!date ? "calendar--empty" : ""}`}>
            <div className="calendar__header">
                <p className="calendar__month-day">{date ?? ""}</p>
            </div>
            <div className="calendar__content">
                <p className="calendar__day">{date ? date.slice(4) : "—"}</p>
            </div>
        </div>
    )
} 

export default Calendar;
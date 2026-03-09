import './Calendar.css'

type CalendarProps = {
    date: string | undefined;
}

const Calendar = ({date}: CalendarProps) => {

    console.log("DATE: ", date);
    
    const formattedDate = date ? new Date(date + "T00:00:00").toLocaleDateString("en-CA", { month: "short", day: "numeric" })
                                : null;
    
    
    return (
        <div className={`calendar ${!date ? "calendar--empty" : ""}`}>
            <div className="calendar__header">
                <p className="calendar__month-day">{formattedDate ?? ""}</p>
            </div>
            <div className="calendar__content">
                <p className="calendar__day">{formattedDate ? formattedDate.slice(4) : "—"}</p>
            </div>
        </div>
    )
} 

export default Calendar;
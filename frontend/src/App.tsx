import { useEffect, useState } from 'react'
import StatusColumn from './components/StatusColumn/StatusColumn'
import './App.css'


function App() {

    const [jobs, setJobs] = useState([]);
      useEffect(() => {
          fetch('http://localhost:3000/api')
          .then(res => res.json())
          .then(data => setJobs(data))
          .catch(err => console.log(err))
      }, []);

    const columns = [
        { id: 1, title: 'Applied', status: 'Applied' },
        { id: 2, title: 'Interview', status: 'Interview' },
        { id: 3, title: 'Declined', status: 'Declined' }
    ];

  return (
    <div>
        <div className="header">
          <h1 className="header__title">JobTracker</h1>
          <div className="header__menu">
                <label className="header__button" htmlFor="New job">New job</label>
          </div>

        </div>
        <div className="kanban-board">
          {columns.map(column => (
              <StatusColumn
                  key={column.id}
                  title={column.title}
                  status={column.status}
                  jobs={jobs}
              />
            ))
          }
        </div>
    </div>
    
  );
}


export default App;

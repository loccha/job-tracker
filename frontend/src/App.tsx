import { useEffect, useState, useRef } from 'react'
import StatusColumn from './components/StatusColumn/StatusColumn'
import ApplicationForm from './components/ApplicationForm/ApplicationForm'
import { Job } from './types/job'
import { mapJobFromApi } from './mappers/jobMapper'
import './App.css'
import ApplicationPanel from './components/ApplicationPanel/ApplicationPanel'


function App() {
    const[jobs, setJobs] = useState<Job[]>([]);
    const[formVisible, setFormVisible] = useState(false)

      useEffect(() => {
          fetch('http://localhost:3000/api')
          .then(res => res.json())
          .then(data => {
            const mappedJobs: Job[] = data.map(mapJobFromApi);
            setJobs(mappedJobs);
          })
          .catch(err => console.log(err))
      }, []);

    const columns = [
        { id: 1, title: 'Applied', status: 'Applied' },
        { id: 2, title: 'Interview', status: 'Interview' },
        { id: 3, title: 'Declined', status: 'Declined' }
    ];

  return (
    <div>
        <ApplicationPanel
            title={"Intern in UI development"}
            company={"Hewlett Packard Enterprise"}
            link={"https://careers.hpe.com/us/en/job/1201682/Stagiaire-en-d%C3%A9veloppement-d'interface-Intern-in-UI-development"}
            status={"Applied"}
            confidenceScore={88}
            date={"2026-03-01"}
        />

        {formVisible && (
          <ApplicationForm 
            setJobs={setJobs} 
            onClose={() => setFormVisible(false)}
          />
        )}
        <div className="header">
          <h1 className="header__title">JobTracker</h1>
          <div className="header__menu">
                <label className="header__button" htmlFor="New Job" onClick={() => setFormVisible(true)}>New Job</label>
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

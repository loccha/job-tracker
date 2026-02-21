import { useEffect, useState, useRef } from 'react'
import StatusColumn from './components/StatusColumn/StatusColumn'
import ApplicationForm from './components/ApplicationForm/ApplicationForm'
import { Job } from './types/job'
import { mapJobFromApi } from './mappers/jobMapper'
import './App.css'
import ApplicationPanel from './components/ApplicationPanel/ApplicationPanel'

const App = () => {
    const[jobs, setJobs] = useState<Job[]>([]);
    const[formVisible, setFormVisible] = useState(false)
    const[selectedJob, setSelectedJob] = useState<number | null>(null)

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

  const handleSelectJob = (id: number) => {
      setSelectedJob(id);
  };

  return (
    <div>
        {selectedJob && (
          <>
            <div className="blur-overlay" onClick={() => setSelectedJob(null)}></div>
            <ApplicationPanel
              job = {jobs.find(job => job.id === selectedJob)!}
            />
          </>
        )}

        {formVisible && (
          <>
            <div className="blur-overlay" onClick={() => setFormVisible(false)}></div>
            <ApplicationForm 
              setJobs={setJobs} 
              onClose={() => setFormVisible(false)}
            />
          </>
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

                  onSelectJob={handleSelectJob}
              />
            ))
          }
        </div>
    </div>
  );
}


export default App;

import { useEffect, useState } from 'react'

import StatusColumn from './components/StatusColumn/StatusColumn'
import ApplicationForm from './components/ApplicationForm/ApplicationForm'
import ApplicationPanel from './components/ApplicationPanel/ApplicationPanel'

import { Job } from './types/job'
import { mapJobFromApi } from './mappers/jobMapper'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faPlus} from '@fortawesome/free-solid-svg-icons';

import './App.css'

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
        { id: 1, title: 'Applied', status: 'applied' },
        { id: 2, title: 'Interview', status: 'interview' },
        { id: 3, title: 'Offer', status: 'offer' },
        { id: 4, title: 'Declined', status: 'declined' }
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
              setJobs={setJobs}
              onClose={() => setSelectedJob(null)}
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
          <h1 className="header__title">
              <FontAwesomeIcon 
                  className="header__briefcase" 
                  icon={faBriefcase} 
              />JobTracker
          </h1>
          <div className="header__menu">
                <label className="button-primary header__button" htmlFor="New Job" onClick={() => setFormVisible(true)}>
                  {<FontAwesomeIcon 
                      className="button__plus-sign" 
                      icon={faPlus} 
                  /> }
                   New Job
                </label>
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

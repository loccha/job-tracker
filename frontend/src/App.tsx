import { useEffect, useState } from 'react'

import StatusColumn from './components/StatusColumn/StatusColumn'
import ApplicationForm from './components/ApplicationForm/ApplicationForm'
import ApplicationPanel from './components/ApplicationPanel/ApplicationPanel'
import StatsBar from './components/StatsBar/StatsBar'

import { Job } from './types/job'
import { mapJobFromApi } from './mappers/jobMapper'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faPlus} from '@fortawesome/free-solid-svg-icons';

import './App.css'

const App = () => {
    const[jobs, setJobs] = useState<Job[]>([]);
    const[formVisible, setFormVisible] = useState(false)
    const[selectedJob, setSelectedJob] = useState<number | null>(null)
    const[isClosingPanel, setIsClosingPanel] = useState(false);
    const[isClosingForm, setIsClosingForm] = useState(false);

      useEffect(() => {
          fetch(`${import.meta.env.VITE_API_URL}/api`)
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

  const handleClosePanel = () => {
    setIsClosingPanel(true);
    setTimeout(() => {
      setSelectedJob(null);
      setIsClosingPanel(false);
    }, 300);
  };

  const handleCloseForm = () => {
    setIsClosingForm(true);
    setTimeout(() => {
      setFormVisible(false);
      setIsClosingForm(false);
    }, 300);
  };

  return (
    <div className="app">
        {selectedJob && (
          <>
            <div className={`blur-overlay ${isClosingPanel ? 'closing' : ''}`} onClick={handleClosePanel}></div>
            <ApplicationPanel
              job = {jobs.find(job => job.id === selectedJob)!}
              setJobs={setJobs}
              onClose={handleClosePanel}
              isClosing={isClosingPanel}
            />
          </>
        )}

        {formVisible && (
          <>
            <div className={`blur-overlay ${isClosingForm ? 'closing' : ''}`} onClick={handleCloseForm}></div>
            <ApplicationForm 
              setJobs={setJobs} 
              onClose={handleCloseForm}
              isClosing={isClosingForm}
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
        <StatsBar jobs={jobs} />
        <div className="kanban-board">
          {columns.map(column => (
              <StatusColumn
                  key={column.id}
                  title={column.title}
                  status={column.status}
                  jobs={jobs}
                  setJobs={setJobs}
                  onSelectJob={handleSelectJob}
              />
            ))
          }
        </div>
    </div>
  );
}


export default App;

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { Job } from '../../types/job';
import './StatsBar.css';

type StatsBarProps = {
  jobs: Job[];
};

const StatsBar = ({ jobs }: StatsBarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const statusCounts = jobs.reduce(
    (acc, job) => {
      acc.applied += job.status === 'applied' ? 1 : 0;
      acc.interview += job.status === 'interview' ? 1 : 0;
      acc.offer += job.status === 'offer' ? 1 : 0;
      acc.declined += job.status === 'declined' ? 1 : 0;
      return acc;
    },
    { applied: 0, interview: 0, offer: 0, declined: 0 }
  );

  // Count interviewed by presence of an interviewDate (as requested)
  const interviewedByDate = jobs.filter((job) => Boolean(job.interviewDate && String(job.interviewDate).trim())).length;

  const totalApplications = jobs.length;

  const segments = [
    { label: 'Sent', value: statusCounts.applied, color: '#9d32db' },
    { label: 'Interviewed', value: interviewedByDate, color: '#32c2db' },
    { label: 'Offer', value: statusCounts.offer, color: '#28a768' },
    { label: 'Declined', value: statusCounts.declined, color: '#ff4258' },
  ];

  let startPercent = 0;
  const chartGradient = segments
    .map((segment) => {
      const percent = totalApplications ? (segment.value / totalApplications) * 100 : 0;
      const endPercent = startPercent + percent;
      const gradientPart = `${segment.color} ${startPercent}% ${endPercent}%`;
      startPercent = endPercent;
      return gradientPart;
    })
    .join(', ');

  return (
    <aside
      className={`stats-sidesheet ${isOpen ? 'stats-sidesheet--open' : ''}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div
        className="stats-sidesheet__handle"
        onClick={() => setIsOpen((s) => !s)}
        role="button"
        aria-label={isOpen ? 'Fermer les stats' : 'Ouvrir les stats'}
      >
        <FontAwesomeIcon icon={isOpen ? faAnglesRight : faAnglesLeft} size="lg" />
      </div>
      <div className="stats-sidesheet__content">
        <div className="stats-sidesheet__chart" style={{ backgroundImage: totalApplications ? `conic-gradient(${chartGradient})` : '#e5e7eb' }}>
          <div className="stats-sidesheet__center">
            <span className="stats-sidesheet__center-label">Total</span>
            <strong className="stats-sidesheet__center-value">{totalApplications}</strong>
          </div>
        </div>
        <div className="stats-sidesheet__legend">
          {segments.map((segment) => (
            <div
              key={segment.label}
              className="stats-sidesheet__legend-item"
              data-tooltip={`${segment.value} ${segment.value === 1 ? 'application' : 'applications'}`}
            >
              <span className="stats-sidesheet__dot" style={{ backgroundColor: segment.color }} />
              <span className="stats-sidesheet__legend-text">{segment.label}</span>
              <span className="stats-sidesheet__legend-count">{segment.value}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default StatsBar;

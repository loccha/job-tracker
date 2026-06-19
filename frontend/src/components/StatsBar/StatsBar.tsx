import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAnglesRight, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { Job } from '../../types/job';
import './StatsBar.css';

type StatsBarProps = {
  jobs: Job[];
};

const StatsBar = ({ jobs }: StatsBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredSegmentLabel, setHoveredSegmentLabel] = useState<string | null>(null);

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

  // Compte les entretiens par présence d'une interviewDate plutôt que par status,
  // pour capturer les entretiens même si le statut n'a pas été mis à jour.
  // On part de statusCounts.interview comme base et on ajoute les jobs qui ont
  // une date d'entretien mais un autre statut (ex: applied -> interviewé -> pas encore changé)
  const interviewedByDate = jobs.filter((job) => Boolean(job.interviewDate && String(job.interviewDate).trim())).length;
  const interviewCount = Math.max(statusCounts.interview, interviewedByDate);

  const totalApplications = jobs.length;

  // Dégradés clair -> foncé par segment pour donner du relief
  const segments = [
    { label: 'Offers', value: statusCounts.offer, colorLight: '#4ade80', colorDark: '#16803c' },
    { label: 'Interview', value: statusCounts.interview, colorLight: '#60a5fa', colorDark: '#0b3aa8' },
    { label: 'Pending response', value: statusCounts.applied, colorLight: '#c084fc', colorDark: '#7c1fc9' },
    { label: 'Declined', value: statusCounts.declined, colorLight: '#fb7185', colorDark: '#d8233f' },
  ];

  const SIZE = 175;
  const STROKE_WIDTH = 34;
  const RADIUS = (SIZE - STROKE_WIDTH) / 2;
  const CENTER = SIZE / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  let cumulativePercent = 0;
  const arcs = segments.map((segment, i) => {
    const percent = totalApplications ? segment.value / totalApplications : 0;
    const dashArray = `${percent * CIRCUMFERENCE} ${CIRCUMFERENCE}`;
    const dashOffset = -cumulativePercent * CIRCUMFERENCE;
    cumulativePercent += percent;
    return { ...segment, dashArray, dashOffset, gradientId: `stats-grad-${i}` };
  });

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
        <div className="stats-sidesheet__chart">
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="stats-sidesheet__donut-svg"
          >
            <defs>
              {arcs.map((arc) => (
                <radialGradient key={arc.gradientId} id={arc.gradientId} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={arc.colorLight} />
                  <stop offset="100%" stopColor={arc.colorDark} />
                </radialGradient>
              ))}
              <radialGradient id="stats-sheen" cx="50%" cy="18%" r="55%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>

            {!totalApplications ? (
              <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="#e5e7eb" strokeWidth={STROKE_WIDTH} />
            ) : (
              <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
                {arcs.map((arc) => (
                  <circle
                    key={arc.label}
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    fill="none"
                    stroke={`url(#${arc.gradientId})`}
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={arc.dashArray}
                    strokeDashoffset={arc.dashOffset}
                    style={{
                      opacity: hoveredSegmentLabel === null || hoveredSegmentLabel === arc.label ? 1 : 0.3,
                      transition: 'opacity 0.2s ease'
                    }}
                  />
                ))}
              </g>
            )}

            {totalApplications > 0 && (
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke="url(#stats-sheen)"
                strokeWidth={STROKE_WIDTH}
                style={{ mixBlendMode: 'overlay' }}
              />
            )}

            <text
              x={CENTER}
              y={CENTER - 10}
              textAnchor="middle"
              className="stats-sidesheet__center-label"
            >
              Total
            </text>
            <text
              x={CENTER}
              y={CENTER + 16}
              textAnchor="middle"
              className="stats-sidesheet__center-value"
            >
              {totalApplications}
            </text>
          </svg>
        </div>
        <div className="stats-sidesheet__legend">
          {segments.map((segment) => {
            const percent = totalApplications ? (segment.value / totalApplications) * 100 : 0;
            return (
              <div
                key={segment.label}
                className="stats-sidesheet__legend-item"
                data-tooltip={`${segment.value} ${segment.value === 1 ? 'application' : 'applications'}`}
                onMouseEnter={() => setHoveredSegmentLabel(segment.label)}
                onMouseLeave={() => setHoveredSegmentLabel(null)}
              >
                <span className="stats-sidesheet__dot" style={{ backgroundColor: segment.colorDark }} />
                <span className="stats-sidesheet__legend-text">{segment.label}</span>
                <span className="stats-sidesheet__legend-count">{percent.toFixed(2)}%</span>
              </div>
            );
          })}
        </div>
        <div className="stats-sidesheet__interview-stat">
            <span className="stats-sidesheet__legend-text">
              <FontAwesomeIcon icon={faCalendarDay} style={{ marginRight: '0.5rem' }} />
              Interview secured
            </span>
            <span className="stats-sidesheet__legend-count">
              {totalApplications ? ((interviewCount / totalApplications) * 100).toFixed(0) : 0}%
            </span>
        </div>
      </div>
    </aside>
  );
};

export default StatsBar;
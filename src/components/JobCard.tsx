import type { JobListing } from '../types';
import { getMatchLevel, type SkillMatchResult } from '../utils/skillMatcher';

interface JobCardProps {
  job: JobListing;
  match: SkillMatchResult;
  alreadyApplied: boolean;
  onSave: (job: JobListing) => void;
}

export default function JobCard({ job, match, alreadyApplied, onSave }: JobCardProps) {
  const level = getMatchLevel(match.score);
  const initials = job.company_name.slice(0, 2).toUpperCase();

  return (
    <article className="jx-card">
      <header className="jx-card-head">
        <div className="jx-avatar">{initials}</div>
        <div className="jx-company">
          <strong>{job.company_name}</strong>
          <span>{job.candidate_required_location}</span>
        </div>
        <span className={`jx-badge jx-badge--${level}`}>{match.score}% Match</span>
      </header>

      <h3 className="jx-title">{job.title}</h3>

      <div className="jx-chip-list">
        {match.matched.map((skill) => (
          <span key={`m-${skill}`} className="jx-tag jx-tag--matched">{skill}</span>
        ))}
        {match.missing.map((skill) => (
          <span key={`x-${skill}`} className="jx-tag jx-tag--missing">{skill}</span>
        ))}
      </div>

      {match.missing.length > 0 && (
        <p className="jx-muted">Missing skills: {match.missing.join(', ')}</p>
      )}

      <footer className="jx-card-foot">
        <span className="jx-salary">{job.salary !== '' ? job.salary : 'Gaji tidak disebutkan'}</span>
        <button
          type="button"
          className="jx-btn jx-btn--primary"
          disabled={alreadyApplied}
          onClick={() => onSave(job)}
        >
          {alreadyApplied ? 'Sudah Dilamar' : 'Simpan ke Wishlist'}
        </button>
      </footer>
    </article>
  );
}
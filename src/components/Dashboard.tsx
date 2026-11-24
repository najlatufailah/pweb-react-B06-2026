import type { Application } from '../types';
import { findInterviewConflicts } from '../utils/interviewConflict';
import Statistics from './Statistics';

interface Props {
  applications: Application[];
  now: number;
}

export default function Dashboard({ applications, now }: Props) {
  const conflicts = findInterviewConflicts(applications);

  return (
    <>
      {conflicts.length > 0 && (
        <div className="conflict-banner" role="alert">
          <strong>Jadwal Interview Bentrok!</strong>
          {conflicts.map(([a, b]) => (
            <p key={a.id + b.id}>
              {a.company} ({new Date(a.interviewDateTime || '').toLocaleString('id-ID')}) dan {b.company} ({new Date(b.interviewDateTime || '').toLocaleString('id-ID')}) berselisih kurang dari 60 menit.
            </p>
          ))}
        </div>
      )}
      <Statistics applications={applications} now={now} />
    </>
  );
}

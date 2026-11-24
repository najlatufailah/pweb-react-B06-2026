import { useState } from 'react';
import type { Application, ApplicationStatus } from '../types';
import { calculateSkillMatch, getMatchLevel } from '../utils/skillMatcher';
import { isRawanGhosting } from '../utils/ghostingChecker';
import { findInterviewConflicts } from '../utils/interviewConflict';
import { transitions } from '../utils/stateMachine';

interface Props {
  applications: Application[];
  kaptenSkills: string[];
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onSimulate: (id: string) => void;
  now: number;
}

export default function ApplicationPipeline({ applications, kaptenSkills, onOpen, onDelete, onSimulate, now }: Props) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [ghostingOnly, setGhostingOnly] = useState(false);
  const [sort, setSort] = useState('newest');
  // Bentrok dihitung dari semua lamaran, sebelum filter.
  const conflicts = findInterviewConflicts(applications);
  const query = search.trim().toLowerCase();
  const visible = applications.filter(app =>
    (app.company.toLowerCase().includes(query) || app.role.toLowerCase().includes(query)) &&
    (status === 'ALL' || app.status === status) &&
    (!ghostingOnly || isRawanGhosting(app, now))
  );
  visible.sort((a, b) => {
    if (sort === 'salary') return (b.status === 'OFFER' ? b.salaryOffer || 0 : 0) - (a.status === 'OFFER' ? a.salaryOffer || 0 : 0);
    if (sort === 'interview') {
      const dateA = a.status === 'INTERVIEW' && a.interviewDateTime ? Date.parse(a.interviewDateTime) : Infinity;
      const dateB = b.status === 'INTERVIEW' && b.interviewDateTime ? Date.parse(b.interviewDateTime) : Infinity;
      return dateA === dateB ? 0 : dateA - dateB;
    }
    return Date.parse(b.lastUpdatedAt) - Date.parse(a.lastUpdatedAt);
  });

  return (
    <section className="panel">
      <h2>War Room Lamaran</h2>
      {conflicts.length > 0 && <div className="warning" role="alert"><strong>Peringatan: Bentrok Jadwal Interview</strong>
        {conflicts.map(([a, b]) => <p key={a.id + b.id}>{a.company} ({a.role}) dan {b.company} ({b.role}) berselisih kurang dari 60 menit.</p>)}
      </div>}
      <div className="actions filters">
        <input type="search" aria-label="Cari lamaran" placeholder="Cari perusahaan / posisi" value={search} onChange={e => setSearch(e.target.value)} />
        <select aria-label="Filter status" value={status} onChange={e => setStatus(e.target.value)}><option value="ALL">Semua Status</option>
          {(Object.keys(transitions) as ApplicationStatus[]).map(item => <option key={item}>{item}</option>)}
        </select>
        <select aria-label="Urutkan lamaran" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="newest">Terbaru</option><option value="interview">Jadwal Interview Terdekat</option><option value="salary">Offer Tertinggi</option>
        </select>
        <label><input type="checkbox" checked={ghostingOnly} onChange={e => setGhostingOnly(e.target.checked)} /> Hanya Rawan Ghosting</label>
      </div>
      {visible.length === 0 && <p className="empty">Tidak ada lamaran yang cocok.</p>}
      <div className="application-grid">{visible.map(app => {
        const score = calculateSkillMatch(kaptenSkills, app.requiredSkills).score;
        return <article className="application-card" key={app.id}>
          <div className="section-heading"><strong>{app.company}</strong><span className="status">{app.status}</span></div>
          <h3>{app.role}</h3>
          <p className="muted">{app.workMode} · CV: {app.cvVersion || '-'}</p>
          <p>Checklist: {app.checklist.filter(item => item.done).length}/{app.checklist.length}</p>
          <span className={'jx-badge jx-badge--' + getMatchLevel(score)}>{score}% Match</span>
          {isRawanGhosting(app, now) && <span className="warning badge">Rawan Ghosting</span>}
          {app.status === 'INTERVIEW' && app.interviewDateTime && <p>Interview: {new Date(app.interviewDateTime).toLocaleString('id-ID')}</p>}
          {app.status === 'OFFER' && <p>Rp {(app.salaryOffer || 0).toLocaleString('id-ID')}</p>}
          <div className="actions">
            <button className="primary" onClick={() => onOpen(app.id)}>Detail</button>
            {(app.status === 'APPLIED' || app.status === 'SCREENING') && <button onClick={() => onSimulate(app.id)}>Simulasi +15 Hari</button>}
            <button className="danger" onClick={() => onDelete(app.id)}>Hapus</button>
          </div>
        </article>;
      })}</div>
    </section>
  );
}

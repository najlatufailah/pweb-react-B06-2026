import { useState, type FormEvent, type ReactNode } from 'react';
import type { Application, ApplicationStatus, WorkMode } from '../types';
import { transitions, validateTransition } from '../utils/stateMachine';
import Checklist from './Checklist';

interface Props {
  app: Application;
  onUpdate: (app: Application) => void;
  onClose: () => void;
  children?: ReactNode;
}

export default function ApplicationDetail({ app, onUpdate, onClose, children }: Props) {
  const [target, setTarget] = useState<ApplicationStatus | ''>('');
  const [cv, setCv] = useState(app.cvVersion || '');
  const [date, setDate] = useState(app.appliedDate || '');
  const [interview, setInterview] = useState(app.interviewDateTime || '');
  const [salary, setSalary] = useState(app.salaryOffer?.toString() || '');
  const [mode, setMode] = useState<WorkMode>(app.workMode);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  function changeStatus(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!target) return;
    const next: Application = { ...app, status: target };
    if (target === 'APPLIED') { next.cvVersion = cv.trim(); next.appliedDate = date; }
    if (target === 'INTERVIEW') next.interviewDateTime = interview;
    if (target === 'OFFER') { next.salaryOffer = Number(salary); next.workMode = mode; }
    const message = validateTransition(app, next);
    if (message) { setError(message); return; }
    const now = new Date().toISOString();
    onUpdate({ ...next, lastUpdatedAt: now, activityLogs: [...app.activityLogs, {
      id: crypto.randomUUID(), timestamp: now, message: 'Status: ' + app.status + ' -> ' + target,
    }] });
    setTarget(''); setError('');
  }

  function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!note.trim()) return;
    onUpdate({ ...app, activityLogs: [...app.activityLogs, {
      id: crypto.randomUUID(), timestamp: new Date().toISOString(), message: 'Catatan: ' + note.trim(),
    }] });
    setNote('');
  }

  return (
    <div className="modal-backdrop">
      <section className="modal panel" role="dialog" aria-modal="true" aria-label="Detail lamaran">
        <header className="section-heading"><div><h2>{app.role}</h2><p className="muted">{app.company} · {app.workMode}</p></div>
          <button onClick={onClose}>Tutup</button></header>
        <p>Status: <strong>{app.status}</strong></p>
        <p>Skill: {app.requiredSkills.join(', ') || '-'}</p>
        <p>CV: {app.cvVersion || '-'} · Tanggal melamar: {app.appliedDate || '-'}</p>
        {app.interviewDateTime && <p>Interview: {new Date(app.interviewDateTime).toLocaleString('id-ID')}</p>}
        {app.salaryOffer !== undefined && <p>Offer: Rp {app.salaryOffer.toLocaleString('id-ID')}</p>}
        <h3>Ubah Status</h3>
        {transitions[app.status].length === 0 ? <p className="muted">Status final, tidak bisa diubah lagi.</p> :
          <form onSubmit={changeStatus} noValidate className="form-grid">
            <label className="full-width">Status Tujuan<select value={target} onChange={e => { setTarget(e.target.value as ApplicationStatus | ''); setError(''); }}>
              <option value="">Pilih status</option>{transitions[app.status].map(status => <option key={status}>{status}</option>)}
            </select></label>
            {target === 'APPLIED' && <>
              <label>Versi CV<input value={cv} onChange={e => setCv(e.target.value)} required /></label>
              <label>Tanggal Melamar<input type="date" value={date} onChange={e => setDate(e.target.value)} required /></label>
            </>}
            {target === 'INTERVIEW' && <label className="full-width">Jadwal Interview<input type="datetime-local" value={interview} onChange={e => setInterview(e.target.value)} required /></label>}
            {target === 'OFFER' && <>
              <label>Gaji (Rp)<input type="number" min="1" value={salary} onChange={e => setSalary(e.target.value)} required /></label>
              <label>Mode Kerja<select value={mode} onChange={e => setMode(e.target.value as WorkMode)}><option>Remote</option><option>Hybrid</option><option>Onsite</option></select></label>
            </>}
            {error && <p className="error full-width" role="alert">{error}</p>}
            <button className="primary" disabled={!target} type="submit">Simpan Status</button>
          </form>}
        <Checklist items={app.checklist} onChange={items => onUpdate({ ...app, checklist: items })} />
        <section>
          <h3>Activity Log</h3>
          <form onSubmit={addNote} className="actions"><input aria-label="Catatan manual" value={note} onChange={e => setNote(e.target.value)} placeholder="Tulis catatan..." /><button type="submit">Simpan Catatan</button></form>
          <ul className="logs">{[...app.activityLogs].reverse().map(log => <li key={log.id}><small>{new Date(log.timestamp).toLocaleString('id-ID')}</small><div>{log.message}</div></li>)}</ul>
        </section>
        {children}
      </section>
    </div>
  );
}

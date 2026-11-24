import { useRef, useState, type FormEvent } from 'react';
import type { Application, WorkMode } from '../types';
import { isDuplicate } from '../utils/stateMachine';

interface Props {
  applications: Application[];
  onAdd: (app: Application) => void;
}

export default function ApplicationForm({ applications, onAdd }: Props) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [mode, setMode] = useState<WorkMode>('Remote');
  const [status, setStatus] = useState<'WISHLIST' | 'APPLIED'>('WISHLIST');
  const [skills, setSkills] = useState('');
  const [cv, setCv] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const companyRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLInputElement>(null);
  const skillsRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const requiredSkills = skills.split(',').map(skill => skill.trim()).filter(Boolean);
    if (!company.trim()) { setError('Perusahaan wajib diisi.'); companyRef.current?.focus(); return; }
    if (!role.trim()) { setError('Posisi wajib diisi.'); roleRef.current?.focus(); return; }
    if (isDuplicate(applications, company, role)) { setError('Lamaran perusahaan dan posisi ini sudah ada.'); companyRef.current?.focus(); return; }
    if (requiredSkills.length === 0) { setError('Required skills wajib diisi.'); skillsRef.current?.focus(); return; }
    if (status === 'APPLIED' && !cv.trim()) { setError('Versi CV wajib diisi.'); cvRef.current?.focus(); return; }
    if (status === 'APPLIED' && !date) { setError('Tanggal melamar wajib diisi.'); dateRef.current?.focus(); return; }
    const now = new Date().toISOString();
    onAdd({
      id: crypto.randomUUID(), company: company.trim(), role: role.trim(),
      workMode: mode, status, requiredSkills,
      cvVersion: status === 'APPLIED' ? cv.trim() : undefined,
      appliedDate: status === 'APPLIED' ? date : undefined,
      lastUpdatedAt: now, checklist: [],
      activityLogs: [{ id: crypto.randomUUID(), timestamp: now, message: 'Lamaran dibuat: ' + status }],
    });
    setCompany(''); setRole(''); setSkills(''); setCv(''); setDate('');
    setMode('Remote'); setStatus('WISHLIST'); setError('');
  }

  return (
    <section className="panel">
      <h2>Tambah Lamaran Manual</h2>
      <form onSubmit={submit} noValidate className="form-grid">
        <label>Perusahaan<input ref={companyRef} value={company} onChange={e => setCompany(e.target.value)} required /></label>
        <label>Posisi / Role<input ref={roleRef} value={role} onChange={e => setRole(e.target.value)} required /></label>
        <label>Mode Kerja<select value={mode} onChange={e => setMode(e.target.value as WorkMode)}>
          <option>Remote</option><option>Hybrid</option><option>Onsite</option>
        </select></label>
        <label>Status Awal<select value={status} onChange={e => setStatus(e.target.value as 'WISHLIST' | 'APPLIED')}>
          <option>WISHLIST</option><option>APPLIED</option>
        </select></label>
        <label className="full-width">Required Skills<input ref={skillsRef} value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, CSS, TypeScript" required /></label>
        {status === 'APPLIED' && <>
          <label>Versi CV<input ref={cvRef} value={cv} onChange={e => setCv(e.target.value)} required /></label>
          <label>Tanggal Melamar<input ref={dateRef} type="date" value={date} onChange={e => setDate(e.target.value)} required /></label>
        </>}
        {error && <p className="error full-width" role="alert">{error}</p>}
        <button className="primary" type="submit">Tambah Lamaran</button>
      </form>
    </section>
  );
}

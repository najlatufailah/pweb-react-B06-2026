import { useEffect, useRef, useState } from 'react';
import type { Application, JobListing } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { inferWorkMode } from './services/jobService';
import { isDuplicate } from './utils/stateMachine';
import { simulateGhosting } from './utils/ghostingChecker';
import JobExplorer from './components/JobExplorer';
import ApplicationForm from './components/ApplicationForm';
import ApplicationPipeline from './components/ApplicationPipeline';
import ApplicationDetail from './components/ApplicationDetail';
import Dashboard from './components/Dashboard';
import Navbar, { type Page } from './components/Navbar';
import InterviewTimer from './components/InterviewTimer';
import OfferComparator from './components/OfferComparator';
import './App.css';

export default function App() {
  const [applications, setApplications] = useLocalStorage<Application[]>('applications', []);
  const [kaptenSkills, setKaptenSkills] = useLocalStorage<string[]>('kaptenSkills', ['React', 'TypeScript', 'CSS']);
  const [page, setPage] = useState<Page>('explore');
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleted, setDeleted] = useState<{ app: Application; index: number } | null>(null);
  const [message, setMessage] = useState('');
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const selected = applications.find(app => app.id === selectedId);

  useEffect(() => {
    const clock = setInterval(() => setNow(Date.now()), 60000);
    return () => {
      clearInterval(clock);
      if (undoTimer.current !== null) clearTimeout(undoTimer.current);
    };
  }, []);

  function addApplication(app: Application) {
    setApplications(prev => isDuplicate(prev, app.company, app.role) ? prev : [...prev, app]);
  }

  function saveWishlist(job: JobListing) {
    const timestamp = new Date().toISOString();
    addApplication({
      id: crypto.randomUUID(), company: job.company_name, role: job.title,
      workMode: inferWorkMode(job.candidate_required_location),
      status: 'WISHLIST', requiredSkills: [...job.tags], lastUpdatedAt: timestamp,
      checklist: [], activityLogs: [{ id: crypto.randomUUID(), timestamp, message: 'Lamaran dibuat: WISHLIST' }],
    });
  }

  function updateApplication(updated: Application) {
    setApplications(prev => prev.map(app => app.id === updated.id ? updated : app));
    setNow(Date.now());
  }

  function deleteApplication(id: string) {
    const index = applications.findIndex(app => app.id === id);
    if (index === -1) return;
    if (undoTimer.current !== null) clearTimeout(undoTimer.current);
    setDeleted({ app: applications[index], index });
    setMessage('');
    setApplications(prev => prev.filter(app => app.id !== id));
    if (selectedId === id) setSelectedId(null);
    undoTimer.current = setTimeout(() => {
      setDeleted(null);
      undoTimer.current = null;
    }, 5000);
  }

  function undoDelete() {
    if (!deleted) return;
    if (undoTimer.current !== null) clearTimeout(undoTimer.current);
    undoTimer.current = null;
    if (isDuplicate(applications, deleted.app.company, deleted.app.role)) {
      setMessage('Undo tidak bisa dilakukan karena lamaran yang sama sudah dibuat kembali.');
    } else {
      setApplications(prev => [
        ...prev.slice(0, deleted.index), deleted.app, ...prev.slice(deleted.index),
      ]);
    }
    setDeleted(null);
  }

  function simulate(id: string) {
    setApplications(prev => prev.map(app =>
      app.id === id && (app.status === 'APPLIED' || app.status === 'SCREENING') ? simulateGhosting(app) : app
    ));
    setNow(Date.now());
  }

  return (
    <main className="app">
      <Navbar page={page} onChangePage={next => { setPage(next); setShowForm(false); }} onAdd={() => setShowForm(prev => !prev)}
        total={applications.length} offers={applications.filter(app => app.status === 'OFFER').length} />
      <Dashboard applications={applications} now={now} />

      {showForm && <div>
        <div className="form-close"><button type="button" onClick={() => setShowForm(false)}>Tutup Form</button></div>
        <ApplicationForm applications={applications} onAdd={app => {
          addApplication(app);
          setShowForm(false);
          setPage('pipeline');
        }} />
      </div>}

      {page === 'explore' && <>
        <h2 className="page-title">Eksplorasi Lowongan</h2>
        <JobExplorer kaptenSkills={kaptenSkills} onSkillsChange={setKaptenSkills} applications={applications} onSaveToWishlist={saveWishlist} />
      </>}
      {page === 'pipeline' && <ApplicationPipeline applications={applications} kaptenSkills={kaptenSkills}
        onOpen={setSelectedId} onDelete={deleteApplication} onSimulate={simulate} now={now} />}
      {page === 'offers' && <OfferComparator applications={applications} kaptenSkills={kaptenSkills} />}

      {selected && <ApplicationDetail key={selected.id} app={selected} onUpdate={updateApplication} onClose={() => setSelectedId(null)}>
        <InterviewTimer />
      </ApplicationDetail>}
      {deleted && <div className="toast" role="status"><span>{deleted.app.company} - {deleted.app.role} dihapus.</span><button onClick={undoDelete}>Undo</button></div>}
      {message && <div className="toast" role="alert"><span>{message}</span><button onClick={() => setMessage('')}>Tutup</button></div>}
    </main>
  );
}

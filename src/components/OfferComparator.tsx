import { useState } from 'react';
import type { Application } from '../types';
import { calculateSkillMatch } from '../utils/skillMatcher';
import { calculateOfferScore, workModeScores } from '../utils/offerCalculator';

interface Props {
  applications: Application[];
  kaptenSkills: string[];
}

export default function OfferComparator({ applications, kaptenSkills }: Props) {
  const [idA, setIdA] = useState('');
  const [idB, setIdB] = useState('');
  const offers = applications.filter(app => app.status === 'OFFER');

  if (offers.length < 2) {
    return (
      <section className="panel">
        <h2>Bandingkan Offer Magang</h2>
        <p className="empty">Minimal diperlukan 2 lamaran berstatus OFFER untuk melakukan perbandingan. Saat ini ada {offers.length} offer.</p>
      </section>
    );
  }

  // Pilih dua offer berbeda, termasuk ketika offer sebelumnya dihapus.
  const offerA = offers.find(app => app.id === idA) || offers[0];
  const offerB = offers.find(app => app.id === idB && app.id !== offerA.id) ||
    (offers[0].id === offerA.id ? offers[1] : offers[0]);

  const maxSalary = Math.max(offerA.salaryOffer || 0, offerB.salaryOffer || 0);
  const matchA = calculateSkillMatch(kaptenSkills, offerA.requiredSkills);
  const matchB = calculateSkillMatch(kaptenSkills, offerB.requiredSkills);
  const scoreA = calculateOfferScore(offerA.salaryOffer || 0, maxSalary, offerA.workMode, matchA.score);
  const scoreB = calculateOfferScore(offerB.salaryOffer || 0, maxSalary, offerB.workMode, matchB.score);
  const tied = Math.abs(scoreA.total - scoreB.total) < 0.000001;

  function renderOffer(app: Application, match: typeof matchA, score: typeof scoreA, best: boolean) {
    return (
      <article className={'offer-card' + (best ? ' best-offer' : '')}>
        <div className="section-heading">
          <div><h3>{app.company}</h3><p className="muted">{app.role}</p></div>
          {best && <span className="recommendation">Rekomendasi Terbaik</span>}
        </div>
        <div className="offer-row"><span>Uang saku / bulan</span><strong>Rp {(app.salaryOffer || 0).toLocaleString('id-ID')}</strong><span>{score.salaryScore.toFixed(1)} / 50</span></div>
        <div className="offer-row"><span>Mode Kerja</span><strong>{app.workMode} ({workModeScores[app.workMode]})</strong><span>{score.modeScore.toFixed(1)} / 25</span></div>
        <div className="offer-row"><span>Kecocokan Skill</span><strong>{match.score}% ({match.matched.length} dari {app.requiredSkills.length} skill)</strong><span>{score.skillScore.toFixed(1)} / 25</span></div>
        <div className="offer-total"><span>Total Skor Berbobot</span><strong>{score.total.toFixed(1)}</strong></div>
      </article>
    );
  }

  return (
    <section className="panel">
      <h2>Bandingkan Offer Magang</h2>
      <p className="muted">Bobot penilaian: Gaji 50% · Mode Kerja 25% · Kecocokan Skill 25%</p>
      <div className="form-grid offer-selects">
        <label>Offer A<select value={offerA.id} onChange={e => {
          if (e.target.value === offerB.id) setIdB(offerA.id);
          setIdA(e.target.value);
        }}>
          {offers.map(app => <option key={app.id} value={app.id}>{app.company} - {app.role}</option>)}
        </select></label>
        <label>Offer B<select value={offerB.id} onChange={e => {
          if (e.target.value === offerA.id) setIdA(offerB.id);
          setIdB(e.target.value);
        }}>
          {offers.map(app => <option key={app.id} value={app.id}>{app.company} - {app.role}</option>)}
        </select></label>
      </div>
      {tied && <p className="empty">Kedua offer memiliki skor yang sama.</p>}
      <div className="offer-grid">
        {renderOffer(offerA, matchA, scoreA, !tied && scoreA.total > scoreB.total)}
        {renderOffer(offerB, matchB, scoreB, !tied && scoreB.total > scoreA.total)}
      </div>
    </section>
  );
}

import type { Application } from '../types';
import { calculateStatistics } from '../utils/statistics';

interface Props {
  applications: Application[];
  now: number;
}

export default function Statistics({ applications, now }: Props) {
  const stats = calculateStatistics(applications, now);

  return (
    <section className="statistics" aria-label="Statistik Lamaran">
      <article className="stat-card">
        <h3>Total Lamaran</h3>
        <strong>{stats.total}</strong>
        <p>{stats.active} aktif di pipeline</p>
      </article>
      <article className="stat-card">
        <h3>Response Rate</h3>
        <strong>{stats.responseRate}%</strong>
        <p>{stats.responded} dari {stats.total} direspons</p>
      </article>
      <article className="stat-card">
        <h3>Interview Rate</h3>
        <strong>{stats.interviewRate}%</strong>
        <p>{stats.interviewed} masuk wawancara</p>
      </article>
      <article className="stat-card">
        <h3>Rawan Ghosting</h3>
        <strong className="stat-red">{stats.ghosting}</strong>
        <p>Lebih dari 14 hari tanpa perubahan status</p>
      </article>
      <article className="stat-card">
        <h3>Offer Diterima</h3>
        <strong className="stat-green">{stats.offers}</strong>
        <p>Siap dibandingkan</p>
      </article>
    </section>
  );
}

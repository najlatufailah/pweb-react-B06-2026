export type Page = 'explore' | 'pipeline' | 'offers';

interface Props {
  page: Page;
  onChangePage: (page: Page) => void;
  onAdd: () => void;
  total: number;
  offers: number;
}

export default function Navbar({ page, onChangePage, onAdd, total, offers }: Props) {
  return (
    <header className="app-header navbar">
      <div className="brand"><span className="brand-logo">AM</span><h1>Aku Mw Magang</h1></div>
      <nav aria-label="Navigasi utama">
        <button className={page === 'explore' ? 'nav-active' : ''} aria-current={page === 'explore' ? 'page' : undefined} onClick={() => onChangePage('explore')}>Eksplorasi Lowongan</button>
        <button className={page === 'pipeline' ? 'nav-active' : ''} aria-current={page === 'pipeline' ? 'page' : undefined} onClick={() => onChangePage('pipeline')}>Pipeline Lamaran ({total})</button>
        <button className={page === 'offers' ? 'nav-active' : ''} aria-current={page === 'offers' ? 'page' : undefined} onClick={() => onChangePage('offers')}>Bandingkan Offer ({offers})</button>
      </nav>
      <button className="nav-add" onClick={onAdd}>+ Catat Lamaran</button>
    </header>
  );
}

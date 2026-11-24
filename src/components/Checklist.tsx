import { useState, type FormEvent } from 'react';
import type { ChecklistItem } from '../types';

interface Props {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
}

export default function Checklist({ items, onChange }: Props) {
  const [text, setText] = useState('');
  const done = items.filter(item => item.done).length;
  function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) return;
    onChange([...items, { id: crypto.randomUUID(), text: text.trim(), done: false }]);
    setText('');
  }
  return (
    <section>
      <h3>Checklist Persiapan</h3>
      <p>{done}/{items.length} selesai</p>
      <progress value={done} max={items.length || 1} />
      <form className="actions" onSubmit={add}>
        <input aria-label="Item checklist" value={text} onChange={e => setText(e.target.value)} placeholder="Tambah persiapan..." />
        <button type="submit">Tambah</button>
      </form>
      {items.length === 0 && <p className="muted">Belum ada checklist.</p>}
      <ul className="checklist">
        {items.map(item => <li key={item.id}>
          <label><input type="checkbox" checked={item.done} onChange={() => onChange(items.map(old =>
            old.id === item.id ? { ...old, done: !old.done } : old
          ))} /><span className={item.done ? 'completed' : ''}>{item.text}</span></label>
          <button type="button" className="danger" onClick={() => onChange(items.filter(old => old.id !== item.id))}>Hapus</button>
        </li>)}
      </ul>
    </section>
  );
}

import { useState, type FormEvent } from 'react';

interface SkillProfileProps {
  skills: string[];
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
}

export default function SkillProfile({ skills, onAddSkill, onRemoveSkill }: SkillProfileProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const skill = input.trim();

    if (skill === '') {
      setError('Skill tidak boleh kosong.');
      return;
    }
    if (skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      setError(`Skill "${skill}" sudah ada.`);
      return;
    }

    onAddSkill(skill);
    setInput('');
    setError('');
  };

  return (
    <section className="jx-panel">
      <h2 className="jx-panel-title">Profil Skill Kapten</h2>
      <p className="jx-muted">Dipakai untuk menghitung persentase kecocokan tiap lowongan.</p>

      <form className="jx-skill-form" onSubmit={handleSubmit}>
        <input
          className="jx-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tambah skill..."
          aria-label="Tambah skill"
        />
        <button type="submit" className="jx-btn jx-btn--primary">Tambah</button>
      </form>
      {error !== '' && <p className="jx-error-text" role="alert">{error}</p>}

      {skills.length === 0 ? (
        <p className="jx-muted">Belum ada skill. Tambahkan minimal satu.</p>
      ) : (
        <ul className="jx-chip-list">
          {skills.map((skill) => (
            <li key={skill} className="jx-chip">
              {skill}
              <button
                type="button"
                className="jx-chip-remove"
                onClick={() => onRemoveSkill(skill)}
                aria-label={`Hapus skill ${skill}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
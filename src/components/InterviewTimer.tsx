import { useEffect, useState } from 'react';

const questions = [
  'Ceritakan tentang diri kamu dan alasan ingin mengikuti magang IT.',
  'Jelaskan proyek coding yang pernah kamu buat dan peranmu dalam proyek tersebut.',
  'Apa perbedaan props dan state pada React?',
  'Bagaimana cara kamu mencari dan memperbaiki bug pada aplikasi?',
  'Bagaimana cara kamu bekerja sama ketika terjadi perbedaan pendapat dalam tim?',
];

export default function InterviewTimer() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [seconds, setSeconds] = useState(120);
  const [running, setRunning] = useState(false);
  const active = running && seconds > 0;

  useEffect(() => {
    if (!active) return;

    const timer = setInterval(() => {
      setSeconds(prev => Math.max(0, prev - 1));
    }, 1000);

    // Hentikan interval saat pause, waktu habis, atau detail ditutup.
    return () => clearInterval(timer);
  }, [active]);

  function reset() {
    setRunning(false);
    setSeconds(120);
  }

  function nextQuestion() {
    setQuestionIndex(prev => (prev + 1) % questions.length);
    reset();
  }

  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  const time = String(minutes).padStart(2, '0') + ':' + String(remainder).padStart(2, '0');

  return (
    <section className="interview-prep">
      <div className="section-heading">
        <h3>Latihan Interview</h3>
        <span className="muted">Soal {questionIndex + 1} / {questions.length}</span>
      </div>
      <p>{questions[questionIndex]}</p>
      <div className="timer-value" role="timer">{time}</div>
      {seconds === 0 && <p className="error" role="status">Waktu habis. Reset atau lanjut ke soal berikutnya.</p>}
      <div className="actions">
        <button type="button" className="primary" disabled={seconds === 0} onClick={() => setRunning(!running)}>
          {active ? 'Pause' : 'Start'}
        </button>
        <button type="button" onClick={reset}>Reset</button>
        <button type="button" onClick={nextQuestion}>Soal Berikutnya</button>
      </div>
    </section>
  );
}

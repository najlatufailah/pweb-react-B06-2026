# Orang 2 - Application Management & State Machine

Branch belajar, bukan aplikasi standalone. Jalankan website dan latihan live-coding dari `integration/final` (snapshot acuan: `cecedff`). File bersama adalah referensi integrasi, bukan klaim kontribusi individu. Gabungkan puzzle dengan menyalin file sesuai path, bukan merge Git biasa.

## File tanggung jawab

- `src/components/ApplicationForm.tsx`: controlled form, validasi, anti-duplikat, fokus input error dengan useRef.
- `src/utils/stateMachine.ts`: peta transisi, validasi status dan anti-duplikat.
- `src/components/ApplicationPipeline.tsx`: search, filter, sorting, skill match dan tombol simulasi.
- `src/components/ApplicationDetail.tsx`: input kondisional status, update lamaran dan Activity Log.
- `src/components/Checklist.tsx`: tambah, centang, hapus item dan progress.
- `src/hooks/useLocalStorage.ts`: lazy initialization dan persistensi menggunakan useEffect.
- `src/utils/ghostingChecker.ts`: deteksi lebih dari 14 hari dan simulasi 15 hari.
- `src/utils/interviewConflict.ts`: deteksi selisih jadwal kurang dari 60 menit.

## File bersama yang wajib dipahami

`src/App.tsx`: `applications`, `addApplication`, `updateApplication`, `deleteApplication`, `undoDelete`, `simulate`, `undoTimer`, dan cleanup effect. Undo menyimpan objek lamaran lengkap dan indeks selama lima detik. `src/types/index.ts`: Application, ApplicationStatus, ChecklistItem, ActivityLog. Banner bentrok versi final dirender oleh Dashboard (bagian orang 3), yang menerima seluruh aplikasi.

## Alur demo

1. Submit form kosong lalu buat WISHLIST; uji duplikat beda kapitalisasi.
2. WISHLIST -> APPLIED (CV dan tanggal wajib) -> SCREENING -> INTERVIEW (jadwal wajib).
3. Buat APPLIED kedua, simulasi +15 hari, cek badge dan statistik, lalu buat jadwal bentrok 30 menit.
4. Tambah dan centang checklist, catat activity log, refresh untuk uji persistensi.
5. Hapus dan Undo sebelum lima detik; uji juga setelah timer habis.

## Latihan live-coding

Ubah batas ghosting atau durasi Undo; jelaskan efek jika clearTimeout dihapus. Tulis ulang update checklist immutable menggunakan map dan spread. Jelaskan kenapa useRef cocok untuk menyimpan timer dan fokus input.

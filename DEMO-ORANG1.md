# Orang 1 - Eksplorasi Lowongan dan Profil Skill

Branch belajar, bukan aplikasi standalone. Untuk menjalankan website, gunakan `integration/final` (snapshot acuan: `cecedff`). Branch ini hanya memuat delapan file tanggung jawab dan panduan ini. File bersama, konfigurasi, dan dependency tersedia di `integration/final`. Untuk rekonstruksi, salin file tanggung jawab ketiga anggota ke baseline file bersama dari final, bukan merge Git biasa.

## File tanggung jawab

- `src/components/SkillProfile.tsx`: controlled form, tambah/hapus skill, anti-duplikat.
- `src/services/jobService.ts`: fetch Remotive, validasi data dan fallback.
- `src/hooks/useDebounce.ts`: tunda keyword 400 ms dan cleanup timeout.
- `src/utils/skillMatcher.ts`: skill match, missing skills dan kategori warna.
- `src/components/JobExplorer.tsx`: fetch lifecycle, filter, sorting, integrasi wishlist.
- `src/components/JobCard.tsx`: render lowongan dan tombol wishlist.
- `src/components/JobExplorer.css`: tampilan eksplorasi.
- `public/magang-fallback.json`: 15 lowongan lokal.

## File bersama yang perlu dibaca (buka di integration/final)

`src/App.tsx`: state `kaptenSkills`, `applications`, dan fungsi `saveWishlist`; `src/types/index.ts`: JobListing dan Application. Persistensi melalui `useLocalStorage` (bagian orang 2).

## Alur demo

1. Pilih Remotive, uji loading/error/retry dan dataset lokal.
2. Tambahkan Docker pada profil dan amati skor lowongan AwanMerdeka Cloud.
3. Ketik keyword cepat dan jelaskan debounce 400 ms.
4. Filter kategori, ubah sorting, simpan lowongan ke Wishlist, dan periksa tombol duplikat.

## Latihan live-coding

Jelaskan dependency `useEffect`, cleanup `AbortController`, alasan state skill berada di App, serta cara mengubah delay debounce atau batas warna skor. Jalankan latihan pada `integration/final` agar seluruh dependency tersedia.

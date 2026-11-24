# Orang 3 - Dashboard, Interview Timer dan Offer Comparator

Branch belajar, bukan aplikasi standalone. Jalankan website dan latihan live-coding dari `integration/final` (snapshot acuan: `cecedff`). Branch ini hanya memuat tujuh file tanggung jawab dan panduan ini. File bersama, konfigurasi, dan dependency tersedia di `integration/final`. Untuk rekonstruksi, salin file tanggung jawab ketiga anggota ke baseline file bersama dari final, bukan merge Git biasa.

## File tanggung jawab

- `src/components/Dashboard.tsx`: dashboard dan banner bentrok global.
- `src/components/Statistics.tsx`: lima kartu statistik dari data aplikasi.
- `src/utils/statistics.ts`: total, response rate, interview rate, ghosting, offer.
- `src/components/InterviewTimer.tsx`: timer 120 detik, soal, start/pause/reset/next dan cleanup interval.
- `src/utils/offerCalculator.ts`: bobot gaji 50%, mode kerja 25%, skill match 25%.
- `src/components/OfferComparator.tsx`: pilih dua offer berbeda, skor dan rekomendasi.
- `src/components/Navbar.tsx`: navigasi aplikasi.

## File bersama yang perlu dipahami (buka di integration/final)

`src/App.tsx`: state halaman, conditional rendering, props Dashboard/Navbar/OfferComparator dan timer sebagai children ApplicationDetail. `src/App.css`: layout dan responsive CSS. `src/types/index.ts`: Application dan WorkMode. Statistik dan comparator memakai helper orang 1/2 dari aplikasi final; helper tersebut sengaja tidak diduplikasi di branch ini.

## Alur demo

1. Tunjukkan lima kartu statistik dan perubahan ketika lamaran dibuat, status berubah, atau ghosting disimulasikan.
2. Buka detail lamaran, start/pause/reset timer dan ganti pertanyaan. Tutup saat berjalan, buka ulang, cek 02:00.
3. Uji empty state comparator ketika offer kurang dari dua. Buat dua OFFER dengan gaji dan mode kerja berbeda.
4. Jelaskan normalisasi gaji terhadap gaji tertinggi dari pasangan, bobot mode dan kecocokan skill; bandingkan rekomendasi.
5. Uji perpindahan halaman dan tampilan responsive.

## Latihan live-coding

Ubah durasi timer atau tambahkan pertanyaan. Jelaskan dependency active dan cleanup clearInterval. Ubah bobot penilaian dengan total tetap 100% dan jelaskan derived state (tidak menyimpan statistik sebagai state terpisah).

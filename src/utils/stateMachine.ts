import type { Application, ApplicationStatus } from '../types';

// Hanya status yang tercantum di sini yang boleh dituju.
export const transitions: Record<ApplicationStatus, ApplicationStatus[]> = {
  WISHLIST: ['APPLIED'],
  APPLIED: ['SCREENING', 'REJECTED', 'GHOSTED'],
  SCREENING: ['INTERVIEW', 'REJECTED', 'GHOSTED'],
  INTERVIEW: ['OFFER', 'REJECTED'],
  OFFER: [],
  REJECTED: [],
  GHOSTED: ['SCREENING'],
};

export function validateTransition(current: Application, next: Application): string {
  if (!transitions[current.status].includes(next.status)) return 'Perpindahan status tidak valid.';
  if (next.status === 'APPLIED' && (!next.cvVersion?.trim() || !next.appliedDate)) {
    return 'Versi CV dan tanggal melamar wajib diisi.';
  }
  if (next.status === 'INTERVIEW' && (!next.interviewDateTime || !Number.isFinite(Date.parse(next.interviewDateTime)))) {
    return 'Jadwal interview wajib valid.';
  }
  if (next.status === 'OFFER' && (!next.salaryOffer || !Number.isFinite(next.salaryOffer) || next.salaryOffer <= 0 ||
    !['Remote', 'Hybrid', 'Onsite'].includes(next.workMode))) {
    return 'Gaji harus lebih dari 0 dan mode kerja wajib dipilih.';
  }
  return '';
}

export function isDuplicate(applications: Application[], company: string, role: string): boolean {
  return applications.some(app =>
    app.company.trim().toLowerCase() === company.trim().toLowerCase() &&
    app.role.trim().toLowerCase() === role.trim().toLowerCase()
  );
}
